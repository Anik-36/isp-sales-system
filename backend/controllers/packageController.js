const asyncHandler = require("express-async-handler");
const Package = require("../models/Package");

const listPackages = asyncHandler(async (req, res) => {
  const query =
    req.user?.role === "admin" && req.query.all === "true"
      ? {}
      : { isActive: true };
  res.json(await Package.find(query).sort({ price: 1 }));
});

const createPackage = asyncHandler(async (req, res) => {
  const pkg = await Package.create({
    name: req.body.name,
    speed: req.body.speed,
    price: req.body.price,
    isActive: req.body.isActive,
  });
  res.status(201).json(pkg);
});

const updatePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!pkg) return res.status(404).json({ message: "Package not found" });
  res.json(pkg);
});

const deletePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findByIdAndDelete(req.params.id);
  if (!pkg) return res.status(404).json({ message: "Package not found" });
  res.json({ message: "Package deleted" });
});

module.exports = { listPackages, createPackage, updatePackage, deletePackage };
