import { v2 as cloudinary } from "cloudinary";

/* ---------- UPLOAD / OVERWRITE PDF ---------- */
const uploadPdf = async (buffer, noteId) => {
  // Configure here (runtime-safe)
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Validate at runtime, not import time
  if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error("Cloudinary ENV variables not loaded");
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "notes-pdfs",
        public_id: noteId,   // same PDF every time
        overwrite: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(buffer);
  });
};

export default uploadPdf;
