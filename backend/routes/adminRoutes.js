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
        User.countDocuments({ role: "sales_agent" }),
      ]);
    res.json({ totalOrders, pendingOrders, completedConnections, totalAgents });
  }),
);

router.get(
  "/agents",
  asyncHandler(async (req, res) => {
    res.json(
      await User.find({ role: "sales_agent" })
        .select("_id name email role createdAt")
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
    });
    res
      .status(201)
      .json({
        _id: agent.id,
        name: agent.name,
        email: agent.email,
        role: agent.role,
      });
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
