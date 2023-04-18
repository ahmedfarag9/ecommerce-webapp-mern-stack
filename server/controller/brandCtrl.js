const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create a new Brand
const createBrand = asyncHandler(async (req, res) => {
  try {
    const { title } = req.body;
    const brand = await Brand.create({ title });
    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      brand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Update a Brand
const updateBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const brand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      brand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a Brand
const deleteBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const brand = await Brand.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
      brand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get a Brand
const getBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const brand = await Brand.findById(id);
    res.status(200).json({
      success: true,
      message: "Brand fetched successfully",
      brand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get all brands
const getAllBrands = asyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find({});
    res.status(200).json({
      success: true,
      message: "Brands fetched successfully",
      brands,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getAllBrands,
};
