const generateToken = require("../config/jwtToken");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const generateRefreshToken = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto");
const uniqid = require("uniqid");

// Create User
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  // Check if user already exists
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    // Create a new User
    const newUser = await User.create(req.body);
    res.status(200).json({
      status: "success",
      message: "User created successfully",
      newUser,
    });
  } else {
    // User already exists
    throw new Error("User already exists");
  }
});

// Login User
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //console.log(email, password);
  // check if user exists or not
  const findUser = await User.findOne({ email: email });
  if (findUser) {
    // check if password is correct or not
    const isPasswordMatched = await findUser.isPasswordMatch(password);
    if (isPasswordMatched) {
      // generate token
      const refreshToken = await generateRefreshToken(findUser?._id);
      const updateuser = await User.findByIdAndUpdate(
        findUser?.id,
        {
          refreshtoken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      });
      res.json({
        status: 200,
        message: "User details fetched successfully",
        _id: findUser?._id,
        firstname: findUser.firstname,
        lastname: findUser.lastname,
        email: findUser.email,
        mobile: findUser.mobile,
        token: generateToken(findUser._id),
      });
    } else {
      throw new Error("Invalid Password");
    }
  }
});

// Admin login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //console.log(email, password);
  // check if user exists or not
  const findAdmin = await User.findOne({ email: email });
  // Check if user is an admin
  if (findAdmin.role !== "admin") {
    throw new Error("You are not an admin");
  }
  if (findAdmin) {
    // check if password is correct or not
    const isPasswordMatched = await findAdmin.isPasswordMatch(password);
    if (isPasswordMatched) {
      // generate token
      const refreshToken = await generateRefreshToken(findAdmin?._id);
      const updateuser = await User.findByIdAndUpdate(
        findAdmin?.id,
        {
          refreshtoken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      });
      res.json({
        status: 200,
        message: "Admin details found",
        _id: findAdmin?._id,
        firstname: findAdmin.firstname,
        lastname: findAdmin.lastname,
        email: findAdmin.email,
        mobile: findAdmin.mobile,
        token: generateToken(findAdmin._id),
      });
    } else {
      throw new Error("Invalid Password");
    }
  }
});

// Save user address
const saveAddress = asyncHandler(async (req, res, next) => {
  // Get the user id from the request body
  const { _id } = req.user;
  // Get the address from the request body
  const { address } = req.body;
  // Validate the MongoDB Id
  validateMongoDbId(_id);
  try {
    // Find and update the user with the new address
    const saveAddress = await User.findByIdAndUpdate(
      _id,
      {
        address: address,
      },
      { new: true }
    );
    // Return a success response with the updated user details
    res.status(200).json({
      status: "success",
      message: "Address saved successfully",
      data: saveAddress,
    });
  } catch (error) {
    // Throw an error if something goes wrong
    throw new Error(error);
  }
});

// Get all users
const getallUsers = asyncHandler(async (req, res) => {
  try {
    // Find all users in the database
    const getUsers = await User.find();
    // Return a success response with all the users
    res.status(200).json({
      status: "success",
      message: "All users fetched successfully",
      getUsers,
    });
  } catch (error) {
    // Throw an error if something goes wrong
    throw new Error(error);
  }
});

// Get a single user
const getUser = asyncHandler(async (req, res) => {
  // Get the user id from the request params
  const { id } = req.params;
  // Validate the MongoDB Id
  validateMongoDbId(id);
  try {
    // Find the user by its id
    const getUser = await User.findById(id);
    // Return a success response with the user details
    res.status(200).json({
      status: "success",
      message: "User fetched successfully",
      getUser,
    });
  } catch (error) {
    // Throw an error if something goes wrong
    throw new Error(error);
  }
});

