import {
	pool
} from "../db/db.js";
import 'dotenv/config';


// --- GET ALL ENABLE USERS ---
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




