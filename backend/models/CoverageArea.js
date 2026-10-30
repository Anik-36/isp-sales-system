const mongoose = require("mongoose");

const coverageAreaSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, trim: true, maxlength: 100 },
    division: { type: String, required: true, trim: true, maxlength: 100 },
    areaName: { type: String, required: true, trim: true, maxlength: 100 },
  },
  { timestamps: true },
);

coverageAreaSchema.index({ city: 1, areaName: 1 }, { unique: true });

module.exports = mongoose.model("CoverageArea", coverageAreaSchema);
