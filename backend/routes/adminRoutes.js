const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Order = require("../models/Order");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect, authorize("admin"));

router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const [totalOrders, pendingOrders, completedConnections, totalAgents] =
      await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ status: "PENDING" }),
        Order.countDocuments({ status: "CONNECTED" }),
        User.countDocuments({
          role: "sales_agent",
          accountStatus: { $ne: "pending" },
        }),
      ]);
    res.json({ totalOrders, pendingOrders, completedConnections, totalAgents });
  }),
);

router.get(
  "/agents",
  asyncHandler(async (req, res) => {
    res.json(
      await User.find({ role: "sales_agent" })
        .select("_id name email role accountStatus createdAt")
        .sort({ createdAt: -1 }),
    );
  }),
);

router.post(
  "/agents",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const agent = await User.create({
      name,
      email,
      password,
      role: "sales_agent",
      accountStatus: "active",
    });
    res.status(201).json({
      _id: agent.id,
      name: agent.name,
      email: agent.email,
      role: agent.role,
    });
  }),
);

router.patch(
  "/agents/:id/approve",
  asyncHandler(async (req, res) => {
    const agent = await User.findOneAndUpdate(
      { _id: req.params.id, role: "sales_agent", accountStatus: "pending" },
      { accountStatus: "active" },
      { new: true, runValidators: true },
    ).select("_id name email role accountStatus createdAt");
    if (!agent)
      return res.status(404).json({ message: "Pending sales agent not found" });
    res.json(agent);
  }),
);

router.delete(
  "/agents/:id",
  asyncHandler(async (req, res) => {
    const agent = await User.findOneAndDelete({
      _id: req.params.id,
      role: "sales_agent",
    });
    if (!agent)
      return res.status(404).json({ message: "Sales agent not found" });
    res.json({ message: "Sales agent deleted" });
  }),
);

module.exports = router;
