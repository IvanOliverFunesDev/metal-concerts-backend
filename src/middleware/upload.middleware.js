import multer from 'multer';
import path from 'path';

// 📂 Definir almacenamiento en disco temporalmente
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/tmp'); // 📌 Guardamos archivos temporalmente en `/tmp`
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 🏷️ Nombre único
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPG and PNG formats are allowed'), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB máximo
  fileFilter,
});
