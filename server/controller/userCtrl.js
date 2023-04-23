const generateToken = require("../config/jwtToken");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const generateRefreshToken = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto");

// Create User
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    // Create a new User
    const newUser = await User.create(req.body);
    res.json(newUser);
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
  const { _id } = req.user;
  const { address } = req.body;
  validateMongoDbId(_id);
  try {
    const saveAddress = await User.findByIdAndUpdate(
      _id,
      {
        address: address,
      },
      { new: true }
    );
    res.json(saveAddress);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all users
const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single user
const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaUser = await User.findById(id);
    res.json(getaUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a user
const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({ deleteaUser });
  } catch (error) {
    throw new Error(error);
  }
});

// Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  // console.log(cookie);
  if (!cookie?.refreshtoken) {
    throw new Error("No refresh token in Cookies, Please Login or Register");
  }
  const refreshToken = cookie.refreshtoken;
  //console.log(refreshToken);
  const user = await User.findOne({ refreshtoken: refreshToken });
  if (!user) {
    throw new Error("No user found, Please Login or Register");
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("Invalid Refresh Token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

// logout functionallity
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshtoken) {
    throw new Error("No refresh token in Cookies, Please Login or Register");
  }
  const refreshToken = cookie.refreshtoken;
  const user = await User.findOne({ refreshtoken: refreshToken });
  if (!user) {
    res.clearCookie("refreshtoken", { httpOnly: true, secure: true });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, { refreshtoken: "" });
  res.clearCookie("refreshtoken", { httpOnly: true, secure: true });
  return res.sendStatus(204); // forbidden
});

// Update a user
const updatedUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
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
    res.json({ updatedUser });
  } catch (error) {
    throw new Error(error);
  }
});

// Block a user
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const blockuser = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    res.json(blockuser);
  } catch (error) {
    throw new Error(error);
  }
});

// Unblock a user
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unblockuser = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    res.json(unblockuser);
  } catch (error) {
    throw new Error(error);
  }
});

// Update password
const updatePassword = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  try {
    const user = await User.findById(_id);
    if (password) {
      user.password = password;
      const updatedPassword = await user.save();
      res.json(updatedPassword);
    } else {
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Forgot password
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetUrl = `Please click on this link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`;
    const data = {
      to: email,
      text: "Hey user",
      subject: "Password Reset Token",
      html: resetUrl,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

// Reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("Token is invalid or has expired");
  }
  try {
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

// Get wishlist
const getWishlist = asyncHandler(async (req, res) => {
  console.log(req.user);
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

// user cart
const userCart = asyncHandler(async (req, res) => {
  // console.log(req.body);
  // console.log(req.user._id);
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let products = [];
    const user = await User.findById(_id);
    // check if cart with logged in user id contains products
    const alreadyExistCart = await Cart.findOne({ orderedBy: user._id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      // get price for creating total
      let { price } = await Product.findById(cart[i]._id)
        .select("price")
        .exec();
      object.price = price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    // console.log("cartTotal", cartTotal);
    let newCart = await new Cart({
      products,
      cartTotal,
      orderedBy: user._id,
    }).save();
    // console.log("new cart ----> ", newCart);
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

// Get user cart
const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOne({ orderedBy: _id }).populate(
      "products.product",
      "_id title price totalAfterDiscount"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

// empty cart
const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOneAndRemove({ orderedBy: _id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
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
};
