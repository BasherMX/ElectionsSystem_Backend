import path from 'path';

export const uploadFile = (req, res) => {
  // Obtén la URL del módulo actual
  const currentModuleUrl = new URL(import.meta.url);

  // Construye la ruta completa utilizando la ruta relativa devuelta por multer
  const fullPath = path.join(path.dirname(decodeURIComponent(currentModuleUrl.pathname)), '..', 'assets', 'uploads', req.file.filename);

  // Modifica el formato del path
  const formattedPath = fullPath.replace(/\\/g, '/').substring(1);

  res.status(200).send({ 
    message: 'El archivo se ha subido correctamente', 
    fullPath: formattedPath,
    filename: req.file.filename,
  });
};
