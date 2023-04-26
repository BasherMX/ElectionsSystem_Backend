import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/assets/uploads");
    },
    filename: (req, file, cb) => {
        cb(null,  `${Date.now()}-${file.originalname}`);
    }
});


export const uploaad = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|gif/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(new Error('Only images are allowed'));
      }
    },
    limits: {
      fileSize: 1024 * 1024 * 5 // 5MB limit
    }
  });