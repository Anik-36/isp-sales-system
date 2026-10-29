const asyncHandler = require("express-async-handler");
const FutureLead = require("../models/FutureLead");
const CallbackRequest = require("../models/CallbackRequest");

const createLead = asyncHandler(async (req, res) => {
  const lead = await FutureLead.create(req.body);
  res.status(201).json(lead);
});

const createCallback = asyncHandler(async (req, res) => {
  const callback = await CallbackRequest.create(req.body);
  res.status(201).json(callback);
});

const listLeads = asyncHandler(async (req, res) => {
  res.json(await FutureLead.find().sort({ createdAt: -1 }));
});

const listCallbacks = asyncHandler(async (req, res) => {
  res.json(await CallbackRequest.find().sort({ createdAt: -1 }));
});

const updateCallback = asyncHandler(async (req, res) => {
  if (!["PENDING", "CONTACTED"].includes(req.body.status)) {
    return res.status(400).json({ message: "Invalid callback status" });
  }
  const callback = await CallbackRequest.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true },
  );
  if (!callback)
    return res.status(404).json({ message: "Callback request not found" });
  res.json(callback);
});

module.exports = {
  createLead,
  createCallback,
  listLeads,
  listCallbacks,
  updateCallback,
};
