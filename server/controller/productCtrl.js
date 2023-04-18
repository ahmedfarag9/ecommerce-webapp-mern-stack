const product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create a product
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      // console.log(req.body.title);
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// update a product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.body.title) {
      res.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await product.findByIdAndDelete(id);
    res.json(deletedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// Get product
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getProduct = await product.findById(id);
    res.json(getProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    // Filtering
    const queryObject = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObject[el]);
    // console.log(queryObject);
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let queryProduct = product.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queryProduct.sort(sortBy);
    } else {
      queryProduct.sort("-createdAt");
    }

    // Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queryProduct.select(fields);
    } else {
      queryProduct.select("-__v");
    }

    // Pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    queryProduct.skip(skip).limit(limit * 1);
    if (req.query.page) {
      const numProducts = await product.countDocuments();
      if (skip >= numProducts) throw new Error("This page does not exist");
    }
    // console.log(page, limit, skip)
    const products = await queryProduct;
    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
});

// Add to wishlist
// TODO rename to cart later
const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyInWishlist = user.wishlist.find(
      (id) => id.toString() === prodId
    );
    if (alreadyInWishlist) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        { new: true }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        { new: true }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// product rating and comments
const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedBy.toString() === _id.toString()
    );
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
    const getAllRatings = await Product.findById(prodId);
    let totalRating = getAllRatings.ratings.length;
    let ratingSum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((a, b) => a + b, 0);
    let actualRating = Math.round(ratingSum / totalRating);
    const updateProductRating = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(updateProductRating);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
};
