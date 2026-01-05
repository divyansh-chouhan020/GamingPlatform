const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
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

// Create HTTP Server and Initialize Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
});

// Sharing this io instance globally
app.set("socketio", io);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Socket.io Connection Logic
io.on("connection", (socket) => {
  console.log("User connected to socket:", socket.id);
  
  socket.on("join_room", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their private notification room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Routes
app.get("/", (req, res) => {
  return res.json({
    sucess: true,
    message: "Hello Server",
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/game", gameRouter);
app.use("/api/v1/update", userRouter);
app.use("/api/v1/payments", paymentRouter);

// Start Server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});