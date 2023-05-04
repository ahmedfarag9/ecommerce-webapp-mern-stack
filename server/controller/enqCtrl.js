const Enquiry = require("../models/enqModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create a new Enquiry
const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);
    res.status(201).json({
      success: true,
      message: "Enquiry created successfully",
      enquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Update a Enquiry
const updateEnquiry = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const enquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      enquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a Enquiry
const deleteEnquiry = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const enquiry = await Enquiry.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
      enquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get a Enquiry
const getEnquiry = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const enquiry = await Enquiry.findById(id);
    res.status(200).json({
      success: true,
      message: "Enquiry fetched successfully",
      enquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get all enquiry
const getAllEnquiry = asyncHandler(async (req, res) => {
  try {
    const enquiry = await Enquiry.find({});
    res.status(200).json({
      success: true,
      message: "Enquirys fetched successfully",
      enquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getAllEnquiry,
};
