const cloudinary = require("cloudinary").v2;

// Configuration for Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploadImg = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file, (error, result) => {
      if (error) {
        reject(error);
      } else {
        // console.log(result);
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

const cloudinaryDeleteImg = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(file, (error, result) => {
      if (error) {
        reject(error);
      } else {
        // console.log(result);
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

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
