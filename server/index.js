// Require Express, Database Connect, Dotenv, Auth Router, Product Router, Body Parser, Error Handler, Cookie Parser and Morgan
const express = require("express");
const dbConnect = require("./config/dbConnect");
const dotenv = require("dotenv").config();
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// Initialize Express App
const app = express();

// Set Port and Connect to Database
const PORT = process.env.PORT || 4000;
dbConnect();

// Use Middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Use Routers
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);

// Use Error Handlers
app.use(notFound);
app.use(errorHandler);

// Listen on Port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});