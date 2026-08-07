const multer = require("multer");
const sharp = require("sharp");

// Memory storage to capture uploaded image buffers
const storage = multer.memoryStorage();

// File filter to restrict uploads to image MIME types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPG, PNG, WEBP) are allowed!"), false);
  }
};

const multerUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  },
  fileFilter,
});

// Middleware to convert uploaded files to WebP format using Sharp
const convertToWebp = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    req.files = await Promise.all(
      req.files.map(async (file) => {
        const webpBuffer = await sharp(file.buffer)
          .webp({ quality: 80 }) // 80% quality compression
          .toBuffer();

        return {
          ...file,
          buffer: webpBuffer,
          mimetype: "image/webp",
          originalname: file.originalname.replace(/\.[^/.]+$/, "") + ".webp",
        };
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