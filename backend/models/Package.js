const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    speed: { type: String, required: true, trim: true, maxlength: 40 },
    price: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Package", packageSchema);
