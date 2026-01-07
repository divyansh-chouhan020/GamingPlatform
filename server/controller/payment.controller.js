const { createRazorpayInstance } = require("../config/razorpay.config");
const crypto = require("crypto");
const User = require("../model/user.model");
const Payment = require("../model/payment.model");
const { sendEmail } = require("../utils/mailSender");

const razorpayInstance = createRazorpayInstance();

// Create Lifetime Subscription Order
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Check if user already has premium
    const user = await User.findById(userId);
    if (user.subscription === "premium") {
      return res.status(400).json({
        success: false,
        message: "You already have a lifetime subscription",
      });
    }

    const SUBSCRIPTION_PRICE = 999; // ₹999

    const options = {
      amount: SUBSCRIPTION_PRICE * 100, // Amount in paise
      currency: "INR",
      receipt: `sub_${userId.toString().slice(-4)}_${Date.now()}`,
    };

    // 2. Create Razorpay Order
    const order = await razorpayInstance.orders.create(options);

    // 3. Save Record in Database
    await Payment.create({
      userId,
      orderId: order.id,
      amount: SUBSCRIPTION_PRICE,
      status: "Pending",
    });

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Lifetime Subscription
exports.verifyPayment = async (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    // 1. Verify Razorpay Signature
    const body = `${order_id}|${payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // 2. Upgrade User and Update Payment Record (Atomic operations)
    await Promise.all([
      User.findByIdAndUpdate(userId, { suscription: "premium" }),
      Payment.findOneAndUpdate(
        { orderId: order_id },
        { status: "Successful", paymentId: payment_id, signature: signature }
      )
    ]);

    // 3. Send Confirmation Email
    if (userEmail) {
      sendEmail(
        userEmail,
        "Welcome to Premium!",
        "Your lifetime subscription has been activated. Enjoy all features!"
      ).catch((err) => console.log("Email error ignored:", err.message));
    }

    return res.status(200).json({
      success: true,
      message: "Lifetime subscription activated successfully!",
    });
  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};