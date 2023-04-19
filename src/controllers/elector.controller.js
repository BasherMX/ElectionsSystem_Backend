import { pool } from "../db.js";
  
  // --- GET ALL ELECTORS ---
  export const getAllElectors = async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM elector');
      res.send(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: 'Error fetching elector'
      });
    }
  }
  
  // --- GET ELECTORS BY PARTY ID ---
  export const getElectorById = async (req, res) => {
    try {
      const {
        id
      } = req.params;
      const [rows] = await pool.query('SELECT * FROM elector WHERE elector_id = ?', [id]);
      if (rows.length === 0) {
        res.status(404).send('Elector not found');
      } else {
        res.send(rows[0]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error searching elector');
    }
  }
  
  // --- CREATE ELECTORS ---
  export const createElector = async (req, res) => {
    try {
        const { name, first_lastname, second_lastname, date_of_birth, street, outer_number, interior_number,zip_code, state_id, picture, gender, email } = req.body;
        const requiredFields = ['name', 'first_lastname', 'second_lastname', 'date_of_birth', 'street', 'outer_number', 'interior_number','zip_code', 'state_id', 'picture', 'gender', 'email'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
          const error = `The following fields are required: ${missingFields.join(', ')}`;
          return res.status(400).send({ error });
        }

        const id = generateId(first_lastname, second_lastname, date_of_birth, name);
        const [result] = await pool.query('SELECT * FROM elector WHERE name = ? AND first_lastname = ? AND second_lastname = ? AND date_of_birth = ?', [name, first_lastname, second_lastname, date_of_birth]);
        if (result.length > 0) {
            return res.status(400).send({
            error: 'elector already exists'
            });
        } else {
            await pool.query(`INSERT INTO elector (elector_id, name, first_lastname, second_lastname, date_of_birth, street, outer_number, interior_number,zip_code, state_id, picture, gender, email) 
            VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?)`, [id, name, first_lastname, second_lastname, date_of_birth, street, outer_number, interior_number,zip_code, state_id, picture, gender, email]);
            res.send("elector created successfully");
        }

    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: 'Error creating elector'
      });
    }
  }

  
  
  // --- UPDATE ELECTORS ---
  export const updateElector = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, first_lastname, second_lastname, date_of_birth, street, outer_number, interior_number,zip_code, state_id, picture, gender, email } = req.body;
      
      const [candidate] = await pool.query('SELECT * FROM elector WHERE elector_id = ?', [id]);
      if (candidate.length === 0) {
        return res.status(404).send({
          error: 'Candidate not found'
        });
      }

      await pool.query('UPDATE elector SET name = IFNULL(?, name), first_lastname = IFNULL(?, first_lastname), second_lastname = IFNULL(?, second_lastname), date_of_birth = IFNULL(?, date_of_birth), street = IFNULL(?, street), outer_number = IFNULL(?, outer_number), interior_number = IFNULL(?, interior_number),zip_code = IFNULL(?, zip_code), state_id = IFNULL(?, state_id), picture = IFNULL(?, picture), gender = IFNULL(?, gender), email = IFNULL(?, email) WHERE elector_id = ?',
      [name, first_lastname, second_lastname, date_of_birth, street, outer_number, interior_number,zip_code, state_id, picture, gender, email,id]);
     
      res.send("Candidate updated successfully");

    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: 'Error updating elector'
      });
    }
  }


  
  // // --- DELETE ELECTORS ---
  // export const disableCandidate = async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const [candidate] = await pool.query('SELECT * FROM candidate WHERE candidate_id = ?', [id]);
  //     if (candidate.length === 0) {
  //       return res.status(404).send({ error: 'Candidate not found' });
  //     }
  //     if (candidate[0].enable === 0) {
  //       return res.status(400).send({ error: 'Candidate already deleted' });
  //     }
  //     await pool.query('UPDATE candidate SET enable = false WHERE candidate_id = ?', [id]);
  //     res.send({
  //       message: 'Candidate deleted successfully',
  //       deletedCandidate: candidate[0].name + " " + candidate[0].first_lastname + " " + candidate[0].second_lastname
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).send('Error deleting candidate');
  //   }
  // };
  
  // // --- RECOVER ELECTORS ---
  // export const enableCandidate = async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const [candidate] = await pool.query('SELECT * FROM candidate WHERE candidate_id = ?', [id]);
  //     if (candidate.length === 0) {
  //       return res.status(404).send({ error: 'Candidate not found' });
  //     }
  //     if (candidate[0].enable === 1) {
  //       return res.status(400).send({ error: 'Candidate already recovered' });
  //     }
  //     await pool.query('UPDATE candidate SET enable = true WHERE candidate_id = ?', [id]);
  //     res.send({
  //       message: 'Candidate recovered successfully',
  //       deletedCandidate: candidate[0].name + " " + candidate[0].first_lastname + " " + candidate[0].second_lastname
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).send('Error deleting candidate');
  //   }
  // };
  
  
  
  
  function generateId(firstLastName, secondLastName, dateOfBirth, firstName) {
    let id = "";
    let randomChars = "";

    firstName = removeAccents(firstName);
    secondLastName = removeAccents(secondLastName);
    firstLastName = removeAccents(firstLastName);

    id += firstLastName.substring(0, 3);
    id += secondLastName.substring(0, 1);

    const birthDate = new Date(dateOfBirth);

    id += birthDate.getDate().toString().padStart(2, "0");
    id += birthDate.getFullYear().toString();
    id += firstName.substring(0, 2);

    for (let i = 0; i < 4; i++) {
      randomChars += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }
    id += randomChars;

    return id.toUpperCase();
  }
  
  function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }