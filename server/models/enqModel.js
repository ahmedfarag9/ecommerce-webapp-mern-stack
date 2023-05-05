// Import Mongoose library for MongoDB and create a new schema.
const mongoose = require("mongoose");

// Define the schema for the enquiry model, which includes name, email, mobile, comment and status fields.
var enquirySchema = new mongoose.Schema({
  name: {
    type: String, // Name is a string.
    required: true, // Name is a required field.
  },
  email: {
    type: String, // Email is a string.
    required: true, // Email is a required field.
  },
  mobile: {
    type: String, // Mobile is a string.
    required: true, // Mobile is a required field.
  },
  comment: {
    type: String, // Comment is a string.
    required: true, // Comment is a required field.
  },
  status: {
    type: String, // Status is a string.
    default: "Submitted", // Set a default value to the status field called Submitted.
    enum: ["Submitted", "Contacted", "In Process"], // Only allow for three possible values for the status field. These values must be either "Submitted", "Contacted" or "In Process".
  },
});

// Export the enquiry model as "Enquiry" using the defined schema.
module.exports = mongoose.model("Enquiry", enquirySchema);
