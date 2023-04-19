import { pool } from "../db/db.js";
import { createPassword } from "../helpers/user.helper.js";
import { v4 } from "uuid";	
  
  // --- GET ALL USERS ---
  export const getAllUsers = async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT *,
        CONCAT(electorPermission,candidatePermission, ballotPermission,
          excercisePermission, politicalPartyPermission, usersPermission,
          verificateElectorPermission) as permissions
        FROM User`);
  
        const users = rows.map(row => ({
            user_id: row.user_id,
            name: row.name,
            first_lastname: row.first_lastname,
            second_lastname: row.second_lastname,
            user_type: row.user_type,
            enable: row.enable,
            email: row.email,
            verified_acount: row.verified_acount,
            permissions: {
                electorPermission: row.permissions[0],
                candidatePermission: row.permissions[1],
                ballotPermission: row.permissions[2],
                excercisePermission: row.permissions[3],
                politicalPartyPermission: row.permissions[4],
                usersPermission: row.permissions[5],
                verificateElectorPermission: row.permissions[6],
            }
        }));
  
      res.send(users);
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: 'Error fetching Users'
      });
    }
  };
  
  
  // --- GET USERS BY ID ---
  export const getUserById = async (req, res) => {
    try {
      const {
        id
      } = req.params;
      const [rows] = await pool.query('SELECT * FROM User WHERE User_id = ?', [id]);
      if (rows.length === 0) {
        res.status(404).send('User not found');
      } else {
        res.send(rows[0]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error searching User');
    }
  }
  
  // --- CREATE USERS ---
  export const createUser = async (req, res) => {
   
    try {
        const { name, first_lastname, second_lastname, user_type, email } = req.body;
        const requiredFields = ['name', 'first_lastname', 'second_lastname', 'user_type', 'email'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
          const error = `The following fields are required: ${missingFields.join(', ')}`;
          return res.status(400).send({ error });
        }
      
        const [result] = await pool.query('SELECT * FROM User WHERE name = ? AND first_lastname = ? AND second_lastname = ?', [name, first_lastname, second_lastname]);
        if (result.length > 0) {
          return res.status(400).send({
            error: 'User already exists'
          });
        }

        const user_id = v4();
        const passwordAux = createPassword();
        

        await pool.query('INSERT INTO User (user_id,name, first_lastname, second_lastname, user_type, password, email) VALUES (?, ?, ?, ?, ?, ?,?)', 
        [user_id,name, first_lastname, second_lastname, user_type, passwordAux, email ]);
        
        //update permissions
        updatePermissions(user_id ,user_type);
        
        //send confirmation link by email like:
        //http://localhost:3000/user/confirmAcount/user_id
        //codify password

        res.send({
            message: 'User created successfully'
        });
        
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: 'Error creating User'
      });
    }
}

// - - - UPDATE PERMISSIONS - - -
function updatePermissions(user_id ,user_type) {
    switch (user_type) {
        case 1:
            pool.query('UPDATE user SET candidatePermission = 1, ballotPermission = 1, excercisePermission = 1, politicalPartyPermission = 1, usersPermission = 1 WHERE user_id = ?', [user_id]);
            break;
        case 2:
            pool.query('UPDATE user SET electorPermission = 1 WHERE user_id = ?', [user_id]);
            break;
        case 3:
            pool.query('UPDATE user SET verificateElectorPermission = 1 WHERE user_id = ?', [user_id]);
            break;
        default:
            console.log("Error updating permissions");
            break;
    }
}
  
  
// --- UPDATE USERS ---
export const updateUser = async (req, res) => {
    try{
        const { id } = req.params;
        const { name, first_lastname, second_lastname, user_type, email } = req.body;

        const [result] = await pool.query('UPDATE User SET name = IFNULL(?,name), first_lastname = IFNULL(?,first_lastname), second_lastname = IFNULL(?,second_lastname), user_type = IFNULL(?,user_type), email = IFNULL(?,email) WHERE user_id = ?',
        [name, first_lastname, second_lastname, user_type, email, id]);

        const [resultCheck] = await pool.query('SELECT * FROM User WHERE User_id = ?', [id]);
        if(resultCheck.user_type != user_type){
            updatePermissions(id ,user_type);
        }

        res.send({
            message: 'User updated successfully',
            affected: result.affectedRows
        });

  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Error updating User'
    });
  }
}
  
  // --- DELETE USERS ---
  export const disableUser = async (req, res) => {
    try {
      const {
        id
      } = req.params;
      const [User] = await pool.query('SELECT * FROM User WHERE User_id = ?', [id]);
      if (User.length === 0) {
        return res.status(404).send({
          error: 'User not found'
        });
      }
      if (User[0].enable === 0) {
        return res.status(400).send({
          error: 'User already deleted'
        });
      }
      await pool.query('UPDATE User SET enable = false WHERE User_id = ?', [id]);
      res.send({
        message: 'User deleted successfully'
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting User');
    }
  };
  
  // --- RECOVER USERS ---
  export const enableUser = async (req, res) => {
    try {
      const {
        id
      } = req.params;
      const [User] = await pool.query('SELECT * FROM User WHERE User_id = ?', [id]);
      if (User.length === 0) {
        return res.status(404).send({
          error: 'User not found'
        });
      }
      if (User[0].enable === 1) {
        return res.status(400).send({
          error: 'User already recovered'
        });
      }
      await pool.query('UPDATE User SET enable = true WHERE User_id = ?', [id]);
      res.send({
        message: 'User recovered successfully'
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting User');
    }
  };

  // --- VERIFY USERS ACOUNT ---
  export const verifyAccount = async (req, res) => {
    try {
      const { id } = req.params;
      const [User] = await pool.query('SELECT * FROM User WHERE User_id = ?', [id]);
      if (User.length === 0) {
        return res.status(404).send({
          error: 'User not found'
        });
      }
      if (User[0].verified_acount === 1) {
        return res.status(400).send({
          error: 'User already verified'
        });
      }

      await pool.query('UPDATE User SET verified_acount = true WHERE User_id = ?', [id]);
      res.send({
        message: 'User verified successfully'
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error verifing User');
    }
  };