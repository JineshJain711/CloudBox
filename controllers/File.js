
const File = require("../models/File")
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/fileUploder");

/* ================= UPLOAD ================= */
exports.uploadFile = async (req, res) => {
  try {
    const { fileName, description } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const uploaded = await uploadToCloudinary(req.file.buffer);

    const file = await File.create({
      fileName: fileName?.trim() || req.file.originalname,
      description: description || "",
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    });

    // attach file to user
    req.user.files.push(file._id);
    await req.user.save();

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};

/* ================= LIST ================= */
exports.getMyFiles = async (req, res) => {
  try {
    await req.user.populate("files");

    return res.status(200).json({
      success: true,
      files: req.user.files,
    });
  } catch (error) {
    console.error("LIST ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Fetch failed",
    });
  }
};

/* ================= DOWNLOAD ================= */
exports.downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // ✅ correct ObjectId comparison
    const hasAccess = req.user.files.some(
      (id) => id.toString() === fileId
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      fileName: file.fileName,
      downloadUrl: file.url,
    });
  } catch (error) {
    console.error("DOWNLOAD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Download failed",
    });
  }
};

/* ================= DELETE ================= */
exports.deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // ✅ correct ObjectId comparison
    const hasAccess = req.user.files.some(
      (id) => id.toString() === fileId
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // delete from cloudinary
    await deleteFromCloudinary(file.publicId);

    // delete from db
    await File.findByIdAndDelete(fileId);

    // remove file from user
    req.user.files.pull(fileId);
    await req.user.save();

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};
