// Import required libraries - Mongoose, bcrypt and crypto.
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Define the schema for the user model, which includes fields for firstname, lastname, email, mobile, password, role, isBlocked, cart, address, wishlist, passwordChangedAt, passwordResetToken and passwordResetExpires.
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true, // Firstname field is required.
    },
    lastname: {
      type: String,
      required: true, // Lastname field is required.
    },
    email: {
      type: String,
      required: true, // Email field is required.
      unique: true, // Email should be unique.
    },
    mobile: {
      type: String,
      required: true, // Mobile number field is required.
      unique: true, // Mobile number should be unique.
    },
    password: {
      type: String,
      required: true, // Password field is required.
    },
    role: {
      type: String,
      default: "user", // By default a user has the "user" role.
    },
    isBlocked: {
      type: Boolean,
      default: false, // By default the user is not blocked.
    },
    cart: {
      type: Array,
      default: [], // By default the cart array is empty.
    },
    address: {
      type: String,
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Wishlist field - Stores a reference to products added to the user's wishlist.
    refreshtoken: {
      type: String,
    },
    passwordChangedAt: Date, // The date the password was last changed.
    passwordResetToken: String, // Stores the token generated for resetting the password.
    passwordResetExpires: Date, // Expiration time for the password reset token.
  },
  { timestamps: true } // Add timestamp fields createdAt and updatedAt to the schema.
);

// Middleware function executed before save, that hashes the user's password.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10); // Generate a salt with a complexity of 10.
  this.password = await bcrypt.hashSync(this.password, salt); // Hash the provided password.
});

// Method for comparing entered password with stored hash.
userSchema.methods.isPasswordMatch = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Compare the entered password with the stored hash.
};

// Method for creating a password reset token.
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex"); // Generate a random string of bytes.

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Set the expiration time for the password reset token to 10 minutes.

  return resetToken;
};

// Export the user model as "User" using the defined schema.
module.exports = mongoose.model("User", userSchema);
