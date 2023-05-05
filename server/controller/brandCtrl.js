// Require the Brand model and express-async-handler module
const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create a new Brand: Post /api/brand/
const createBrand = asyncHandler(async (req, res) => {
  try {
    // Get title from request body
    const { title } = req.body;
    // Create a new brand with the given title
    const brand = await Brand.create({ title });
    // Return response with success message and created brand
    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      brand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Update a Brand: Put /api/brand/
const updateBrand = asyncHandler(async (req, res) => {
  try {
    // Get id from request params
    const { id } = req.params;
    // Validate the given id
    validateMongoDbId(id);
    // Find and update the brand with the given id
    const brand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // Return response with success message and updated brand
    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      brand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a Brand: Delete /api/brand/
const deleteBrand = asyncHandler(async (req, res) => {
  try {
    // Get id from request params
    const { id } = req.params;
    // Validate the given id
    validateMongoDbId(id);
    // Find and delete the brand with the given id
    const brand = await Brand.findByIdAndDelete(id);
    // Return response with success message and deleted brand
    res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
      brand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get a Brand: Get /api/brand/
const getBrand = asyncHandler(async (req, res) => {
  try {
    // Get id from request params
    const { id } = req.params;
    // Validate the given id
    validateMongoDbId(id);
    // Find the brand with the given id
    const brand = await Brand.findById(id);
    // Return response with success message and fetched brand
    res.status(200).json({
      success: true,
      message: "Brand fetched successfully",
      brand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get all brands: Get /api/brand/
const getAllBrands = asyncHandler(async (req, res) => {
  try {
    // Find all brands
    const brands = await Brand.find({});
    // Return response with success message and fetched brands
    res.status(200).json({
      success: true,
      message: "Brands fetched successfully",
      brands,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Export all functions
module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getAllBrands,
};
