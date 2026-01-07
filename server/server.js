require("dotenv").config(); // Standard practice: initialize at the very top
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Import Database Config 
const connectDB = require("./config/database"); 

// Import Routes
const authRouter = require("./routes/auth.route");
const gameRouter = require("./routes/gaming.route");
const userRouter = require("./routes/user.route");
const paymentRouter = require("./routes/payments.route");

const app = express();
const port = process.env.PORT || 5001;

// Initialize Database Connection 
connectDB(); 

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Routes
app.get("/", (req, res) => {
  return res.json({
    success: true, 
    message: "Game Arena Server - Active",
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/game", gameRouter);
app.use("/api/v1/update", userRouter);
app.use("/api/v1/payments", paymentRouter);

// Start Server using app.listen (since http/socket wrapper is removed)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});