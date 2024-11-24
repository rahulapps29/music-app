const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const songsDirectory = path.join(__dirname, "public", "songs");

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(songsDirectory, req.query.folder || "/");
    if (!fs.existsSync(folderPath))
      fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// Recursively get directory structure
function getDirectoryTree(dirPath) {
  const result = {};
  fs.readdirSync(dirPath).forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      result[file] = getDirectoryTree(filePath);
    } else {
      result[file] = file;
    }
  });
  return result;
}

// API to get directory structure
app.get("/directories", (req, res) => {
  res.json(getDirectoryTree(songsDirectory));
});

// API to create a new folder
app.post("/directories", (req, res) => {
  const folderPath = path.join(songsDirectory, req.body.folderName);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    res.status(201).send("Folder created.");
  } else {
    res.status(400).send("Folder already exists.");
  }
});

// API to upload files
app.post("/upload", upload.array("songs"), (req, res) => {
  res.status(200).send("Files uploaded successfully.");
});

// Start server
const PORT = 4020;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
