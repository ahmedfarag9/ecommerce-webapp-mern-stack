// Import Mongoose library for MongoDB and create a new schema.
const mongoose = require("mongoose");

// Define the schema for the order model, which includes fields for products, payment status, order status, and the user who placed the order.
var orderSchema = new mongoose.Schema(
  {
    products: [
      // An array field of object type having product, count and color fields
      {
        product: {
          type: mongoose.Schema.Types.ObjectId, // Product is an object ID that references another model (Product).
          ref: "Product", // Reference to the Product model, which represents a product object.
        },
        count: Number, // The number of products ordered.
        color: String, // The color of the products ordered.
      },
    ],
    paymentIntent: {}, // Details about the payment intent for this order.
    orderStatus: {
      // Current status of the order.
      type: String,
      default: "Not Processed",
      enum: [
        // The allowed values for order status.
        "Not Processed",
        "Cash On Delivery",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Delivered",
      ],
    },
    orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user who placed the order.
  },
  { timestamps: true } // Add timestamp fields createdAt and updatedAt to the schema.
);

// Export the order model as "Order" using the defined schema.
module.exports = mongoose.model("Order", orderSchema);
