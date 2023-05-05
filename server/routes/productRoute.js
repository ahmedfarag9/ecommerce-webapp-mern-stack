// Import Express and create a new router object.
const express = require("express");
const router = express.Router();

// Import productCtrl functions to handle HTTP requests related to products.
const {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages,
  deleteImages,
} = require("../controller/productCtrl");

// Import middleware to ensure authentication and authorization.
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");

// Import middleware to handle image uploads for products.
const {
  uploadPhoto,
  productImgResize,
} = require("../middlewares/uploadImages");

// Define routes for handling various product-related actions through appropriate controller functions.
router.post("/", authMiddleware, isAdmin, createProduct); // creates a new product (only admins can access this endpoint).
router.put(
  "/upload",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10), // uploads one or more images for a product (only admins can access this endpoint).
  productImgResize, // resizes images uploaded for a product
  uploadImages
);

router.get("/:id", getProduct); // gets details of a specific product.
router.put("/wishlist", authMiddleware, addToWishlist); // adds a product to the user's wishlist.
router.put("/rating", authMiddleware, rating); // submits a user rating and review for a product.

router.put("/:id", authMiddleware, isAdmin, updateProduct); // updates details for a specific product (only admins can access this endpoint).
router.delete("/:id", authMiddleware, isAdmin, deleteProduct); // deletes a speicific product (only admins can access this endpoint).
router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages); // deletes an image from a product (only admins can access this endpoint).

router.get("/", getAllProducts); // retrieves all products.

// Export the router object for use in other parts of the application.
module.exports = router;
