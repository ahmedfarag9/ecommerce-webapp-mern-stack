// Require the productCategoryModel and express-async-handler modules
const Category = require("../models/productCategoryModel");
const asyncHandler = require("express-async-handler");

// Require the validateMongoDbId utility function
const validateMongoDbId = require("../utils/validateMongodbId");

// Create a new category
// This function creates a new category using the title from the request body
// If successful, it returns a 201 status code and a success message with the created category
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { title } = req.body;
    const category = await Category.create({ title });
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Update a category
// This function updates a category using the id from the request params
// It validates the MongoDB ID before updating the category
// If successful, it returns a 200 status code and a success message with the updated category
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a category
// This function deletes a category using the id from the request params
// It validates the MongoDB ID before deleting the category
// If successful, it returns a 200 status code and a success message with the deleted category
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const category = await Category.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      category,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get a category
// This function gets a category using the id from the request params
// It validates the MongoDB ID before getting the category
// If successful, it returns a 200 status code and a success message with the fetched category
const getCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const category = await Category.findById(id);
    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get all categories
// This function gets all categories
// If successful, it returns a 200 status code and a success message with the fetched categories
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Export the functions
module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
};
