import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../uploads');
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || 5242880; // 5MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF allowed.'), false);
  }
};

export const uploadReceipt = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
}).single('file');

export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
}).array('files', 10);

export const optimizeImage = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
  } catch (err) {
    console.error('Image optimization error:', err);
    throw err;
  }
};

export default {
  uploadReceipt,
  uploadMultiple,
  optimizeImage
};
