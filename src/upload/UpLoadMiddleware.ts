import fs from "fs";
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const upload = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(upload)) {
      fs.mkdirSync(upload, { recursive: true });
    }
    cb(null, upload);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Validate file
function fileFilter(req: any, file: Express.Multer.File, cb: any) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
}

const upload = multer({ storage, fileFilter });

export default upload;
