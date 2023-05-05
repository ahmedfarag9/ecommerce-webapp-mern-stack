// Import Mongoose library for MongoDB and create a new Schema.
const mongoose = require("mongoose");

// Define the schema for the blog category model.
var blogCategorySchema = new mongoose.Schema(
  {
    // Title is required, unique, and indexed for faster searches.
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  // Add timestamps to the schema to track when categories are created or updated.
  { timestamps: true }
);

// Export the blog category model as "blogCategory" using the defined schema.
module.exports = mongoose.model("blogCategory", blogCategorySchema);
