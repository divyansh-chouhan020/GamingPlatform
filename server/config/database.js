const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log(" successfully connected to the Database");
    })
    .catch((error) => {
        console.log("Database connection failed!");
        console.error(error);
        process.exit(1); // Stop the server if DB connection fails
    });
};

module.exports = connectDB;