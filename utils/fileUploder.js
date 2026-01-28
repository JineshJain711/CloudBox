const cloudinary = require("../config/cloudinary");

exports.uploadToCloudinary = async (buffer, folder = "cloudbox-files") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "raw" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};


exports.deleteFromCloudinary = async (publicId) => {
  if (!publicId || typeof publicId !== "string") {
    throw new Error("Invalid publicId for Cloudinary delete");
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
  });

  if (!["ok", "not found"].includes(result.result)) {
    console.error("Cloudinary delete response:", result);
    throw new Error(`Cloudinary delete failed: ${result.result}`);
  }

  return result;
};
