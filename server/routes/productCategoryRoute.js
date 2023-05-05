// Import Express and create a new router object
const express = require("express");
const router = express.Router();

// Import productCategoryCtrl functions to handle HTTP requests related to product categories
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
} = require("../controller/productCategoryCtrl");

// Import middleware to ensure authentication and authorization
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// Define routes for handling various product category-related actions through appropriate controller functions
router.post("/", authMiddleware, isAdmin, createCategory); // creates a new product category (only admins can access this endpoint)
router.put("/:id", authMiddleware, isAdmin, updateCategory); // updates details for a specific product category (only admins can access this endpoint)
router.delete("/:id", authMiddleware, isAdmin, deleteCategory); // deletes a speicific product category (only admins can access this endpoint)
router.get("/:id", getCategory); // gets details of a specific product category
router.get("/", getAllCategories); // retrieves all product categories

// Export the router object for use in other parts of the application
module.exports = router;
