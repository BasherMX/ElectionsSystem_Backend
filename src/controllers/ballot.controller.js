import { pool } from "../db/db.js";

import {
  generateId,
  hasDuplicateNumbers,
} from "../helpers/ballot.helper.js";

// --- GET ALL BallotS ---
export const getAllEnableBallots = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Ballot WHERE status = 1 ");
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching Ballots",
    });
  }
};

// --- GET ALL BallotS ---
export const getAllDisableBallots = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Ballot WHERE status = 0 ");
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching Ballots",
    });
  }
};

// --- GET BallotS BY PARTY ID ---
export const getBallotById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM Ballot WHERE Ballot_id = ?",
      [id]
    );
    if (rows.length === 0) {
      res.status(404).send({
        error: "Ballot not found",
      });
    } else {
      res.send(rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error searching Ballot",
    });
  }
};

// --- CREATE BallotS ---

export const createBallot = async (req, res) => {
  try {
    const { charge_id, state_id, candidate_ids, election_date } = req.body;

    // Check for missing required fields
    const requiredFields = ["charge_id","state_id","candidate_ids","election_date",];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      const error = `The following fields are required: ${missingFields.join(", ")}`;
      return res.status(400).send({
        error,
      });
    }

    //chek if not exist the same ballot
    const [checkBallot] = await pool.query(
      "SELECT * FROM ballot Where state_id = ? AND candidates_ids = ? AND election_date = ?",
      [state_id, JSON.stringify(candidate_ids), election_date]
    );
    if (checkBallot.length != 0) {
      const error = `Ya existe una boleta con estos datos`;
      return res.status(400).send({
        error,
      });
    }

    //getAcronym by state_id
    const [stateAcronym] = await pool.query(
      "SELECT acronym FROM state Where state_id = ?",
      [state_id]
    );

    //generate id
    const BallotId = generateId(stateAcronym[0].acronym, charge_id);

    // Check if candidate_ids is iterable
    if (!Array.isArray(candidate_ids)) {
      return res.status(400).send({
        error: "candidate_ids must be an array",
      });
    }

    // Check for duplicate candidates
    if (hasDuplicateNumbers(candidate_ids)) {
      return res.status(400).send({
        error: "existen candidatos duplicados",
      });
    }

    // Get and Check duplicate party_ids
    const partyIds = [];
    for (const candidate_id of candidate_ids) {
      const [rows] = await pool.query(
        "SELECT * FROM Candidate WHERE candidate_id = ? AND enable = 1",
        [candidate_id]
      );
      if (rows.length === 0) {
        const error = `Candidate with ID ${candidate_id} does not exist or is disable`;
        return res.status(400).send({
          error,
        });
      }

      const party_id = rows[0].party_id;
      if (partyIds.includes(party_id)) {
        const error = `Candidate ${rows[0].name} have duplicate party ID`;
        return res.status(400).send({
          error,
        });
      }

      const status = rows[0].status;
      if (status === 1) {
        const error = `Candidate ${rows[0].name} it's already in a ballot`;
        return res.status(400).send({
          error,
        });
      }
      partyIds.push(party_id);
    }

    //Create a ballot
    const [result] = await pool.query(
      "INSERT INTO Ballot (ballot_id, charge_id, state_id, candidates_ids, election_date)  VALUES (?, ?, ?,?, ?)",
      [
        BallotId,
        charge_id,
        state_id,
        JSON.stringify(candidate_ids),
        election_date,
      ]
    );
    if (result.affectedRows === 0) {
      return res.status(400).send({
        error: "Error creating ballot",
      });
    }

    // Create a relate ballot_candidate
    for (const candidate_id of candidate_ids) {
      const [rows] = await pool.query(
        "INSERT INTO ballot_candidate (ballot_id, candidate_id) VALUES (?, ?)",
        [BallotId, candidate_id]
      );
      if (rows.affectedRows === 0) {
        const error = `Hubo un error en la creacion de la boleta Ballot_candidate`;
        await pool.query("DELETE FROM ballot WHERE ballot_id = ?", [BallotId]);
        return res.status(400).send({
          error,
        });
      }

      const [upsrows] = await pool.query(
        "UPDATE candidate set status = true where candidate_id = ?",
        [candidate_id]
      );
      if (upsrows.affectedRows === 0) {
        const error = `Exist an error`;
        return res.status(400).send({
          error,
        });
      }
    }

    res.send({
      message: "Ballot created successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error creating ballot",
    });
  }
};



// --- DELETE BallotS ---
export const disableBallot = async (req, res) => {
  try {
    const { id } = req.params;
    const [Ballot] = await pool.query(
      "SELECT * FROM Ballot WHERE Ballot_id = ?",
      [id]
    );
    if (Ballot.length === 0) {
      return res.status(404).send({
        error: "Ballot not found",
      });
    }
    if (Ballot[0].status === 0) {
      return res.status(400).send({
        error: "Ballot already deleted",
      });
    }
    await pool.query("UPDATE Ballot SET status = false WHERE Ballot_id = ?", [
      id,
    ]);
    res.send({
      message: "Ballot deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error deleting Ballot",
    });
  }
};

// --- RECOVER BallotS ---
export const enableBallot = async (req, res) => {
  try {
    const { id } = req.params;
    const [Ballot] = await pool.query(
      "SELECT * FROM Ballot WHERE Ballot_id = ?",
      [id]
    );
    if (Ballot.length === 0) {
      return res.status(404).send({
        error: "Ballot not found",
      });
    }
    if (Ballot[0].status === 1) {
      return res.status(400).send({
        error: "Ballot already recovered",
      });
    }
    await pool.query("UPDATE Ballot SET status = true WHERE Ballot_id = ?", [
      id,
    ]);
    res.send({
      message: "Ballot recovered successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error deleting Ballot",
    });
  }
};
