const product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const validateMongoDbId = require("../utils/validateMongodbId");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const fs = require("fs");

// Create a product
const createProduct = asyncHandler(async (req, res) => {
  try {
    // If title is present in the request body, slugify it and add it to the request body
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    // Create a new product using the product model
    const newProduct = await product.create(req.body);
    // Return a 201 status code with success message and the newly created product
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      newProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// update a product
const updateProduct = asyncHandler(async (req, res) => {
  // Get the id from the request params
  const { id } = req.params;
  // Validate the mongoDB id
  validateMongoDbId(id);
  try {
    // If title is present in the request body, slugify it and add it to the request body
    if (!req.body.title) {
      res.body.slug = slugify(req.body.title);
    }
    // Find the product by its id and update it with the request body
    const updatedProduct = await product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // Return a 201 status code with success message and the updated product
    res.status(201).json({
      success: true,
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  // Get the id from the request params
  const { id } = req.params;
  // Validate the mongoDB id
  validateMongoDbId(id);
  try {
    // Find the product by its id and delete it
    const deletedProduct = await product.findByIdAndDelete(id);
    // Return a 201 status code with success message and the deleted product
    res.status(201).json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get product
const getProduct = asyncHandler(async (req, res) => {
  // Get the id from the request params
  const { id } = req.params;
  // Validate the mongoDB id
  validateMongoDbId(id);
  try {
    // Find the product by its id
    const getProduct = await product.findById(id);
    // Return a 201 status code with success message and the fetched product
    res.status(201).json({
      success: true,
      message: "Product fetched successfully",
      getProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get all products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    // Filtering
    // Create a query object from the request query
    const queryObject = { ...req.query };
    // Exclude fields that are not needed for filtering
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObject[el]);
    // Convert the query object to a string and replace gte, gt, lte, lt with $gte, $gt, $lte, $lt respectively
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // Create a query using the product model
    let queryProduct = product.find(JSON.parse(queryStr));

    // Sorting
    // If sort is present in the request query, split it by comma and join it with a space
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      // Sort the query using the sortBy variable
      queryProduct.sort(sortBy);
    } else {
      // Else sort the query by createdAt in descending order
      queryProduct.sort("-createdAt");
    }

    // Field Limiting
    // If fields is present in the request query, split it by comma and join it with a space
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      // Select the fields specified in the fields variable
      queryProduct.select(fields);
    } else {
      // Else select all fields except __v
      queryProduct.select("-__v");
    }

    // Pagination
    // Get the page, limit and skip values from the request query
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    // Skip the number of documents specified in the skip variable and limit the query to the number of documents specified in the limit variable
    queryProduct.skip(skip).limit(limit * 1);
    // If page is present in the request query, check if the skip value is greater than or equal to the total number of documents
    if (req.query.page) {
      const numProducts = await product.countDocuments();
      if (skip >= numProducts) throw new Error("This page does not exist");
    }
    // Execute the query
    const products = await queryProduct;
    // Return a 201 status code with success message and the fetched products
    res.status(201).json({
      success: true,
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Add to wishlist
// This function adds a product to the user's wishlist or removes it from the wishlist if it is already present.
const addToWishlist = asyncHandler(async (req, res) => {
  // Get the user id and product id from the request body
  const { _id } = req.user;
  const { prodId } = req.body;

  // Validate the user id and product id
  validateMongoDbId(_id);
  validateMongoDbId(prodId);

  try {
    // Find the user by their id
    const user = await User.findById(_id);

    // Check if the product is already in the user's wishlist
    const alreadyInWishlist = user.wishlist.find(
      (id) => id.toString() === prodId
    );

    // If the product is already in the wishlist, remove it
    if (alreadyInWishlist) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        { new: true }
      );
      res.status(201).json({
        success: true,
        message: "Product removed from wishlist",
        user,
      });
    } else {
      // If the product is not in the wishlist, add it
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        { new: true }
      );
      res.status(201).json({
        success: true,
        message: "Product added to wishlist",
        user,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Product rating and comments
// This function allows users to rate and comment on products.
const rating = asyncHandler(async (req, res) => {
  // Get the user id, product id, star rating, and comment from the request body
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;

  // Validate the user id
  validateMongoDbId(_id);

  try {
    // Find the product by its id
    const product = await Product.findById(prodId);

    // Check if the user has already rated the product
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedBy.toString() === _id.toString()
    );

    // If the user has already rated the product, update the rating and comment
    if (alreadyRated) {
      updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        { new: true }
      );
    } else {
      // If the user has not yet rated the product, add the rating and comment
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedBy: _id,
            },
          },
        },
        { new: true }
      );
    }

    // Calculate the average rating for the product
    const getAllRatings = await Product.findById(prodId);
    let totalRating = getAllRatings.ratings.length;
    let ratingSum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((a, b) => a + b, 0);
    let actualRating = Math.round(ratingSum / totalRating);

    // Update the product with the new average rating
    const updateProductRating = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );

    // Return a response with the updated product
    res.status(201).json({
      success: true,
      message: "Product rating updated successfully",
      updateProductRating,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// upload product images
const uploadImages = asyncHandler(async (req, res) => {
  // console.log(req.files);
  try {
    // define a function to upload images to cloudinary
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    // create an array to store the uploaded image urls
    const urls = [];
    // get the files from the request
    const files = req.files;
    // loop through the files and upload each one
    for (const file of files) {
      const { path } = file;
      // console.log(path);
      // upload the file to cloudinary
      const newPath = await uploader(path);
      // console.log(newPath);
      // push the url of the uploaded file to the urls array
      urls.push(newPath);
      // delete the file from the server
      fs.unlinkSync(path);
    }
    // map the urls array to an array of objects
    const images = urls.map((file) => {
      return file;
    });
    // send a response with the uploaded images
    res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      images,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// delete product images
const deleteImages = asyncHandler(async (req, res) => {
  // get the id of the image to be deleted from the request params
  const { id } = req.params;
  try {
    // delete the image from cloudinary
    const deleted = cloudinaryDeleteImg(id, "images");
    // send a response with a success message
    res.status(201).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// export the functions
module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages,
  deleteImages,
};
