const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    password: {
      required: true,
      type: String,
      trim: true,
      min: 8,
      max: 100,
      select: false, 
    },
    email: {
      required: true,
      type: String,
      trim: true,
      unique: true,
      lowercase: true, // nice to put in lowercase 
    },
    name: {
      required: true,
      type: String,
      trim: true,
      max: 100,
    },
    role: {
      type: String,
      enum: ["user", "admin", "developer"],
      default: "user",
    },
    age: {
      type: Number,
      min: [12, "Age must be above 12"],
      max: [60, "Age must be below 60"],
    },
    dob: {
      type: Date,
    },
    // this will add user to connect the game they buy 
    ownedGames: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",     // links to Game model
      },
    ],
  },
  { timestamps: true }
);

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

// Avoid model recompilation error in development
const userModel = mongoose.models.users || mongoose.model("users", userSchema);
module.exports = userModel;