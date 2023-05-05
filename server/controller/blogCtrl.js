// Import the Blog and User models from "../models/" directory
const Blog = require("../models/blogModel");
const User = require("../models/userModel");

// Import the express-async-handler package to handle asynchronous functions in Express middleware
const asyncHandler = require("express-async-handler");

// Import the validateMongoDbId function to check if a MongoDB Id is valid.
const validateMongoDbId = require("../utils/validateMongodbId");

// Import the cloudinaryUploadImg function to upload images to Cloudinary service.
const cloudinaryUploadImg = require("../utils/cloudinary");

// Import the fs package to interact with the file system.
const fs = require("fs");

// Create a new blog: POST /api/blog/
const createBlog = asyncHandler(async (req, res) => {
  try {
    // Create a new blog using the "create()" method of the Blog Model.
    const newBlog = await Blog.create(req.body);

    // Sending back a JSON response with the newly created blog.
    res.status(201).json({
      success: true, // Whether the response was successful or not.
      message: "Blog created successfully", // A message to describe the result of the operation.
      newBlog, // The newly created blog object.
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Update a blog: PUT /api/blog/:id
const updateBlog = asyncHandler(async (req, res) => {
  // Get the "id" attribute from the request params.
  const { id } = req.params;

  // Check whether the "id" is a valid MongoDB ObjectId or not.
  validateMongoDbId(id);

  try {
    // Find a blog by Id and update it using the "findByIdAndUpdate()" method of the Blog Model.
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true, // Returns the updated document after modification.
    });

    // Sending back a JSON response with the updated blog.
    res.status(200).json({
      success: true, // Whether the response was successful or not.
      message: "Blog updated successfully", // A message to describe the result of the operation.
      updateBlog, // The newly updated blog object.
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get a blog by id: GET /api/blog/:id
const getBlog = asyncHandler(async (req, res) => {
  // Get the "id" attribute from the request params.
  const { id } = req.params;

  // Check whether the "id" is a valid MongoDB ObjectId or not.
  validateMongoDbId(id);

  try {
    // Find a blog by Id using the "findById()" method of the Blog Model and populate the "likes" and "dislikes" fields.
    const getBlog = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes");

    // Increment the "numViews" field by 1 using the "$inc" operator and the "findByIdAndUpdate()" method of the Blog Model.
    await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true } // Returns the updated document after modification.
    );

    // Sending back a JSON response with the fetched blog.
    res.status(200).json({
      success: true, // Whether the response was successful or not.
      message: "Blog retrieved successfully", // A message to describe the result of the operation.
      blog: getBlog, // The retrieved blog object.
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get all blogs: GET /api/blog/
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    // Get all blogs using the find() method of the Blog Model.
    const blogs = await Blog.find();

    // Send a JSON response with an array of all the blogs.
    res.status(200).json({
      success: true, // Whether the response was successful or not.
      message: "Blogs retrieved successfully", // A message to describe the result of the operation.
      blogs, // The retrieved blogs object.
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a blog by id: DELETE /api/blog/:id
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    // Find a blog by Id and remove it using the "findByIdAndDelete()" method of the Blog Model.
    const deletedBlog = await Blog.findByIdAndDelete(id);

    // Sending back a JSON response with the deleted blog.
    res.status(200).json({
      success: true, // Whether the response was successful or not.
      message: "Blog deleted successfully", // A message to describe the result of the operation.
      deletedBlog, // The deleted blog object.
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Like a blog: Put /api/blog/likes/
const likeBlog = asyncHandler(async (req, res) => {
  // Get the Blog ID to like/dislike from the request body.
  const { blogId } = req.body;

  // Validate the blogId is a valid MongoDB ObjectId or not.
  validateMongoDbId(blogId);

  try {
    // Find a blog by Id using the findById() method of the Blog Model.
    const blog = await Blog.findById(blogId);

    // Find a user by id using the req?.user?._id
    // "?" mean optional chaining
    const user = await User.findById(req?.user?._id);

    // Check whether the blog is already disliked by this user.
    const alreadyDisliked = blog?.dislikes.find(
      (userId) => userId?.toString() === user?._id?.toString()
    );

    // If the blog is already disliked by this user, remove the dislike and set the value of "isDisliked" field to false.
    if (alreadyDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: user?._id },
          isDisliked: false,
        },
        { new: true } // Returns the updated document after modification.
      );
      res.status(201).json({
        success: true,
        message: "Blog liked successfully",
        blog,
      });
    }

    // Check whether the blog is already liked by this user.
    const isLiked = blog?.isLiked;

    // If the blog is already liked by this user, remove the like and set the value of "isLiked" field to false.
    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: user?._id },
          isLiked: false,
        },
        { new: true } // Returns the updated document after modification.
      );
      res.status(201).json({
        success: true,
        message: "Blog unliked successfully",
        blog,
      });
    } else {
      // If the blog is not liked by this user yet, add the like and set the value of "isLiked" field to true.
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: user?._id },
          isLiked: true,
        },
        { new: true } // Returns the updated document after modification.
      );
      res.status(201).json({
        success: true,
        message: "Blog liked successfully",
        blog,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Dislike a blog: Put /api/blog/dislikes/
// This function handles the logic for disliking a blog post
const disLikeBlog = asyncHandler(async (req, res) => {
  // Get the blogId from the request body
  const { blogId } = req.body;

  // Validate the blogId
  validateMongoDbId(blogId);

  try {
    // Find the blog by its Id
    const blog = await Blog.findById(blogId);

    // Find the user who is making the request
    const user = await User.findById(req?.user?._id);

    // Check if the blog has already been disliked
    const isDisliked = blog?.isDisliked;

    // Check if the user has already liked the blog
    const alreadyLiked = blog?.likes.find(
      (userId) => userId?.toString() === user?._id?.toString()
    );

    // If the user has already liked the blog, remove the like
    if (alreadyLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: user?._id },
          isLiked: false,
        },
        { new: true }
      );
      res.status(201).json({
        success: true,
        message: "Blog disliked successfully",
        blog,
      });
    }

    // If the blog has already been disliked, remove the dislike
    if (isDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: user?._id },
          isDisliked: false,
        },
        { new: true }
      );
      res.status(201).json({
        success: true,
        message: "Blog dislike removed successfully",
        blog,
      });
    } else {
      // Otherwise, add a dislike to the blog
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: user?._id },
          isDisliked: true,
        },
        { new: true }
      );
      res.status(201).json({
        success: true,
        message: "Blog disliked successfully",
        blog,
      });
    }
  } catch (error) {
    // Throw an error if something goes wrong
    throw new Error(error);
  }
});

// upload blog images: Put /api/blog/upload/:id
const uploadImages = asyncHandler(async (req, res) => {
  // Get the id from the request params
  const { id } = req.params;

  // Validate the MongoDB Id
  validateMongoDbId(id);

  // Log the files in the request
  // console.log(req.files);

  try {
    // Create a function to upload the image to cloudinary
    const uploader = (path) => cloudinaryUploadImg(path, "images");

    // Create an array to store the urls of the uploaded images
    const urls = [];

    // Get the files from the request
    const files = req.files;

    // Loop through the files and upload them to cloudinary
    for (const file of files) {
      // Get the path of the file
      const { path } = file;

      // Log the path
      // console.log(path);

      // Upload the file to cloudinary and get the new path
      const newPath = await uploader(path);

      // Log the new path
      // console.log(newPath);

      // Push the new path to the urls array
      urls.push(newPath);

      // Delete the file from the server
      fs.unlinkSync(path);
    }

    // Find the blog by its id and update it with the new images
    const findBlog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      { new: true }
    );

    // Send the updated blog as response
    res.status(201).json({
      success: true,
      message: "Blog images uploaded successfully",
      findBlog,
    });
  } catch (error) {
    // Throw an error if something goes wrong
    throw new Error(error);
  }
});

// Export the functions
module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  disLikeBlog,
  uploadImages,
};
