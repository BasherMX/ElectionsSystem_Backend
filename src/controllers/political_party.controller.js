import { pool } from "../db/db.js";

// --- GET ALL ENABLE POLITICAL PARTIES ---
export const getAllEnableParties = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM political_party WHERE status = 1');
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Error al buscar partidos políticos'
    });
  }
}

// --- GET ALL DISABLE POLITICAL PARTIES ---
export const getAllDisableParties = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM political_party WHERE status = 0');
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Error al buscar partidos políticos'
    });
  }
}

// --- GET POLITICAL PARTY BY ID ---
export const getPartyById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM political_party WHERE party_id = ?', [id]);
    if (rows.length === 0) {
      res.status(404).send({
        error: 'Partido político no encontrado'
      });
    } else {
      res.send(rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Error al buscar partido político'
    });
  }
}

// --- CREATE POLITICAL PARTY ---
export const createParty = async (req, res) => {
  try {
    const { name, acronym, foundation, img_logo, color_hdx } = req.body;
    const requiredFields = ['name', 'acronym', 'foundation', 'img_logo', 'color_hdx'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
        
    if (missingFields.length > 0) {
        const error = `Se requieren los siguientes campos: ${missingFields.join(', ')}`;
        return res.status(400).send({ error });
    }

    const [result] = await pool.query('SELECT * FROM political_party WHERE name = ? OR acronym = ?', [name, acronym]);
    if (result.length > 0) {
      return res.status(400).send({ error: 'El partido político ya existe.' });
    } else {
      await pool.query('INSERT INTO political_party (name, acronym, foundation, img_logo, color_hdx) VALUES (?, ?, ?, ?, ?)', [name, acronym, foundation, img_logo, color_hdx]);
      res.send({
        message: "Partido político creado con éxito"
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Error al crear partido político' });
  }
}


// --- UPDATE POLITICAL PARTY ---
export const updateParty = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, acronym, foundation, img_logo, color_hdx } = req.body;
      const [candidate] = await pool.query('SELECT * FROM political_party WHERE party_id = ?', [id]);
      if (candidate.length === 0) {
        return res.status(404).send({ error: 'Partido político no encontrado' });
      }
      const [result] = await pool.query('UPDATE political_party SET name = IFNULL(?,name), acronym = IFNULL(?,acronym), foundation = IFNULL(?,foundation), img_logo = IFNULL(?,img_logo), color_hdx = IFNULL(?,color_hdx) WHERE party_id = ?',
        [name, acronym, foundation, img_logo, color_hdx, id]);
      res.send({
        message: 'Partido político actualizado exitosamente'
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'Error al actualizar el candidato' });
    }
  }


// --- RECOVER POLITICAL PARTYS ---
export const enablePartys = async (req, res) => {
	try {
		const {
			id
		} = req.params;
		const [Partys] = await pool.query("SELECT * FROM Political_Party WHERE Party_id = ?", [
			id,
		]);
		if (Partys.length === 0) {
			return res.status(404).send({
				error: "Partido no encontrado",
			});
		}
		if (Partys[0].status === 1) {
			return res.status(400).send({
				error: "Partido ya recuperado",
			});
		}
		await pool.query("UPDATE Political_Party SET status = true WHERE Party_id = ?", [id]);
		res.send({
			message: "Partido recuperado con éxito",
		});
	} catch (err) {
		console.error(err);
		res.status(500).send("Error al recuperar el partido");
	}
};


// --- DELETE POLITICAL PARTYS ---
export const disablePartys = async (req, res) => {
	try {
		const {
			id
		} = req.params;
		const [Partys] = await pool.query("SELECT * FROM Political_Party WHERE Party_id = ?", [
			id,
		]);
		if (Partys.length === 0) {
			return res.status(404).send({
				error: "Partido no encontrado",
			});
		}
		if (Partys[0].status === 0) {
			return res.status(400).send({
				error: "Partido ya eliminado",
			});
		}
		await pool.query("UPDATE Political_Party SET status = false WHERE Party_id = ?", [id]);
		res.send({
			message: "Partido eliminado exitosamente",
		});
	} catch (err) {
		console.error(err);
		res.status(500).send("Error al eliminar el partido");
	}
};


  