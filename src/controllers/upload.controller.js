
export const uploadFile = (req, res) => {
    res.status(200).send({ 
        message: 'File uploaded successfully', 
        path: req.file.path,
        filename: req.file.filename,
        //id: id
    });
  }
  