// Import Express and create a new router object
const express = require("express");
const router = express.Router();

// Import couponCtrl functions to handle HTTP requests related to coupons
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controller/couponCtrl");

// Import middleware to ensure authentication and authorization
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// Define routes for handling various coupon-related actions through appropriate controller functions
router.post("/", authMiddleware, isAdmin, createCoupon); // creates a new coupon
router.get("/", authMiddleware, isAdmin, getAllCoupons); // retrieves all coupons
router.put("/:id", authMiddleware, isAdmin, updateCoupon); // updates details for a specific coupon
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon); // deletes a specific coupon

// Export the router object for use in other parts of the application
module.exports = router;
