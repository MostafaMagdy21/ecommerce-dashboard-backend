const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images")); 
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") +
        "_" +
        file.originalname.replace(/ /g, "_")
    );
  },
});

const upload = multer({ storage: storage });

module.exports = { upload: upload.array("files", 5) };


// app.post("/categories", upload.array("files", 5), (req, res) => {
//   try {
//     const formData = req.body;
//     const files = req.files;

//     // Process the form data and files here
//     console.log("Form data:", formData);
//     console.log("Uploaded files:", files);
//     return res.status(200).json({ message: "Form submitted successfully" });
//   } catch (error) {
//     console.error("Error processing form:", error);
//     res.status(500).json({ message: "Error processing form" });
//   }
// });
