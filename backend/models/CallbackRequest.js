const mongoose = require("mongoose");

const callbackSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    status: {
      type: String,
      enum: ["PENDING", "CONTACTED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CallbackRequest", callbackSchema);
