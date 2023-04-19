import { pool } from "../db/db.js";

// --- GET ALL POLITICAL PARTIES ---
export const getAllParties = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM political_party');
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Error fetching political parties'
    });
  }
}

// --- GET POLITICAL PARTY BY ID ---
export const getPartyById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM political_party WHERE party_id = ?', [id]);
    if (rows.length === 0) {
      res.status(404).send('Political party not found');
    } else {
      res.send(rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error searching political party');
  }
}

// --- CREATE POLITICAL PARTY ---
export const createParty = async (req, res) => {
  try {
    const { name, acronym, foundation, img_logo, color_hdx } = req.body;
    if (!name) {
      return res.status(400).send({ error: 'The name is required' });
    } else if (!acronym) {
      return res.status(400).send({ error: 'The acronym is required' });
    } else if (!foundation) {
      return res.status(400).send({ error: 'The foundation date is required' });
    } else if (!img_logo) {
      return res.status(400).send({ error: 'The image logo URL is required' });
    } else if (!color_hdx) {
      return res.status(400).send({ error: 'The HDX color code is required' });
    }

    const [result] = await pool.query('SELECT * FROM political_party WHERE name = ? OR acronym = ?', [name, acronym]);
    if (result.length > 0) {
      return res.status(400).send({ error: 'Political party already exists' });
    } else {
      await pool.query('INSERT INTO political_party (name, acronym, foundation, img_logo, color_hdx) VALUES (?, ?, ?, ?, ?)', [name, acronym, foundation, img_logo, color_hdx]);
      res.send("Political party created successfully");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Error creating political party' });
  }
}


// --- UPDATE CANDIDATES ---
export const updateCandidate = async (req, res) => {
    console.log("updateCandidate");
    try {
      const { id } = req.params;
      const { name, first_lastname, second_lastname, pseudonym, party_id } = req.body;
      
      const [candidate] = await pool.query('SELECT * FROM candidate WHERE candidate_id = ?', [id]);
      if (candidate.length === 0) {
        return res.status(404).send({ error: 'Candidate not found' });
      }
      
      const [party] = await pool.query('SELECT * FROM political_party WHERE party_id = ?', [party_id]);
      if (party.length === 0) {
        return res.status(400).send({ error: 'Invalid party_id' });
      }
      
      const [result] = await pool.query('UPDATE candidate SET name = IFNULL(?,name), first_lastname = IFNULL(?,first_lastname), second_lastname = IFNULL(?,second_lastname), pseudonym = IFNULL(?,pseudonym), party_id = ? WHERE candidate_id = ?',
        [name, first_lastname, second_lastname, pseudonym, party_id, id]);
      
      res.send("Candidate updated successfully");
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'Error updating candidate' });
    }
  }

  