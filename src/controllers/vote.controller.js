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
			const err = `The following fields are required: ${missingFields.join(", ")}`;
			return res.status(400).send({ error: err });
		}

		const [[ElectorResult]] = await pool.query(
			"SELECT state_id FROM elector WHERE elector_id = ?",
			[elector_id]
		);

		if (!ElectorResult) {
			return res.status(400).send({ error: "This Elector doesn't exist" });
		}

		const [[ExerciseResult]] = await pool.query(
			"SELECT state_id FROM election_exercise WHERE exercise_id = ?",
			[exercise_id]
		);

		if (!ExerciseResult) {
			return res.status(400).send({ error: "This Exercise doesn't exist" });
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
			message: "You can Vote on this exercise",
			code: 1,
		});
	} catch (err) {
		console.error(err);
		res.status(500).send({
			error: "Error checking elector",
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
		const err = `The following fields are required: ${missingFields.join(", ")}`;
		return res.status(400).send({ error: err });
	  }
  
	  const [[ExerciseResults]] = await pool.query(
		"SELECT * FROM election_exercise WHERE exercise_id = ?",
		[exercise_id]
	  );
  
	  if (!ExerciseResults) {
		return res.status(400).send({ error: "This Exercise doesn't exist" });
	  }
  
	  const [ExerciseBallotResults] = await pool.query(
		"SELECT ballot_id FROM election_exercise_ballot WHERE exercise_id = ?",
		[exercise_id]
	  );
  
	  if (!ExerciseBallotResults || ExerciseBallotResults.length === 0) {
		return res.status(400).send({ error: "No ballots found for this exercise" });
	  }
  
	  const ballotIds = ExerciseBallotResults.map((result) => result.ballot_id);
  
	  const [BallotResults] = await pool.query(
		`SELECT b.*, c.* FROM ballot b 
		INNER JOIN ballot_candidate bc ON b.ballot_id = bc.ballot_id
		INNER JOIN candidate c ON bc.candidate_id = c.candidate_id
		WHERE b.ballot_id IN (${ballotIds.map((id) => `'${id}'`).join(', ')})`
	  );
  
	  if (!BallotResults || BallotResults.length === 0) {
		return res.status(400).send({ error: "No ballots found for the provided exercise" });
	  }
  
	  const data = {};
	  BallotResults.forEach((row) => {
		if (!data[row.ballot_id]) {
		  data[row.ballot_id] = {
			ballot_id: row.ballot_id,
			charge_id: row.charge_id,
			election_date: row.election_date,
			status: row.status,
			winnerCandidate_id: row.winnerCandidate_id,
			totalVotes: row.totalVotes,
			anuledVotes: row.anuledVotes,
			candidates: [],
		  };
		}
		data[row.ballot_id].candidates.push({
		  candidate_id: row.candidate_id,
		  name: row.name,
		  first_lastname: row.first_lastname,
		  second_lastname: row.second_lastname,
		  pseudonym: row.pseudonym,
		  party_id: row.party_id,
		  enable: row.enable,
		  status: row.status,
		  totalVotes: row.totalVotes,
		});
	  });
  
	  res.send(JSON.stringify(Object.values(data)));
	} catch (err) {
	  console.error(err);
	  res.status(500).send({
		error: "Error retrieving ballots for the given exercise",
	  });
	}
  };
  