const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
      cd(null, "uploads");
    },
    filename: (req, file, cd) => {
      cd(null, Date.now() + path.extname(file.originalname));
      // cd(null, Math.random().toString.slice(-5) + path.extname(file.originalname));
    },
  });
  
  const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cd) => {
      const ext = path.extname(file.originalname);
      if (
        ext !== ".jpg" &&
        ext !== ".png" &&
        ext !== ".jpeg" &&
        ext !== ".jfif"
      ) {
        const err = new Error("xatolik bor");
        err.code = 404;
        return cd(err);
      }
      return cd(null, true);
    },
    preservePath: true,
  })

  module.exports = upload