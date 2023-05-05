// Import Mongoose library for MongoDB and create a new schema.
const mongoose = require("mongoose");

// Define the schema for the color model, which includes only a title field.
var colorSchema = new mongoose.Schema(
  {
    title: {
      type: String, // Title is a string.
      required: true, // Title is a required field.
      unique: true, // Enforce that each title in the collection must be unique.
      index: true, // Add an index to the title field to optimize search performance.
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields.
);

// Export the color model as "Color" using the defined schema.
module.exports = mongoose.model("Color", colorSchema);
