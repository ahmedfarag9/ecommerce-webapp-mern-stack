// Import Express and create a new router object
const express = require("express");
const router = express.Router();

// Import enqCtrl functions to handle HTTP requests related to enquiries
const {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getAllEnquiries,
} = require("../controller/enqCtrl");

// Import middleware to ensure authentication and authorization
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// Define routes for handling various enquiry-related actions through appropriate controller functions
router.post("/", createEnquiry); // creates a new enquiry
router.put("/:id", authMiddleware, isAdmin, updateEnquiry); // updates details for a specific enquiry
router.delete("/:id", authMiddleware, isAdmin, deleteEnquiry); // deletes a speicific enquiry
router.get("/:id", getEnquiry); // gets details of a specific enquiry
router.get("/", getAllEnquiries); // retrieves all enquiries

// Export the router object for use in other parts of the application
module.exports = router;
