// Require the Color model and express-async-handler module
const Color = require("../models/colorModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create a new Color
const createColor = asyncHandler(async (req, res) => {
  try {
    // Get title from request body
    const { title } = req.body;
    // Create a new color with the title
    const color = await Color.create({ title });
    // Return response with success message and created color
    res.status(201).json({
      success: true,
      message: "Color created successfully",
      color,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Update a Color
const updateColor = asyncHandler(async (req, res) => {
  try {
    // Get id from request params
    const { id } = req.params;
    // Validate the id
    validateMongoDbId(id);
    // Find and update the color with the given id
    const color = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // Return response with success message and updated color
    res.status(200).json({
      success: true,
      message: "Color updated successfully",
      color,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a Color
const deleteColor = asyncHandler(async (req, res) => {
  try {
    // Get id from request params
    const { id } = req.params;
    // Validate the id
    validateMongoDbId(id);
    // Find and delete the color with the given id
    const color = await Color.findByIdAndDelete(id);
    // Return response with success message and deleted color
    res.status(200).json({
      success: true,
      message: "Color deleted successfully",
      color,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get a Color
const getColor = asyncHandler(async (req, res) => {
  try {
    // Get id from request params
    const { id } = req.params;
    // Validate the id
    validateMongoDbId(id);
    // Find the color with the given id
    const color = await Color.findById(id);
    // Return response with success message and fetched color
    res.status(200).json({
      success: true,
      message: "Color fetched successfully",
      color,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get all colors
const getAllColors = asyncHandler(async (req, res) => {
  try {
    // Find all colors
    const colors = await Color.find({});
    // Return response with success message and fetched colors
    res.status(200).json({
      success: true,
      message: "Colors fetched successfully",
      colors,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Export all functions
module.exports = {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getAllColors,
};
