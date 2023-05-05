// Import Express and create a new router object
const express = require("express");
const router = express.Router();

// Import the blogCategoryCtrl functions to handle HTTP requests for categories
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
} = require("../controller/blogCategoryCtrl");

// Import the authMiddleware and isAdmin middleware functions
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// Define routes for creating, updating, deleting, and retrieving categories
router.post("/", authMiddleware, isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);
router.get("/:id", getCategory);
router.get("/", getAllCategories);

// Export the router object for use in other parts of the application
module.exports = router;
