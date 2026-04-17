import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const studentName = req.body.studentName || "student";
    const assignmentId = req.body.assignmentId || "file";

    const uniqueName =
      studentName.replace(/\s/g, "_") +
      "_" +
      assignmentId +
      "_" +
      Date.now() +
      path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

export const upload = multer({ storage });