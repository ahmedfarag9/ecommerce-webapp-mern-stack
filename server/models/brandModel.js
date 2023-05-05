// Import Mongoose library for MongoDB and create a new schema.
const mongoose = require("mongoose");

// Define the schema for the brand model.
var brandSchema = new mongoose.Schema(
  {
    // Title is a required string field that must be unique and indexed.
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  // Add timestamps to the schema to store when the record was created and updated.
  { timestamps: true }
);

// Export the brand model as "Brand" using the defined schema.
module.exports = mongoose.model("Brand", brandSchema);
