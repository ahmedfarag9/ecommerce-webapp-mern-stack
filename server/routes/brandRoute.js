// Import Express and create a new router object
const express = require("express");
const router = express.Router();

// Import brandCtrl functions to handle HTTP requests related to brands
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getAllBrands,
} = require("../controller/brandCtrl");

// Import middleware to ensure authentication and authorization
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// Define routes for handling various brand-related actions through appropriate controller functions
router.post("/", authMiddleware, isAdmin, createBrand); // creates a new brand
router.put("/:id", authMiddleware, isAdmin, updateBrand); // updates details for a specific brand
router.delete("/:id", authMiddleware, isAdmin, deleteBrand); // deletes a specific brand
router.get("/:id", getBrand); // retrieves details for a specific brand
router.get("/", getAllBrands); // retrieves all brands

// Export the router object for use in other parts of the application
module.exports = router;
