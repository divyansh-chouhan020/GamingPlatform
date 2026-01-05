const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ // Changed 404 to 400 (Bad Request)
        success: false,
        message: "Email or Password is missing",
        error: "Bad Request",
      });
    }

    const existingUser = await userModel
      .findOne({ email })
      .select("+password");

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
        error: "Bad Request",
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ // Changed 400 to 401 (Unauthorized)
        success: false,
        message: "Wrong Credentials",
        error: "Bad Request",
      });
    }

    // FIX: Include email and role in the payload
    // This allows verifyPayment to send emails and authorizeRoles to check permissions
    const token = jwt.sign(
      { 
        id: existingUser._id, 
        email: existingUser.email, 
        role: existingUser.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // Added expiration for safety
    );

    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24, // Set to 24 hours to match JWT
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict"
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
        name: existingUser.name
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};

const signup = async (req, res) => {
  try {
    const { email, name, password, age, dob, role = "user" } = req.body;
    
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
        error: "Bad Request",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
        error: "Bad Request",
      });
    }

    const newUser = await userModel.create({
      name,
      email,
      password, // Password hashing is handled by userSchema.pre("save") in your model
      age,
      dob,
      role,
    });

    // FIX: Included email and role in the Signup token as well
    // This ensures a user can buy a game immediately after signing up
    const token = jwt.sign(
      { 
        id: newUser._id, 
        email: newUser.email, 
        role: newUser.role 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    const userData = newUser.toObject();
    delete userData.password;

    return res.status(201).json({ // Changed 200 to 201 (Created)
      success: true,
      message: "Signup Successful",
      token,
      data: userData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
    });
    return res.status(200).json({
      success: true,
      message: "Logout Successful",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  login,
  signup,
  logout,
};