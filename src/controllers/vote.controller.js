import {
	pool
} from "../db/db.js";
import 'dotenv/config';


// --- Verify can vote ---
export const verifyCanVotate = async (req, res) => {
	try {
		const { elector_id, exercise_id } = req.body;
		const requiredFields = ["elector_id", "exercise_id"];
		const missingFields = requiredFields.filter((field) => !req.body[field]);

		if (missingFields.length > 0) {
			const err = `Se requieren los siguientes campos: ${missingFields.join(", ")}`;
			return res.status(400).send({ error: err });
		}

		const [[ElectorResult]] = await pool.query(
			"SELECT state_id FROM elector WHERE elector_id = ?",
			[elector_id]
		);

		if (!ElectorResult) {
			return res.status(400).send({ error: "Este elector no existe" });
		}

		const [[ExerciseResult]] = await pool.query(
			"SELECT state_id FROM election_exercise WHERE exercise_id = ?",
			[exercise_id]
		);

		if (!ExerciseResult) {
			return res.status(400).send({ error: "Este ejercicio no existe" });
		}

		if (ExerciseResult.state_id !== ElectorResult.state_id) {
			return res.status(500).send({
				error: "Tu estado no coincide con el de la votacion",
				code: 3,
			});
		}

		const [[VoteResult]] = await pool.query(
			"SELECT * FROM exercise_elector_vote WHERE exercise_id = ? AND elector_id = ?",
			[exercise_id, elector_id]
		);

		if (VoteResult) {
			return res.status(400).send({
				message: "Ya has votado en este ejercicio electoral",
				code: 2,
			});
		}

		res.send({
			message: "Puedes votar en este ejercicio.",
			code: 1,
		});
	} catch (err) {
		console.error(err);
		res.status(500).send({
			error: "Error al comprobar elector",
		});
	}
};



// --- getBallotsByExerciseId ---
export const getBallotsByExerciseId = async (req, res) => {
	try {
		const { exercise_id } = req.body;
		const requiredFields = ["exercise_id"];
		const missingFields = requiredFields.filter((field) => !req.body[field]);

		if (missingFields.length > 0) {
			const err = `Se requieren los siguientes campos: ${missingFields.join(", ")}`;
			return res.status(400).send({ error: err });
		}

		const [[ExerciseResults]] = await pool.query(
			"SELECT ee.*, s.name as state_name FROM election_exercise ee " +
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
			`SELECT b.*, c.*, pp.img_logo as party_image, pp.name as party_name, ch.name as charge_name FROM ballot b 
			INNER JOIN ballot_candidate bc ON b.ballot_id = bc.ballot_id
			INNER JOIN candidate c ON bc.candidate_id = c.candidate_id
			INNER JOIN political_party pp ON c.party_id = pp.party_id
			INNER JOIN charge ch ON b.charge_id = ch.charge_id
			WHERE b.ballot_id IN (${ballotIds.map((id) => `'${id}'`).join(', ')})`
		);

		if (!BallotResults || BallotResults.length === 0) {
			return res.status(400).send({ error: "No se encontraron boletas para el ejercicio proporcionado." });
		}

		const data = {};
		BallotResults.forEach((row) => {
			if (!data[row.ballot_id]) {
				data[row.ballot_id] = {
					ballot_id: row.ballot_id,
					charge_name: row.charge_name,
					state_name: ExerciseResults.state_name,
					candidates: [],
				};
			}
			data[row.ballot_id].candidates.push({
				candidate_id: row.candidate_id,
				completeName: row.name + " " + row.first_lastname + " " + row.second_lastname,
				pseudonym: row.pseudonym,
				party_image: row.party_image,
				party_name: row.party_name,
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



// --- voteForCandidate ---
export const voteForCandidate = async (req, res) => {
	try {
	  const { elector_id, exercise_id, votes } = req.body; // Se espera que votes sea un array de votos
	  if (!Array.isArray(votes)) {
		return res.status(400).send({ error: "Los votos deben ser una matriz." });
	  }
  
	  // Verificar si el elector ya ha votado en este ejercicio electoral
	  const [existingVoteResults] = await pool.query(
		"SELECT * FROM exercise_elector_vote WHERE elector_id = ? AND exercise_id = ?",
		[elector_id, exercise_id]
	  );
  
	  if (existingVoteResults.length > 0) {
		return res.status(400).send({ error: "El elector ya ha votado en este ejercicio." });
	  }
  
	  for (const vote of votes) {
		const { ballot_id, candidate_id, isSpoiledVote } = vote;
		const requiredFields = ["ballot_id", "candidate_id"];
		const missingFields = requiredFields.filter((field) => !vote[field]);
  
		if (missingFields.length > 0) {
		  const err = `Se requieren los siguientes campos: ${missingFields.join(", ")}`;
		  return res.status(400).send({ error: err });
		}
  
		// Verificar si el candidato pertenece a la boleta específica
		const [candidateResults] = await pool.query(
		  "SELECT * FROM ballot_candidate WHERE ballot_id = ? AND candidate_id = ?",
		  [ballot_id, candidate_id]
		);
  
		if (candidateResults.length === 0) {
		  return res.status(400).send({ error: `El candidato ${candidate_id} no pertenece a esta boleta.` });
		}
  
		if (!isSpoiledVote) {
		  await pool.query(
			"UPDATE candidate SET totalVotes = totalVotes + 1 WHERE candidate_id = ?",
			[candidate_id]
		  );
  
		  // Actualizar el totalVotes solo si el voto no está anulado
		  await pool.query(
			"UPDATE ballot SET totalVotes = totalVotes + 1 WHERE ballot_id = ?",
			[ballot_id]
		  );
		} else {
		  await pool.query(
			"UPDATE ballot SET anuledVotes = anuledVotes + 1 WHERE ballot_id = ?",
			[ballot_id]
		  );
		}
		await updateWinnerCandidate(ballot_id);
	  }
  
	  // Crear la relación entre el elector y el ejercicio electoral
	  await pool.query(
		"INSERT INTO exercise_elector_vote (elector_id, exercise_id) VALUES (?, ?)",
		[elector_id, exercise_id]
	  );
  
	  res.send("Votos registrados exitosamente.");
	} catch (err) {
	  console.error(err);
	  res.status(500).send({
		error: "Error al registrar los votos.",
	  });
	}
  };

  
// actualizar el candidato ganador de una boleta específica
const updateWinnerCandidate = async (ballot_id) => {
	try {
	  const [candidateResults] = await pool.query(
		"SELECT candidate_id FROM ballot_candidate WHERE ballot_id = ?",
		[ballot_id]
	  );
	
	  let maxVotes = 0;
	  let winnerCandidateId = 0;
	
	  for (const result of candidateResults) {
		const [candidate] = await pool.query(
		  "SELECT * FROM candidate WHERE candidate_id = ?",
		  [result.candidate_id]
		);

		if (candidate[0].totalVotes > maxVotes) {
		  maxVotes = candidate[0].totalVotes;
		  winnerCandidateId = candidate[0].candidate_id;
		}
	  }
	
	  await pool.query(
		"UPDATE ballot SET winnerCandidate_id = ? WHERE ballot_id = ?",
		[winnerCandidateId, ballot_id]
	  );
	} catch (err) {
	  console.error(err);
	}
};