// Import Mongoose library for MongoDB and create a new schema.
const mongoose = require("mongoose");

// Define the schema for the product category model, which includes a title field.
var productCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String, // Title is a string.
      required: true, // Title is a required field.
      unique: true, // Title must be unique (no other record should have the same title).
      index: true, // Create an index on the title field to optimize queries that use this field.
    },
  },
  { timestamps: true } // Add timestamp fields createdAt and updatedAt to the schema.
);

// Export the product category model as "productCategory" using the defined schema.
module.exports = mongoose.model("productCategory", productCategorySchema);
