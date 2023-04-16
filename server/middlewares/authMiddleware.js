const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Middleware to check if user is logged in
const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  // Check if authorization header is present and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get the token from the authorization header
      token = req.headers.authorization.split(" ")[1];
      // Verify the token using the JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded);
      // Find the user by the decoded id and assign it to req.user
      req.user = await User.findById(decoded?.id);
      // Call the next middleware
      next();
    } catch (error) {
      console.error(error);
      // Set status to 401 and throw an error
      res.status(401);
      throw new Error("Not authorized, token failed, please login again");
    }
  }
  // If no token is present, set status to 401 and throw an error
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Middleware to check if user is an admin
const isAdmin = asyncHandler(async (req, res, next) => {
  // Get the email of the user from req.user
  // console.log(req.user);
  const { email } = req.user;
  // Find the user by the email
  const adminUser = await User.findOne({ email: email });
  // Check if the user's role is not admin
  if (adminUser.role !== "admin") {
    // Throw an error if the user is not an admin
    throw new Error("Not authorized as an admin");
  } else {
    // Call the next middleware if the user is an admin
    next();
  }
});

// Export the middlewares
module.exports = { authMiddleware, isAdmin };
