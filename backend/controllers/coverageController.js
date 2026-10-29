const asyncHandler = require("express-async-handler");
const CoverageArea = require("../models/CoverageArea");

const listCoverage = asyncHandler(async (req, res) => {
  const query = req.query.city ? { city: req.query.city } : {};
  res.json(await CoverageArea.find(query).sort({ city: 1, areaName: 1 }));
});

const createCoverage = asyncHandler(async (req, res) => {
  const area = await CoverageArea.create({
    city: req.body.city,
    areaName: req.body.areaName,
  });
  res.status(201).json(area);
});

const updateCoverage = asyncHandler(async (req, res) => {
  const area = await CoverageArea.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!area)
    return res.status(404).json({ message: "Coverage area not found" });
  res.json(area);
});

const deleteCoverage = asyncHandler(async (req, res) => {
  const area = await CoverageArea.findByIdAndDelete(req.params.id);
  if (!area)
    return res.status(404).json({ message: "Coverage area not found" });
  res.json({ message: "Coverage area deleted" });
});

module.exports = {
  listCoverage,
  createCoverage,
  updateCoverage,
  deleteCoverage,
};
