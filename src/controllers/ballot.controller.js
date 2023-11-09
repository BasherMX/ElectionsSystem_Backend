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
    const { charge_id, exercise_id, candidates } = req.body;

    // Check for missing required fields in the request
    const requiredFields = ["charge_id", "exercise_id", "candidates"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      const error = `The following fields are required: ${missingFields.join(", ")}`;
      return res.status(400).send({ error });
    }

    // Check for existing ballot with the same charge_id and exercise_id
    const [existingBallot] = await pool.query("SELECT * FROM election_exercise_ballot WHERE charge_id = ? AND exercise_id = ?", [charge_id, exercise_id]);
    if (existingBallot.length > 0) {
      return res.status(400).send({ error: `A ballot already exists for this charge` });
    }

    // Check if the charge_id exists
    const [existingCharge] = await pool.query("SELECT * FROM charge WHERE charge_id = ?", [charge_id]);
    if (existingCharge.length === 0) {
      return res.status(404).send({ error: `Charge does not exist` });
    }

    // Check if the charge_id exists
    const [existingExercise] = await pool.query("SELECT * FROM election_exercise WHERE exercise_id = ?", [exercise_id]);
    if (existingExercise.length === 0) {
      return res.status(404).send({ error: `Exercise does not exist` });
    }

    

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const partyIds = new Set();
      const candidateNames = new Set();

      for (const candidate of candidates) {
        const { name, first_lastname, second_lastname, party_id } = candidate;

        if (partyIds.has(party_id)) {
          throw new Error(`Duplicate party ID ${party_id} found`);
        }
        partyIds.add(party_id);

        const fullName = `${name} ${first_lastname} ${second_lastname}`;
        if (candidateNames.has(fullName)) {
          throw new Error(`Duplicate candidate name ${fullName} found`);
        }
        candidateNames.add(fullName);
      }

      const stateAcronymQuery = await pool.query(
        "SELECT ee.state_id, s.acronym FROM election_exercise as ee JOIN state as s ON ee.state_id = s.state_id WHERE ee.exercise_id = ?",
        [exercise_id]
      );
      const [stateAcronym] = stateAcronymQuery;
      const BallotId = generateId(stateAcronym[0].acronym, charge_id);

      const [result] = await connection.query(
        "INSERT INTO Ballot (ballot_id, charge_id) VALUES (?, ?)",
        [BallotId, charge_id]
      );
      if (result.affectedRows === 0) {
        throw new Error("Error creating ballot");
      }

      await connection.query("INSERT INTO election_exercise_ballot (ballot_id, exercise_id, charge_id) VALUES (?, ?, ?)", [BallotId, exercise_id, charge_id]);

      for (const candidate of candidates) {
        const { name, first_lastname, second_lastname, pseudonym, party_id } = candidate;
          const [candidateInsertResult] = await connection.query(
            "INSERT INTO candidate (name, first_lastname, second_lastname, pseudonym, party_id) VALUES (?, ?, ?, ?, ?)",
            [name, first_lastname, second_lastname, pseudonym, party_id]
          );
          const candidateId = candidateInsertResult.insertId;
          await connection.query("INSERT INTO ballot_candidate (ballot_id, candidate_id) VALUES (?, ?)", [BallotId, candidateId]);
        }
      //}

      await connection.commit();

      res.send({
        message: "Ballot and candidates created successfully",
      });
    } catch (error) {
      await connection.rollback();
      console.error(error);
      return res.status(400).send({ error: error.message });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error creating ballot and candidates",
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
