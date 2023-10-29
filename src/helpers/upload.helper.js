import multer from 'multer';
import path from 'path';

// your code here


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/assets/uploads');
  },
  filename: (req, file, cb) => {
    let extension = file.originalname.substring(file.originalname.lastIndexOf('.'));
    let finalName = `${Date.now()}${extension}`;
    cb(null, finalName);
  }
});



export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      const error = new Error('Only images are allowed');
      error.status = 200; // Cambia el código de estado del error a 200
      return cb(JSON.stringify({ error: error.message }));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB limit
  }
});


