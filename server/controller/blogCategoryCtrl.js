// Import the BlogCategoryModel from "../models/blogCategoryModel"
const Category = require("../models/blogCategoryModel");

// Import the express-async-handler package to handle asynchronous functions in Express middleware
const asyncHandler = require("express-async-handler");

// Import the validateMongoDbId function to check if a MongoDB Id is valid.
const validateMongoDbId = require("../utils/validateMongodbId");

// Create a new category: POST /api/blog-category/
const createCategory = asyncHandler(async (req, res) => {
  try {
    // Destructure the "title" attribute from the request body.
    const { title } = req.body;

    // Create a new category using the "create()" method of the BlogCategoryModel.
    const category = await Category.create({ title });

    // Sending back a JSON response with HTTP status code of 201 Created.
    res.status(201).json({
      success: true, // Whether the response was successful or not.
      message: "Category created successfully", // A message to describe the result of the operation.
      category, // The newly created category object.
    });
  } catch (error) {
    // If there's an error, throw a new Error and let the express error handling middleware deal with it.
    throw new Error(error);
  }
});

// Update a category: PUT /api/blog-category/:id
const updateCategory = asyncHandler(async (req, res) => {
  try {
    // Get the "id" attribute from the request params.
    const { id } = req.params;

    // Check whether the "id" is a valid MongoDB ObjectId or not.
    validateMongoDbId(id);

    // Find a category by Id and update it using the req.body that contains the necessary updates.
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true, // Returns the updated document after modification.
    });

    // Sending back a JSON response with HTTP status 200 OK.
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category, // The updated category object.
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a category by id : DELETE /api/blog-category/:id
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);

    // Find a category by Id and remove it using the findByIdAndDelete method of the BlogCategoryModel.
    const category = await Category.findByIdAndDelete(id);

    // Sending a JSON response with HTTP status 200 OK.
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      category, // The deleted category object.
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get a category by id : GET /api/blog-category/:id
const getCategory = asyncHandler(async (req, res) => {
  try {
    // Destructure the "id" attribute from the request params
    const { id } = req.params;

    // Check whether the "id" is a valid MongoDB ObjectId or not.
    validateMongoDbId(id);

    // Find a category by Id using the findById method of the BlogCategoryModel.
    const category = await Category.findById(id);

    // Sending a JSON response with HTTP status 200 OK.
    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      category, // The fetched category object.
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get all categories : GET /api/blog-category/
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    // Get all categories using the find() method of the BlogCategoryModel.
    const categories = await Category.find({});

    // Send a JSON response with HTTP status 200 OK.
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories, // An Array of category objects.
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Export an object containing all the functions defined above.
module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
};
