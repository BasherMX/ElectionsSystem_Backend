
import {pool} from "../db/db.js";
import bcrypt from 'bcrypt';
import { generateToken } from  "../helpers/jwt.helper.js";
import {
	VerifiedsendUserEmail
} from "../helpers/user.helper.js";


// --- VERIFY USERS ACOUNT ---
export const verifyUserAccount = async (req, res) => {
	try {
		const {
			code
		} = req.params;

		const [User] = await pool.query("SELECT * FROM User WHERE User_id = ?", [
			code,
		]);
		if (User.length === 0) {
			return res.status(404).send({
				error: "User not found",
			});
		}
		if (User[0].verified_account === 1) {
			return res.status(400).send({
				error: "User already verified",
			});
		}

		await pool.query(
			"UPDATE User SET verified_account = true WHERE User_id = ?",
			[code]
		);

		//Mandar la verificacion exitosa
		VerifiedsendUserEmail(User[0].email);


		res.send({
			message: "User verified successfully"
		});
	} catch (err) {
		console.error(err);
		res.status(500).send({
			error: "Error verifing User"
		});
	}
};


// --- LOGIN USER ---
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email is valid
    if (!email || !password) {
      return res.status(400).send({
        error: 'Email and password are required'
      });
    }

    // Query the database to get the user with the specified email
    const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
    const user = rows[0];

    // If no user was found with the specified email, return an error
    if (!user) {
      return res.status(401).send({
        error: 'User not Found'
      });
    }

    //Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        error: 'Invalid credentials'
      });
    }

	if(!user.verified_account){
		return res.status(401).send({
			error: 'User not verified'
		});
	}

    const jwtToken = generateToken(email);
    res.send({
      message: 'User logged in successfully',
      ...jwtToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
		error: 'Error logging in user'
	});
  }
};


