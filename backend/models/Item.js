const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    location: {
      type: String,
      required: true
    },
    community: {
      type: String,
      required: true
    },
    image: String,
    status: {
      type: String,
      default: "open"
    },
    phone: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);