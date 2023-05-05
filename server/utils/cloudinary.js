// Import the Cloudinary library
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define a function that uploads an image to Cloudinary
const cloudinaryUploadImg = async (file) => {
  return new Promise((resolve, reject) => {
    // Use the Cloudinary uploader to upload the file
    cloudinary.uploader.upload(file, (error, result) => {
      if (error) {
        // If there was an error, reject the promise with the error message
        reject(error);
      } else {
        // If the upload was successful, resolve the promise with an object containing information about the uploaded asset
        resolve({
          url: result.secure_url,
          resource_type: "auto",
          asset_id: result.asset_id,
          public_id: result.public_id,
        });
      }
    });
  });
};

// Define a function that deletes an image from Cloudinary
const cloudinaryDeleteImg = async (file) => {
  return new Promise((resolve, reject) => {
    // Use the Cloudinary uploader to delete the file
    cloudinary.uploader.destroy(file, (error, result) => {
      if (error) {
        // If there was an error, reject the promise with the error message
        reject(error);
      } else {
        // If the deletion was successful, resolve the promise with an object containing information about the deleted asset
        resolve({
          url: result.secure_url,
          resource_type: "auto",
          asset_id: result.asset_id,
          public_id: result.public_id,
        });
      }
    });
  });
};

// Export the cloudinaryUploadImg and cloudinaryDeleteImg functions for use elsewhere in the application
module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
