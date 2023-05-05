// Import the Mongoose library
const mongoose = require("mongoose");

// Define a function that takes an ID and checks if it's a valid MongoDB ObjectID
const validateMongoDbId = (id) => {
  // Check if the given ID is a valid MongoDB ObjectID using Mongoose's built-in isValid() method
  const isValid = mongoose.Types.ObjectId.isValid(id);

  // If the ID is not valid, throw an error with the message "Invalid ID"
  if (!isValid) {
    throw new Error("Invalid ID");
  }
};

// Export the validateMongoDbId function for use elsewhere in the application
module.exports = validateMongoDbId;
