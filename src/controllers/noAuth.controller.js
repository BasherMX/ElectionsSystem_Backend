
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
				error: "Usuario no encontrado",
			});
		}
		if (User[0].verified_account === 1) {
			return res.status(400).send({
				error: "Usuario ya verificado",
			});
		}

		await pool.query(
			"UPDATE User SET verified_account = true WHERE User_id = ?",
			[code]
		);

		//Mandar la verificacion exitosa
		VerifiedsendUserEmail(User[0].email);


		res.send({
			message: "Usuario verificado con éxito"
		});
	} catch (err) {
		console.error(err);
		res.status(500).send({
			error: "Error al verificar el usuario"
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
        error: 'Se requiere correo electrónico y contraseña'
      });
    }

    // Query the database to get the user with the specified email
    const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
    const user = rows[0];

    // If no user was found with the specified email, return an error
    if (!user) {
      return res.status(401).send({
        error: 'Usuario no encontrado'
      });
    }

	if(!user.verified_account){
		return res.status(401).send({
			error: 'Usuario no verificado'
		});
	}


    //Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);


    if (!isMatch) {
      return res.status(401).send({
        error: 'Credenciales no válidas'
      });
    }


	const [getUserName] = await pool.query('SELECT * FROM user_type WHERE user_type_id = ?', [user.user_id]);

    // If no user was found with the specified email, return an error
    if (!getUserName) {
      return res.status(401).send({
        error: 'Tipo de usuario no encontrado'
      });
    }

	let userTypeName = "";
	if(user.user_type == 1){
		 userTypeName = "Administrador Sr.";
	}else{
		 userTypeName = "Administrador Jr.";
	}


    const jwtToken = generateToken(email);
    res.send({

      message: 'El usuario inició sesión exitosamente',
      ...jwtToken,
	  userType: user.user_type,
	  userTypeName: userTypeName,
	  userName: user.name + " " + user.first_lastname

    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
		error: 'Error al iniciar sesión con el usuario'
	});
  }
};


