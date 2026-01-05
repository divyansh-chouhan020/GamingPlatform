const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0, // 0 means the game is free
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", 
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    avatar: {
      type: String, // URL for game thumbnail
    },
    
    purchasedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true }
);


const gameModel = mongoose.models.games || mongoose.model("games", gameSchema);

module.exports = gameModel;