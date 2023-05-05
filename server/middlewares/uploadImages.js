// Importing required modules
const multer = require("multer"); // A middleware for handling multipart/form-data, used for image uploads
const sharp = require("sharp"); // A library for resizing and formatting images
const path = require("path"); // A module for working with file paths
const fs = require("fs"); // A module for working with the file system

// Configure the storage for uploaded files
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the upload directory to ./public/images/
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, cb) => {
    // Rename the file to include a unique identifier generated based on timestamp and random number
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
  },
});

// Filter function for uploaded files
const multerFilter = (req, file, cb) => {
  // Check if the file is an image by checking its MIME type
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    // If the file is not an image, throw an error
    cb({ message: "Not an image! Please upload only images." }, false);
  }
};

// Middleware for uploading photos
const uploadPhoto = multer({
  storage: multerStorage, // Use the configured disk storage engine
  fileFilter: multerFilter, // Use the filter function for uploaded files
  limits: { fieldSize: 1024 * 1024 * 2 }, // Limit the upload size to 2MB
});
// productImgResize is a middleware that resizes the image to 300x300 and saves it to the public/images/products folder
const productImgResize = async (req, res, next) => {
  // If the request doesn't have any files attached, skip this middleware and continue to the next one
  if (!req.files) return next();
  // Otherwise, for each file in the request's files array, resize the image to 300x300 and save it in JPEG format to the public/images/products directory using the file's original filename
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${file.filename}`);
      // Finally, delete the original file from the server's file system to free up space
      fs.unlinkSync(`public/images/products/${file.filename}`);
    })
  );
  // Call the next middleware in the chain
  next();
};

// blogImgResize is a middleware that resizes the image to 300x300 and saves it to the public/images/blogs folder
const blogImgResize = async (req, res, next) => {
  // If the request doesn't have any files attached, skip this middleware and continue to the next one
  if (!req.files) return next();
  // Otherwise, for each file in the request's files array, resize the image to 300x300 and save it in JPEG format to the public/images/blogs directory using the file's original filename
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/blogs/${file.filename}`);
      // Finally, delete the original file from the server's file system to free up space
      fs.unlinkSync(`public/images/blogs/${file.filename}`);
    })
  );
  // Call the next middleware in the chain
  next();
};

// Export the uploadPhoto, productImgResize, and blogImgResize functions for use elsewhere in the application
module.exports = { uploadPhoto, productImgResize, blogImgResize };
