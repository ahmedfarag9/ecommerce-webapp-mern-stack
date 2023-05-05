// Importing the jsonwebtoken library for generating tokens
const jwt = require("jsonwebtoken");

// Defining a function to generate a token based on the provided user ID
const generateToken = (id) => {
  // Using the `jwt.sign()` method to generate a signed token string with the provided user ID payload,
  // using the JWT_SECRET environment variable as the secret key, and setting an expiration time of 1 day
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Exporting the generateToken function to be used by other modules
module.exports = generateToken;
