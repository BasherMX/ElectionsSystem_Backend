import { pool } from "../db/db.js";
import { generateId } from "../helpers/elector.helper.js";
  
  // --- GET ALL ELECTORS ---
  export const getAllEnableElectors = async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM elector WHERE enable = 1');
      res.send(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: 'Error fetching elector'
      });
    }
  }

  // --- GET ALL ELECTORS ---
  export const getAllDisableElectors = async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM elector WHERE enable = 0');
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
        res.status(404).send({
          error: 'Elector not found'
        });
      } else {
        res.send(rows[0]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: 'Error searching elector'
      });
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
            res.send({
              message: "elector created successfully"
            });
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
     
      res.send({
        message:"Candidate updated successfully"
      });

    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: 'Error updating elector'
      });
    }
  }

  
  // --- DELETE ELECTORS ---
  export const disableElector = async (req, res) => {
    try {
      const { id } = req.params;
      const [elector] = await pool.query('SELECT * FROM elector WHERE elector_id = ?', [id]);
      if (elector.length === 0) {
        return res.status(404).send({ error: 'Elector not found' });
      }

      if (elector[0].enable === 0) {
        return res.status(400).send({ error: 'Elector already deleted' });
      }

      await pool.query('UPDATE elector SET enable = false WHERE elector_id = ?', [id]);
      res.send({
        message: 'Elector deleted successfully'
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: 'Error deleting elector'
      });
    }
  };

  
  // --- RECOVER ELECTORS ---
  export const enableElector = async (req, res) => {
    try {
      const { id } = req.params;
      const [elector] = await pool.query('SELECT * FROM elector WHERE elector_id = ?', [id]);
      if (elector.length === 0) {
        return res.status(404).send({ error: 'Elector not found' });
      }

      if (elector[0].enable === 1) {
        return res.status(400).send({ error: 'Elector already enabled' });
      }

      await pool.query('UPDATE elector SET enable = true WHERE elector_id = ?', [id]);
      res.send({
        message: 'Elector enabled successfully',
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: 'Error enabling elector'
      });
    }
  };
  
  
  
  


  