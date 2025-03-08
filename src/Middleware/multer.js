import multer from "multer";

export const Multer = (allowedTypes = []) => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("❗Invalid file type."), false);
    }
  };

  return multer({ storage, fileFilter });
};