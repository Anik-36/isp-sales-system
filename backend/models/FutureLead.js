const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    city: { type: String, trim: true, maxlength: 100 },
    areaName: { type: String, required: true, trim: true, maxlength: 100 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("FutureLead", leadSchema);
