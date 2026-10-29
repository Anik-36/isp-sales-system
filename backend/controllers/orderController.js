const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Package = require("../models/Package");

const statuses = ["PENDING", "CONFIRMED", "CONNECTED", "CANCELLED"];

const createOrder = asyncHandler(async (req, res) => {
  const packageId = req.body.packageId || req.body.package;
  const selectedPackage = await Package.findOne({
    _id: packageId,
    isActive: true,
  });
  if (!selectedPackage)
    return res.status(400).json({ message: "Select an active package" });
  const order = await Order.create({
    ...req.body,
    package: selectedPackage.id,
    status: "PENDING",
  });
  res.status(201).json(await order.populate("package"));
});

const listOrders = asyncHandler(async (req, res) => {
  res.json(await Order.find().populate("package").sort({ createdAt: -1 }));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  if (!statuses.includes(req.body.status))
    return res.status(400).json({ message: "Invalid order status" });
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true },
  ).populate("package");
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

module.exports = { createOrder, listOrders, updateOrderStatus };
