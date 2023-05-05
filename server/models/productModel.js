// Import Mongoose library for MongoDB and create a new schema.
const mongoose = require("mongoose");

// Define the schema for the product model, which includes fields for title, slug, description, price, category, brand, quantity, images, color, tags, ratings and totalrating.
var productSchema = new mongoose.Schema(
  {
    title: {
      // The title of the product.
      type: String,
      required: true, // The title field is required.
      trim: true,
    },
    slug: {
      // The slug of the product.
      type: String,
      // required: true,
      unique: true, // The slug should be unique.
      lowercase: true, // Convert to lowercase.
    },
    description: {
      // The description of the product.
      type: String,
      required: true, // The description field is required.
      unique: true, // The description should be unique.
    },
    price: {
      type: Number,
      required: true, // The price field is required.
    },
    category: {
      // Category field - Under which category does this product belong.
      type: String,
      required: true, // Category field is required.
    },
    brand: {
      type: String,
      required: true, // Brand field is required.
    },
    quantity: {
      type: Number,
      required: true, // Quantity field is required.
    },
    sold: {
      type: Number,
      default: 0,
      select: false,
    },
    images: {
      // Images field - An array of URLs representing different images of the product.
      type: Array,
    },
    color: [], // Color field - Describes different colors available for the product.
    tags: [], // Tags field - Describes additional features/details about the product.
    ratings: [
      {
        // Ratings field - Details on the product's rating.
        star: Number,
        comment: String,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user who posted this rating.
      },
    ],
    totalrating: {
      // Total rating field - Represents the sum of all ratings of a particular product.
      type: Number,
      default: 0, // The default value of totalrating is set to zero.
    },
  },
  { timestamps: true } // Add timestamp fields createdAt and updatedAt to the schema
);

// Export the product model as "Product" using the defined schema.
module.exports = mongoose.model("Product", productSchema);
