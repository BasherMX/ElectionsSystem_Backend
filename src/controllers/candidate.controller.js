import {
  pool
} from "../db/db.js";

// --- GET ALL ENABLE CANDIDATES ---
export const getAllEnableCandidates = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM candidate WHERE enable = 1 ');
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Error fetching candidates'
    });
  }
}

// --- GET ALL DISABLE CANDIDATES ---
export const getAllDisableCandidates = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM candidate WHERE enable = 0 ');
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Error fetching candidates'
    });
  }
}

// --- GET ALL NOT ASSIGNED CANDIDATES ---
export const getAllNotAssignedCandidates = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM candidate WHERE status = 0 ');
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Error fetching candidates'
    });
  }
}

// --- GET CANDIDATES BY PARTY ID ---
export const getCandidateById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const [rows] = await pool.query('SELECT * FROM candidate WHERE candidate_id = ?', [id]);
    if (rows.length === 0) {
      res.status(404).send({
        error: 'Candidate not found'
      });
    } else {
      res.send(rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Error searching candidate'
    });
  }
}

// --- CREATE CANDIDATES ---
export const createCandidate = async (req, res) => {
  try {
    const {
      name,
      first_lastname,
      second_lastname,
      pseudonym,
      party_id
    } = req.body;
    const requiredFields = ['name',
      'first_lastname',
      'second_lastname',
      'pseudonym',
      'party_id'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      const error = `The following fields are required: ${missingFields.join(', ')}`;
      return res.status(400).send({ error });
    }
    

    const [result] = await pool.query('SELECT * FROM candidate WHERE name = ? AND first_lastname = ? AND second_lastname = ?', [name, first_lastname, second_lastname]);
    if (result.length > 0) {
      return res.status(400).send({
        error: 'Candidate already exists'
      });
    } else {
      await pool.query('INSERT INTO candidate (name, first_lastname, second_lastname, pseudonym, party_id) VALUES (?, ?, ?, ?, ?)', [name, first_lastname, second_lastname, pseudonym, party_id]);
      res.send({
        message: "Candidate created successfully"
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Error creating candidate'
    });
  }
}


// --- UPDATE CANDIDATES ---
export const updateCandidate = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const {
      name,
      first_lastname,
      second_lastname,
      pseudonym,
      party_id
    } = req.body;
    const [candidate] = await pool.query('SELECT * FROM candidate WHERE candidate_id = ?', [id]);
    if (candidate.length === 0) {
      return res.status(404).send({
        error: 'Candidate not found'
      });
    }

    const [result] = await pool.query('UPDATE candidate SET name = IFNULL(?,name), first_lastname = IFNULL(?,first_lastname), second_lastname = IFNULL(?,second_lastname), pseudonym = IFNULL(?,pseudonym), party_id = IFNULL(?,party_id) WHERE candidate_id = ?',
      [name, first_lastname, second_lastname, pseudonym, party_id, id]);
    res.send({
      message: "Candidate updated successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Error updating candidate'
    });
  }
}

// --- DELETE CANDIDATES ---
export const disableCandidate = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const [candidate] = await pool.query('SELECT * FROM candidate WHERE candidate_id = ?', [id]);
    if (candidate.length === 0) {
      return res.status(404).send({
        error: 'Candidate not found'
      });
    }
    if (candidate[0].enable === 0) {
      return res.status(400).send({
        error: 'Candidate already deleted'
      });
    }
    await pool.query('UPDATE candidate SET enable = false WHERE candidate_id = ?', [id]);
    res.send({
      message: 'Candidate deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Error deleting candidate'
    });
  }
};

// --- RECOVER CANDIDATES ---
export const enableCandidate = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const [candidate] = await pool.query('SELECT * FROM candidate WHERE candidate_id = ?', [id]);
    if (candidate.length === 0) {
      return res.status(404).send({
        error: 'Candidate not found'
      });
    }
    if (candidate[0].enable === 1) {
      return res.status(400).send({
        error: 'Candidate already recovered'
      });
    }
    await pool.query('UPDATE candidate SET enable = true WHERE candidate_id = ?', [id]);
    res.send({
      message: 'Candidate recovered successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Error deleting candidate'
    });
  }
};