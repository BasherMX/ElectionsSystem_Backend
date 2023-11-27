import {
	pool
} from "../db/db.js";
import 'dotenv/config';

export const getStates = async (req,res) => {
	try {
		
		const [stateResults] = await pool.query("SELECT * from state");

		if (!stateResults) {
			return res.status(400).send({ error: "Error al recuperar estados" });
		}
		res.send(stateResults);

	} catch (err) {
		console.error(err);
		res.status(500).send({
			error: "Error retrieving estados for the given exercise",
		});
	}
}

export const getAllEnableExercises = async (req, res) => {
	try {
	  const [rows] = await pool.query(
		"SELECT * FROM election_Exercise"
	  );
	  res.send(rows);
	} catch (err) {
	  console.error(err);
	  res.status(500).send({
		error: "Error al buscar ejercicios electorales",
	  });
	}
  };
  


// --- getBallotsByExerciseId ---
export const getBallotsByExerciseId = async (req, res) => {
	try {
		const { exercise_id } = req.params;

		if (exercise_id == null) {
			const err = `Se requieren Un ID`;
			return res.status(400).send({ error: err });
		}

		const [[ExerciseResults]] = await pool.query(
			"SELECT ee.*, s.name as state_name, s.state_id as stateId FROM election_exercise ee " +
			"INNER JOIN state s ON ee.state_id = s.state_id " +
			"WHERE ee.exercise_id = ?",
			[exercise_id]
		);

		if (!ExerciseResults) {
			return res.status(400).send({ error: "Este ejercicio no existe" });
		}

		const [ExerciseBallotResults] = await pool.query(
			"SELECT ballot_id FROM election_exercise_ballot WHERE exercise_id = ?",
			[exercise_id]
		);

		if (!ExerciseBallotResults || ExerciseBallotResults.length === 0) {
			return res.status(400).send({ error: "No se encontraron boletas para este ejercicio." });
		}

		const ballotIds = ExerciseBallotResults.map((result) => result.ballot_id);

		const [BallotResults] = await pool.query(
			`SELECT b.*, b.totalVotes as ballotTotalVotes, c.*, pp.img_logo as party_image, pp.color_hdx as party_color,
			pp.name as party_name, pp.acronym as party_accronym, ch.name as charge_name FROM ballot b 
			INNER JOIN ballot_candidate bc ON b.ballot_id = bc.ballot_id
			INNER JOIN candidate c ON bc.candidate_id = c.candidate_id
			INNER JOIN political_party pp ON c.party_id = pp.party_id
			INNER JOIN charge ch ON b.charge_id = ch.charge_id
			WHERE b.ballot_id IN (${ballotIds.map((id) => `'${id}'`).join(', ')})`
		);

		if (!BallotResults || BallotResults.length === 0) {
			return res.status(400).send({ error: "No se encontraron boletas para el ejercicio proporcionado" });
		}

		const [expectedVotes] = await pool.query(
			"SELECT * FROM elector where state_id = ?", [ExerciseResults.stateId]
		);

		if (expectedVotes.length === 0) {
			return res.status(400).send({ error: "No se encontro ninugn elector para este estado." });
		}


		const data = {
		};
		BallotResults.forEach((row) => {
			if (!data[row.ballot_id]) {
				data[row.ballot_id] = {
					ballot_id: row.ballot_id,
					charge_name: row.charge_name, // Agregando el nombre del cargo en texto
					election_date: row.election_date,
					status: row.status,
					winnerCandidate_id: row.winnerCandidate_id,
					totalVotes: 1,
					anuledVotes: row.anuledVotes,
					expectedVotes: expectedVotes.length,
					state_name: ExerciseResults.state_name, // Agregando el nombre del estado
					candidates: [],
				};
			}
			data[row.ballot_id].candidates.push({
				candidate_id: row.candidate_id,
				fullName: row.name + " " + row.first_lastname + " " + row.second_lastname,
				pseudonym: row.pseudonym,
				party_name: row.party_name,
				party_accronym: row.party_accronym,
				enable: row.enable,
				status: row.status,
				totalVotes: row.totalVotes,
				party_color: row.party_color,
				party_image: "http://localhost:3000/getImage/"+ row.party_image.slice(-17), // Agregando la imagen del partido político
			});
		});

		// Agregar "Anular Voto" solo una vez a cada boleta
		Object.values(data).forEach((boleta) => {
			boleta.candidates.push({
				candidate_id: 0,
				fullName: "Votos Anulados",
				pseudonym: "Nulos",
				party_name: "Nulos",
				party_accronym: "Nulos",
				enable: 1,
				status: 1,
				totalVotes: boleta.anuledVotes,
				party_color: "#e3e3e3",
				party_image: "http://localhost:3000/getImage/1701042404740.png",
			});
		});

		res.send(Object.values(data));
	} catch (err) {
		console.error(err);
		res.status(500).send({
			error: "Error al recuperar las boletas para el ejercicio indicado",
		});
	}
};

