// Import Mongoose library for MongoDB and create a new schema.
const mongoose = require("mongoose");

// Define the schema for the cart model.
var cartSchema = new mongoose.Schema(
  {
    products: [
      {
        // Each product includes its own product ID, count, color, and price.
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Associate each product with the Product collection/model.
        },
        count: Number,
        color: String,
        price: Number,
      },
    ],
    cartTotal: Number, // Total value of all the products in the cart.
    totalAfterDiscount: Number, // Cart total after applying any discount codes.
    orderedBy: {
      // The user that placed the order.
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  // Add timestamps to the schema to store when the record was created and updated.
  { timestamps: true }
);

// Export the cart model as "Cart" using the defined schema.
module.exports = mongoose.model("Cart", cartSchema);
