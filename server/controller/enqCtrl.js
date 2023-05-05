// Require the Enquiry model and express-async-handler module
const Enquiry = require("../models/enqModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create a new Enquiry
// This function creates a new enquiry using the Enquiry model
// It takes in the request body as an argument and returns a 201 status code with a success message and the enquiry object
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

// Update an Enquiry
// This function updates an existing enquiry using the Enquiry model
// It takes in the request params and request body as arguments and returns a 200 status code with a success message and the updated enquiry object
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

// Delete an Enquiry
// This function deletes an existing enquiry using the Enquiry model
// It takes in the request params as an argument and returns a 200 status code with a success message and the deleted enquiry object
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

// Get an Enquiry
// This function fetches an existing enquiry using the Enquiry model
// It takes in the request params as an argument and returns a 200 status code with a success message and the fetched enquiry object
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

// Get all enquiries
// This function fetches all existing enquiries using the Enquiry model
// It returns a 200 status code with a success message and the fetched enquiry objects
const getAllEnquiries = asyncHandler(async (req, res) => {
  try {
    const enquiry = await Enquiry.find({});
    res.status(200).json({
      success: true,
      message: "Enquiries fetched successfully",
      enquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Export the functions
module.exports = {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getAllEnquiries,
};
