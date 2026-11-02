const asyncHandler = require("express-async-handler");
const FutureLead = require("../models/FutureLead");
const CallbackRequest = require("../models/CallbackRequest");
const User = require("../models/User");

const createLead = asyncHandler(async (req, res) => {
  const lead = await FutureLead.create({
    customerName: String(req.body.customerName || "").trim(),
    phone: String(req.body.phone || "").trim(),
    city: String(req.body.city || "").trim(),
    areaName: String(req.body.areaName || "").trim(),
    coverageStatus: "NOT_COVERED",
  });
  res.status(201).json(lead);
});

const createCallback = asyncHandler(async (req, res) => {
  const callback = await CallbackRequest.create({
    customerName: String(req.body.customerName || "").trim(),
    phone: String(req.body.phone || "").trim(),
  });
  res.status(201).json(callback);
});

const listLeads = asyncHandler(async (req, res) => {
  res.json(await FutureLead.find().sort({ createdAt: -1 }));
});

const listCallbacks = asyncHandler(async (req, res) => {
  res.json(
    await CallbackRequest.find()
      .populate("assignedAgent", "name email")
      .sort({ createdAt: -1 }),
  );
});

const listAssignedCallbacks = asyncHandler(async (req, res) => {
  res.json(
    await CallbackRequest.find({ assignedAgent: req.user._id })
      .populate("assignedAgent", "name email")
      .sort({ createdAt: -1 }),
  );
});

const assignCallback = asyncHandler(async (req, res) => {
  const agentId = req.body.agentId || null;
  if (agentId) {
    const agent = await User.findOne({
      _id: agentId,
      role: "sales_agent",
      accountStatus: { $ne: "pending" },
    });
    if (!agent)
      return res.status(400).json({ message: "Select an active sales agent" });
  }
  const callback = await CallbackRequest.findByIdAndUpdate(
    req.params.id,
    { assignedAgent: agentId },
    { new: true, runValidators: true },
  ).populate("assignedAgent", "name email");
  if (!callback)
    return res.status(404).json({ message: "Callback request not found" });
  res.json(callback);
});

const updateCallbackStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["NOT_CONTACTED", "CONTACTED"].includes(status)) {
    return res.status(400).json({ message: "Invalid callback status" });
  }
  const filter = { _id: req.params.id };
  if (req.user.role === "sales_agent") filter.assignedAgent = req.user._id;
  const callback = await CallbackRequest.findOneAndUpdate(
    filter,
    { status },
    { new: true, runValidators: true },
  ).populate("assignedAgent", "name email");
  if (!callback)
    return res
      .status(404)
      .json({ message: "Assigned callback request not found" });
  res.json(callback);
});

const updateLeadCoverage = asyncHandler(async (req, res) => {
  if (!["COVERED", "NOT_COVERED"].includes(req.body.coverageStatus)) {
    return res.status(400).json({ message: "Invalid coverage status" });
  }
  const lead = await FutureLead.findByIdAndUpdate(
    req.params.id,
    { coverageStatus: req.body.coverageStatus },
    { new: true, runValidators: true },
  );
  if (!lead) return res.status(404).json({ message: "Future lead not found" });
  res.json(lead);
});

module.exports = {
  createLead,
  createCallback,
  listLeads,
  listCallbacks,
  listAssignedCallbacks,
  assignCallback,
  updateCallbackStatus,
  updateLeadCoverage,
};
