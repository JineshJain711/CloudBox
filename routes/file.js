const express = require("express");
const router = express.Router();

const { fileUpload } = require("../middleware/fileUpload");
const { protectedRoute } = require("../middleware/auth");
const {
  uploadFile,
  getMyFiles,
  downloadFile,
  deleteFile,
} = require("../controllers/File");

router.post("/upload", protectedRoute, fileUpload.single("file"), uploadFile);
router.get("/my-files", protectedRoute, getMyFiles);
router.get("/download/:fileId", protectedRoute, downloadFile);
router.delete("/:fileId", protectedRoute, deleteFile);

module.exports = router;
