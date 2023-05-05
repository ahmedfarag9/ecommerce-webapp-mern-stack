// Require the Coupon model and express-async-handler module
const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create a Coupon
// This function creates a new coupon using the request body data
// It returns a 201 status code with a success message and the created coupon
const createCoupon = asyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get all Coupons
// This function retrieves all coupons from the database
// It returns a 200 status code with a success message and an array of all coupons
const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json({
      success: true,
      message: "All Coupons retrieved successfully",
      coupons,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Update a Coupon
// This function updates a coupon based on the id in the request parameters
// It returns a 200 status code with a success message and the updated coupon
const updateCoupon = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a Coupon
// This function deletes a coupon based on the id in the request parameters
// It returns a 200 status code with a success message and the deleted coupon
const deleteCoupon = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const coupon = await Coupon.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
      coupon,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Export the functions
module.exports = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon };
