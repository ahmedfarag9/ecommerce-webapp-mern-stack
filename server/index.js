// Require all necessary modules, including Express, database connect, dotenv, routers, middlewares, and logging tool
const express = require("express");
const dbConnect = require("./config/dbConnect");
const dotenv = require("dotenv").config();
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const productCategoryRouter = require("./routes/productCategoryRoute");
const blogCategoryRouter = require("./routes/blogCategoryRoute");
const brandRouter = require("./routes/brandRoute");
const colorRouter = require("./routes/colorRoute");
const enqRouter = require("./routes/enqRoute");
const couponRouter = require("./routes/couponRoute");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

// Initialize the Express app
const app = express();

// Set the port to listen on and connect to the database
const PORT = process.env.PORT || 4000;
dbConnect();

// Use middlewares
app.use(morgan("dev")); // Log every request to the console using the dev format for Morgan
app.use(cors()); // Allow cross origin resource sharing
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(bodyParser.urlencoded({ extended: false })); // Support parsing of x-www-form-urlencoded data
app.use(cookieParser()); // Parse cookies attached to incoming client requests

// Use routers
app.use("/api/user", authRouter); // Route for user authentication and registration
app.use("/api/product", productRouter); // Route for accessing and modifying product data
app.use("/api/blog", blogRouter); // Route for accessing and modifying blog post data
app.use("/api/product-category", productCategoryRouter); // Route for accessing and modifying product category data
app.use("/api/blog-category", blogCategoryRouter); // Route for accessing and modifying blog post category data
app.use("/api/brand", brandRouter); // Route for accessing and modifying brand data
app.use("/api/coupon", couponRouter); // Route for accessing and modifying coupon data
app.use("/api/color", colorRouter); // Route for accessing and modifying color data
app.use("/api/enquiry", enqRouter); // Route for handling customer enquiries

// Use error handlers
app.use(notFound); // Handle 404 errors and forward them to the error handler
app.use(errorHandler); // Error handler for all other types of errors

// Start listening on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
