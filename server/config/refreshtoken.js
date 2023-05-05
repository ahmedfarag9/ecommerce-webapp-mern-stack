// Importing the jsonwebtoken library for generating tokens
const jwt = require("jsonwebtoken");

// Defining a function to generate a refresh token based on the provided user ID
const generateRefreshToken = (id) => {
  // Using the `jwt.sign()` method to generate a signed token string with the provided user ID payload,
  // using the JWT_SECRET environment variable as the secret key, and setting an expiration time of 3 days
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

// Exporting the generateRefreshToken function to be used by other modules
module.exports = generateRefreshToken;
