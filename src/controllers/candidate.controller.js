import {
  pool
} from "../db.js";

// --- GET ALL CANDIDATES ---
export const getAllCandidates = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM candidate');
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
      res.status(404).send('Candidate not found');
    } else {
      res.send(rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error searching candidate');
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
    if (!name) {
      return res.status(400).send({
        error: 'The name is required'
      });
    } else if (!first_lastname) {
      return res.status(400).send({
        error: 'The first lastname is required'
      });
    } else if (!second_lastname) {
      return res.status(400).send({
        error: 'The second lastname is required'
      });
    } else if (!pseudonym) {
      return res.status(400).send({
        error: 'The pseudonym is required'
      });
    } else if (!party_id) {
      return res.status(400).send({
        error: 'The party ID is required'
      });
    }

    const [result] = await pool.query('SELECT * FROM candidate WHERE name = ? AND first_lastname = ? AND second_lastname = ?', [name, first_lastname, second_lastname]);
    if (result.length > 0) {
      return res.status(400).send({
        error: 'Candidate already exists'
      });
    } else {
      await pool.query('INSERT INTO candidate (name, first_lastname, second_lastname, pseudonym, party_id) VALUES (?, ?, ?, ?, ?)', [name, first_lastname, second_lastname, pseudonym, party_id]);
      res.send("Candidate created successfully");
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
  console.log("updateCandidate");
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
    const [party] = await pool.query('SELECT * FROM political_party WHERE party_id = ?', [party_id]);
    if (party.length === 0) {
      return res.status(400).send({
        error: 'Invalid party_id'
      });
    }
    const [result] = await pool.query('UPDATE candidate SET name = IFNULL(?,name), first_lastname = IFNULL(?,first_lastname), second_lastname = IFNULL(?,second_lastname), pseudonym = IFNULL(?,pseudonym), party_id = ? WHERE candidate_id = ?',
      [name, first_lastname, second_lastname, pseudonym, party_id, id]);
    res.send("Candidate updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Error updating candidate'
    });
  }
}

// // --- DELETE CANDIDATES ---
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

// // --- RECOVER CANDIDATES ---
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




