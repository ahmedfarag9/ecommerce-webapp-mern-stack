// Import Mongoose library for MongoDB and create a new schema.
const mongoose = require("mongoose");

// Define the schema for the coupon model, which includes name, expiry, and discount fields.
var couponSchema = new mongoose.Schema({
  name: {
    type: String, // Name is a string.
    required: true, // Name is a required field.
    unique: true, // Enforce that each name in the collection must be unique.
    uppercase: true, // Convert name values to uppercase for consistency.
  },
  expiry: {
    type: Date, // Expiry is a date value.
    required: true, // Expiry is a required field.
  },
  discount: {
    type: Number, // Discount is a numeric value.
    required: true, // Discount is a required field.
  },
});

// Export the coupon model as "Coupon" using the defined schema.
module.exports = mongoose.model("Coupon", couponSchema);