// Delete a user
const deleteUser = asyncHandler(async (req, res) => {
  // Get the user id from the request params
  const { id } = req.params;
  // Validate the MongoDB Id
  validateMongoDbId(id);
  try {
    // Find and delete the user by its id
    const deleteUser = await User.findByIdAndDelete(id);
    // Return a success response with the deleted user details
    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      deleteUser,
    });
  } catch (error) {
    // Throw an error if something goes wrong
    throw new Error(error);
  }
});

// Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  // Get the cookie from the request
  const cookie = req.cookies;
  // Check if the cookie contains a refresh token
  if (!cookie?.refreshtoken) {
    // Throw an error if no refresh token is found
    throw new Error("No refresh token in Cookies, Please Login or Register");
  }
  // Get the refresh token from the cookie
  const refreshToken = cookie.refreshtoken;
  // Find the user with the given refresh token
  const user = await User.findOne({ refreshtoken: refreshToken });
  // Check if the user exists
  if (!user) {
    // Throw an error if no user is found
    throw new Error("No user found, Please Login or Register");
  }
  // Verify the refresh token
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    // Throw an error if the token is invalid
    if (err || user.id !== decoded.id) {
      throw new Error("Invalid Refresh Token");
    }
    // Generate a new access token
    const accessToken = generateToken(user?._id);
    // Return a success response with the access token
    res.json({
      status: 200,
      message: "User details fetched successfully",
      accessToken,
    });
  });
});

// logout functionallity
const logout = asyncHandler(async (req, res) => {
  // Get the refresh token from the cookie
  const cookie = req.cookies;
  if (!cookie?.refreshtoken) {
    throw new Error("No refresh token in Cookies, Please Login or Register");
  }
  const refreshToken = cookie.refreshtoken;
  // Find the user with the given refresh token
  const user = await User.findOne({ refreshtoken: refreshToken });
  if (!user) {
    // Clear the cookie and return forbidden status
    res.clearCookie("refreshtoken", { httpOnly: true, secure: true });
    return res.sendStatus(204); // forbidden
  }
  // Update the user's refresh token to empty string
  await User.findOneAndUpdate(refreshToken, { refreshtoken: "" });
  // Clear the cookie and return forbidden status
  res.clearCookie("refreshtoken", { httpOnly: true, secure: true });
  return res.sendStatus(204); // forbidden
});

// Update a user
const updateUser = asyncHandler(async (req, res) => {
  // Get the user id from the request
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    // Find the user by id and update the fields
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body.firstname,
        lastname: req?.body.lastname,
        email: req?.body.email,
        mobile: req?.body.mobile,
      },
      { new: true }
    );
    // Return success response
    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Block a user
