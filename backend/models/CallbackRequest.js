const mongoose = require("mongoose");

const callbackSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ["NOT_CONTACTED", "CONTACTED"],
      default: "NOT_CONTACTED",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CallbackRequest", callbackSchema);
