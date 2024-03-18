const express = require("express");
const multer = require("multer");

const app = express();

const upload = multer({ dest: "uploads/" });

app.use(express.static("public")); //default page to serve is index.html

/* single file upload */
app.post("/singleFileUpload", upload.single("uploadFile"), (req, res) => {
  console.log(
    `Success! - Original file: ${req.file.originalname} - Stored as: ${req.file.filename}`
  );
  return res.json({
    Status: "OK",
    "Original file": req.file.originalname,
    "Stored As": req.file.filename,
  });
});

app.listen(3001, () => console.log("Server up and running on 3001..."));
