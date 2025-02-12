import multer from "multer";
import path from "path";

function checkFileType(req, file, cb) {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname.toLowerCase()));
  const mimeType = fileTypes.test(file.mimetype); // Corrected here

  if (mimeType && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Only images (JPEG, JPG, PNG) are allowed!"));
  }
}

const upload = multer({
  storage: multer.memoryStorage(), // Using memory save just in case
  limits: {
    fileSize: 1024 * 1024 * 25, // 25MB
  },
  fileFilter: checkFileType,
});

export default upload.array("picture");
