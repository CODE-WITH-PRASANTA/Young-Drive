const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const multerUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

const convertToWebp = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    // Ensure uploads directory exists
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    req.processedImages = [];

    await Promise.all(
      req.files.map(async (file) => {
        const filename = `listing-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        const filePath = path.join(uploadDir, filename);

        // Convert and SAVE to disk
        await sharp(file.buffer)
          .webp({ quality: 80 })
          .toFile(filePath);

        // Save relative web path to attach to database
        req.processedImages.push(`/uploads/${filename}`);
      })
    );

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload: multerUpload,
  convertToWebp,
};