const blockUser = asyncHandler(async (req, res) => {
  // Get the user id from the request params
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    // Find the user by id and update isBlocked field to true
    const blockUser = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    // Return success response
    res.status(200).json({
      status: "success",
      message: "User blocked successfully",
      blockUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Unblock a user
const unblockUser = asyncHandler(async (req, res) => {
  // Get the user id from the request params
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    // Find the user by id and update isBlocked field to false
    const unblockUser = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    // Return success response
    res.status(200).json({
      status: "success",
      message: "User unblocked successfully",
      unblockUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Update password
const updatePassword = asyncHandler(async (req, res) => {
  // Get the user id from the request
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  try {
    // Find the user by id
    const user = await User.findById(_id);
    if (password) {
      // Update the user's password
      user.password = password;
      const updatedPassword = await user.save();
      // Return success response
      res.status(200).json({
        status: "success",
        message: "Password updated successfully",
        updatedPassword,
      });
    } else {
      // TODO: Handle error here if password is not provided in request body
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Forgot password
const forgotPasswordToken = asyncHandler(async (req, res) => {
  // Get the email from the request body
  const { email } = req.body;
  // Find the user with the given email
  const user = await User.findOne({ email });
  // If no user is found, throw an error
  if (!user) {
    throw new Error("User not found");
  }
  try {
    // Create a password reset token for the user
    const token = await user.createPasswordResetToken();
    // Save the user to the database
    await user.save();
    // Create the reset URL
    const resetUrl = `Please click on this link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`;
    // Create the data object for sending the email
    const data = {
      to: email,
      text: "Hey user",
      subject: "Password Reset Token",
      html: resetUrl,
    };
    // Send the email
    sendEmail(data);
    // Return a success response
    res.status(200).json({
      status: "success",
      message: "Token sent to email",
      token,
    });
  } catch (error) {
    // Throw an error if something goes wrong
    throw new Error(error);
  }
});

// Reset password
const resetPassword = asyncHandler(async (req, res) => {
  // Get the new password from the request body
  const { password } = req.body;
  // Get the token from the request params
  const { token } = req.params;
  // Hash the token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  // Find the user with the given token and check if it has not expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // If no user is found, throw an error
  if (!user) {
    throw new Error("Token is invalid or has expired");
  }
  try {
    // Set the new password for the user
    user.password = password;
    // Clear the reset token and expiry date
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    // Save the user to the database
    await user.save();
    // Return a success response
    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
      user,
    });
  } catch (error) {
    // Throw an error if something goes wrong
    throw new Error(error);
  }
});

// Get wishlist
const getWishlist = asyncHandler(async (req, res) => {
  // Log the user from the request
  // console.log(req.user);
  // Get the user id from the request user
  const { _id } = req.user;
  // Validate the MongoDB Id
  validateMongoDbId(_id);
  try {
    // Find the user by its id and populate the wishlist
    const findUser = await User.findById(_id).populate("wishlist");
    // Return a success response
    res.status(200).json({
      status: "success",
      message: "Wishlist fetched successfully",
      findUser,
    });
  } catch (error) {
    // Throw an error if something goes wrong
    throw new Error(error);
  }
});

// ADD to User Cart
const userCart = asyncHandler(async (req, res) => {
  // Get the cart from the request body
  const { cart } = req.body;
  // Get the user id from the request user
  const { _id } = req.user;
  // Validate the MongoDB Id
  validateMongoDbId(_id);
  try {
    // Create an empty array for products
    let products = [];
    // Find the user by its id
    const user = await User.findById(_id);
    // Check if cart with logged in user id contains products
    const alreadyExistCart = await Cart.findOne({ orderedBy: user._id });
    // If there is an existing cart, remove it
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    // Loop through the cart items
    for (let i = 0; i < cart.length; i++) {
      // Create an empty object
      let object = {};
      // Add the product id to the object
      object.product = cart[i]._id;
      // Add the count to the object
      object.count = cart[i].count;
      // Add the color to the object
      object.color = cart[i].color;
      // Get the price of the product
      let { price } = await Product.findById(cart[i]._id)
        .select("price")
        .exec();
      // Add the price to the object
      object.price = price;
      // Push the object to the products array
      products.push(object);
    }
    // Calculate the total of the cart
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    // Create a new cart with the products, total and user id
    let newCart = await new Cart({
      products,
      cartTotal,
      orderedBy: user._id,
    }).save();
    // Return a success response
    res.status(200).json({
      status: "success",
      message: "Cart added successfully",
      newCart,
    });
  } catch (error) {
    // Throw an error if something goes wrong
    throw new Error(error);
  }
});

// Get user cart
const getUserCart = asyncHandler(async (req, res) => {
  // Get the user id from the request
  const { _id } = req.user;

  // Validate the MongoDB Id
  validateMongoDbId(_id);

  try {
    // Find the cart associated with the user and populate the product details
    const cart = await Cart.findOne({ orderedBy: _id }).populate(
      "products.product",
      "_id title price totalAfterDiscount"
    );

    // Return the response with the cart details
    res.status(200).json({
      status: "success",
      message: "User cart fetched successfully",
      cart,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// empty cart
const emptyCart = asyncHandler(async (req, res) => {
  // Get the user id from the request
  const { _id } = req.user;

  // Validate the MongoDB Id
  validateMongoDbId(_id);

  try {
    // Find the cart associated with the user and remove it
    const cart = await Cart.findOneAndRemove({ orderedBy: _id });

    // Return the response with the cart details
    res.status(200).json({
      status: "success",
      message: "Cart emptied successfully",
      cart,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Apply coupon
const applyCoupon = asyncHandler(async (req, res) => {
  // Get the coupon code from the request body
  const { coupon } = req.body;

  // Get the user id from the request
  const { _id } = req.user;

  // Validate the MongoDB Id
  validateMongoDbId(_id);

  try {
    // Find the coupon in the database
    const validCoupon = await Coupon.findOne({ name: coupon });

    // If the coupon is not found, throw an error
    if (validCoupon === null) {
      throw new Error("Invalid coupon");
    }

    // Find the cart associated with the user and populate the product details
    const userCart = await Cart.findOne({ orderedBy: _id }).populate(
      "products.product",
      "_id title price totalAfterDiscount"
    );

    // Get the products and cart total from the user cart
    const { products, cartTotal } = userCart;

    // Calculate the total after discount
    const totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);

    // Update the cart with the total after discount
    await Cart.findOneAndUpdate(
      { orderedBy: _id },
      { totalAfterDiscount },
      { new: true }
    );

    // Return the response with the total after discount
    res.status(200).json({
      status: "success",
      message: "Coupon applied successfully",
      totalAfterDiscount,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Create order
const createOrder = asyncHandler(async (req, res) => {
  // Get the COD and couponApplied from the request body
  const { COD, couponApplied } = req.body;

  // Get the user id from the request
  const { _id } = req.user;

  // Validate the MongoDB Id
  validateMongoDbId(_id);

  try {
    // If COD is not checked, throw an error
    if (!COD) {
      throw new Error("Payment method not selected");
    }

    // Find the cart associated with the user and populate the product details
    const userCart = await Cart.findOne({ orderedBy: _id }).populate(
      "products.product",
      "_id title price totalAfterDiscount"
    );

    // Initialize the final amount to 0
    let finalAmount = 0;

    // If coupon is applied and total after discount is present, calculate the final amount
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount * 100;
    } else {
      // Else set the final amount to the cart total
      finalAmount = userCart.cartTotal;
    }

    // Create a new order
    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: COD,
        amount: finalAmount,
        status: "Cash On Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderedBy: _id,
      orderStatus: "Cash On Delivery",
    }).save();

    // Map the products and update the quantity and sold count
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });

    // Bulk write the updates
    const updated = await Product.bulkWrite(update, {});

    // Return the response with the new order details
    res.status(200).json({
      status: "success",
      message: "Order created successfully",
      newOrder,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get orders
const getOrders = asyncHandler(async (req, res) => {
  // Get the user id from the request
  const { _id } = req.user;

  // Validate the MongoDB Id
  validateMongoDbId(_id);

  try {
    // Find the orders associated with the user and populate the product details
    const UserOrders = await Order.findOne({ orderedBy: _id })
      .populate("products.product")
      .populate("orderedBy")
      .exec();

    // Return the response with the orders details
    res.status(200).json({
      status: "success",
      message: "User orders fetched successfully",
      UserOrders,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get all orders
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    // Find all the orders and populate the product details
    const orders = await Order.find()
      .populate("products.product")
      .populate("orderedBy")
      .exec();

    // Return the response with the orders details
    res.status(200).json({
      status: "success",
      message: "All orders fetched successfully",
      orders,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  // Get the status from the request body
  const { status } = req.body;

  // Get the order id from the request params
  const { id } = req.params;

  // Validate the MongoDB Id
  validateMongoDbId(id);

  try {
    // Find the order by id and update the order status and payment intent status
    const updatedOrderStatus = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status, paymentIntent: { status: status } },
      { new: true }
    );

    // Return the response with the updated order status
    res.status(200).json({
      status: "success",
      message: "Order status updated successfully",
      updatedOrderStatus,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUserCtrl,
  getallUsers,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
  getAllOrders,
};
