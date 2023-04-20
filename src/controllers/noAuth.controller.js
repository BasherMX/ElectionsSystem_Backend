import {
	pool
} from "../db/db.js";

// --- VERIFY USERS ACOUNT ---
export const verifyUserAccount = async (req, res) => {
	try {
		const {
			code
		} = req.params;
		const id = code.substring(0, 8);
		const password = code.substring(12);

		const [User] = await pool.query("SELECT * FROM User WHERE User_id = ?", [
			id,
		]);
		if (User.length === 0) {
			return res.status(404).send({
				error: "User not found",
			});
		}
		if (User[0].verified_acount === 1) {
			return res.status(400).send({
				error: "User already verified",
			});
		}

		await pool.query(
			"UPDATE User SET verified_acount = true WHERE User_id = ?",
			[id]
		);

		//Mandar la contraseña por email y actualizarla en la base de datos ya hasheada

		res.send({
			message: "User verified successfully",
			id:id,
			password:password
		});
	} catch (err) {
		console.error(err);
		res.status(500).send("Error verifing User");
	}
};