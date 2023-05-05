// Import Express and create a new router object
const express = require("express");
const router = express.Router();

// Import blogCtrl functions to handle HTTP requests related to blogs
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  disLikeBlog,
  uploadImages,
} = require("../controller/blogCtrl");

// Import middleware functions that ensure authentication and image resizing for photo uploads
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { blogImgResize, uploadPhoto } = require("../middlewares/uploadImages");

// Define routes for handling various blog-related actions through appropriate controller functions
router.post("/", authMiddleware, isAdmin, createBlog); // creates a new blog post
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 2),
  blogImgResize,
  uploadImages
); // uploads images associated with a blog post
router.put("/likes", authMiddleware, isAdmin, likeBlog); // updates likes for a blog post
router.put("/dislikes", authMiddleware, isAdmin, disLikeBlog); // updates dislikes for a blog post
router.put("/:id", authMiddleware, isAdmin, updateBlog); // updates details for a specific blog post
router.get("/:id", getBlog); // retrieves details for a specific blog post
router.get("/", getAllBlogs); // retrieves all blog posts
router.delete("/:id", authMiddleware, isAdmin, deleteBlog); // deletes a specific blog post

// Export the router object for use in other parts of the application
module.exports = router;
