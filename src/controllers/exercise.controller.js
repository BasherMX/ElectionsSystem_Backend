import { pool } from "../db/db.js";
import { generateId } from "../helpers/ballot.helper.js";

// --- GET ALL ENABLE election Exercises ---
export const getAllEnableExercises = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM election_Exercise WHERE enable = 1"
    );
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching election Exercises",
    });
  }
};


// --- GET ALL DISABLE election Exercises ---
export const getAllDisableExercises = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM election_Exercise WHERE enable = 0"
    );
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching election Exercises",
    });
  }
};


// --- GET ALL NOT ASSIGNED election Exercises ---
export const getAllNotAssignedExercises = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM election_Exercise WHERE status = 0"
    );
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching election Exercises",
    });
  }
};


// --- GET election Exercise BY ID ---
export const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM election_Exercise WHERE Exercise_id = ?",
      [id]
    );
    if (rows.length === 0) {
      res.status(404).send({
        error: "election Exercise not found",
      });
    } else {
      res.send(rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error searching election Exercise",
    });
  }
};


// --- CREATE election Exercise ---
export const createExercise = async (req, res) => {
  try {
    const { election_type_id, state_id, date } = req.body;
    const requiredFields = ["election_type_id", "state_id", "date"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      const error = `Los siguientes campos son requeridos: ${missingFields.join(
        ", "
      )}`;
      return res.status(400).send({ error });
    }

    const now = new Date().getTime();
    const selectedDate = new Date(date).getTime();
    if (selectedDate <= now) {
      return res.status(400).send({ error: "La fecha debe ser una fecha futura válida" });
    }

    const [result] = await pool.query(
      "SELECT * FROM election_Exercise WHERE state_id = ? AND date = ?",
      [state_id, date]
    );
    if (result.length > 0) {
      return res
        .status(400)
        .send({ error: "Ya existe un ejercicio con estos datos" });
    }

    const [stateAcronym] = await pool.query(
      "SELECT acronym FROM state Where state_id = ?",
      [state_id]
    );
    const ExerciseId = generateId(stateAcronym[0].acronym, election_type_id);

    const totalElectores = await pool.query('SELECT * FROM elector WHERE state_id = ?', [state_id]);
    const electorCount = totalElectores[0].length;

    await pool.query(
      "INSERT INTO election_Exercise (exercise_id, election_type_id,  state_id, date, expected_votes) VALUES (?, ?, ?, ?,?)",
      [ExerciseId, election_type_id, state_id, date, electorCount]
    );
    res.send({
      message: "Ejercicio creado correctamente",
      id:  ExerciseId
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error Creando Ejercicio Electoral" });
  }
};


// --- UPDATE election Exercise ---
export const updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { election_type_id, state_id, date } = req.body;
    const [candidate] = await pool.query(
      "SELECT * FROM election_Exercise WHERE Exercise_id = ?",
      [id]
    );
    if (candidate.length === 0) {
      return res
        .status(404)
        .send({ error: "Ejercicio Electoral no encontrado" });
    }

    const [result] = await pool.query(
      "UPDATE election_Exercise SET election_type_id = IFNULL(?, election_type_id),  state_id = IFNULL(?, state_id), date = IFNULL(?, date) WHERE Exercise_id = ?",
      [election_type_id, state_id, date, id]
    );
    res.send({
      message: "Ejercicio Electoral actualizado correctamente",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error Creando Ejercicio Electoral" });
  }
};


// --- RECOVER election ExerciseS ---
export const enableExercises = async (req, res) => {
  try {
    const { id } = req.params;
    const [Exercises] = await pool.query(
      "SELECT * FROM election_Exercise WHERE Exercise_id = ?",
      [id]
    );
    if (Exercises.length === 0) {
      return res.status(404).send({
        error: "Ejercicio no encontrado",
      });
    }

    if (Exercises[0].enable === 1) {
      return res.status(400).send({
        error: "Este ejercicio ya esta activo",
      });
    }

    await pool.query(
      "UPDATE election_Exercise SET enable = true WHERE Exercise_id = ?",
      [id]
    );
    res.send({
      message: "Ejercicio recuperado correctamente",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error recuperando el ejercicio Electoral");
  }
};


// --- DELETE election ExerciseS ---
export const disableExercises = async (req, res) => {
  try {
    const { id } = req.params;
    const [Exercises] = await pool.query(
      "SELECT * FROM election_Exercise WHERE Exercise_id = ?",
      [id]
    );
    if (Exercises.length === 0) {
      return res.status(404).send({
        error: "Ejercicio no encontrado",
      });
    }

    if (Exercises[0].enable === 0) {
      return res.status(400).send({
        error: "Este ejercicio ya esta eliminado",
      });
    }

    await pool.query(
      "UPDATE election_Exercise SET enable = false WHERE Exercise_id = ?",
      [id]
    );
    res.send({
      message: "Ejercicio eliminado correctamente",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error eliminando el ejercicio Electoral");
  }
};
