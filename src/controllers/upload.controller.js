
export const uploadFile = (req, res) => {
    res.status(200).send({ 
        message: 'El archivo se ha subido correctamente', 
        path: req.file.path,
        filename: req.file.filename,
        //id: id
    });
  }
  