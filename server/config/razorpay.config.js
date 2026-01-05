const Razorpay = require("razorpay");
require("dotenv").config();

//  Initializes the Razorpay connection using API Keys
const createRazorpayInstance = () => {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

module.exports ={ 
    createRazorpayInstance
};