const Color = require("../models/colorModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create a new Color
const createColor = asyncHandler(async (req, res) => {
  try {
    const { title } = req.body;
    const brand = await Color.create({ title });
    res.status(201).json({
      success: true,
      message: "Color created successfully",
      brand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Update a Color
const updateColor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const brand = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Color updated successfully",
      brand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a Color
const deleteColor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const brand = await Color.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Color deleted successfully",
      brand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get a Color
const getColor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const brand = await Color.findById(id);
    res.status(200).json({
      success: true,
      message: "Color fetched successfully",
      brand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get all brands
const getAllColors = asyncHandler(async (req, res) => {
  try {
    const brands = await Color.find({});
    res.status(200).json({
      success: true,
      message: "Colors fetched successfully",
      brands,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getAllColors,
};
