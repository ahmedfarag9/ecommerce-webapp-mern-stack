// Importing Mongoose library for MongoDB database connection
const { default: mongoose } = require("mongoose");

// Defining a function to connect to the database
const dbConnect = () => {
  try {
    // Connecting to the MongoDB database using the provided MONGODB_URI
    const conn = mongoose.connect(process.env.MONGODB_URI);
    // If successfully connected to the database, log this message to the console
    console.log("MongoDB Connected");
  } catch (error) {
    // If there's an error while connecting, log the error message to the console and exit the process
    console.log(error.message);
    process.exit(1);
  }
};

// Exporting the dbConnect function to be used by other modules
module.exports = dbConnect;
