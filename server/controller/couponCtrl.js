const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create a Coupon
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
const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json({
      success: true,
      message: "All Coupons",
      coupons,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Update a Coupon
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

module.exports = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon };
