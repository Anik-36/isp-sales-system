const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    address: { type: String, required: true, trim: true, maxlength: 500 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    area: { type: String, required: true, trim: true, maxlength: 100 },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CONNECTED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
