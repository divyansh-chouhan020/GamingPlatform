const { createRazorpayInstance } = require("../config/razorpay.config");
const crypto = require("crypto");
const User = require("../model/user.model"); // Ensure path matches your project
const Game = require("../model/game.model"); 
const Payment = require("../model/payment.model");
const { sendEmail } = require("../utils/mailSender");

const razorpayInstance = createRazorpayInstance();

exports.createOrder = async (req, res) => {
    try {
        const { gameId } = req.body;
        const userId = req.user.id; 

        //  Fetch Game Price
        const game = await Game.findById(gameId);
        if (!game) return res.status(404).json(
            { success: false,
             message: "Game not found"
             });

        //  Razorpay Options
        const options = {
            amount: Math.round(game.price * 100), // Ensure it's an integer
            currency: "INR",
            receipt: `rcpt_${userId.toString().slice(-4)}_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        // 3. Save Pending Payment (Crucial for reconciliation)
        await Payment.create({
            userId, 
            gameId, 
            orderId: order.id,
            amount: game.price, 
            status: "Pending"
        });

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { order_id, payment_id, signature, gameId } = req.body;
        const userId = req.user.id;
        const userEmail = req.user.email; 
        const io = req.app.get("socketio");

        // 1. Verify Signature
        const body = order_id + "|" + payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== signature) {
            return res.status(400).json({ success: false, message: "Invalid Signature" });
        }

        // 2. Atomic Updates (Database)
        // Using $addToSet prevents duplicate game entries if the user double-clicks
        await User.findByIdAndUpdate(userId, { 
            $addToSet: { ownedGames: gameId } 
        });

        await Payment.findOneAndUpdate(
            { orderId: order_id }, 
            { status: "Successful", paymentId: payment_id },
            { new: true }
        );

        // 3. Trigger Real-time Notification
        if (io) {
            io.to(userId).emit("PAYMENT_SUCCESS", { 
                gameId, 
                message: "Payment verified successfully!" 
            });
        }

        // 4. Send Email (Non-blocking)
        if (userEmail) {
            sendEmail(
                userEmail,
                "Payment Success - Game Unlocked!",
                `<h1>Success!</h1><p>Game ID: ${gameId} has been added to your library.</p>`
            ).catch(err => console.log("Email Error:", err.message));
        }

        return res.status(200).json({
            success: true,
            message: "Payment Verified Successfully"
        });

    } catch (error) {
        console.error("Verification Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during verification"
        });
    }
};