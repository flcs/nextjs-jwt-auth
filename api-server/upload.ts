import { Request } from "express";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
const filter = (req: Request, file: Express.Multer.File, cb: Function) => {
    if (file.mimetype in ["image/png","image/jpeg"]) {
        cb(null, true);
    } else {
        cb(new Error("File type not supported!"), false);
    }
};

const uploads = multer({ 
    storage: storage,
    fileFilter: filter
});

export default uploads ;