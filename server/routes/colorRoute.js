// Import Express and create a new router object
const express = require("express");
const router = express.Router();

// Import colorCtrl functions to handle HTTP requests related to colors
const {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getAllColors,
} = require("../controller/colorCtrl");

// Import middleware to ensure authentication and authorization
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// Define routes for handling various color-related actions through appropriate controller functions
router.post("/", authMiddleware, isAdmin, createColor); // creates a new color
router.put("/:id", authMiddleware, isAdmin, updateColor); // updates details for a specific color
router.delete("/:id", authMiddleware, isAdmin, deleteColor); // deletes a specific color
router.get("/:id", getColor); // retrieves details for a specific color
router.get("/", getAllColors); // retrieves all colors

// Export the router object for use in other parts of the application
module.exports = router;
