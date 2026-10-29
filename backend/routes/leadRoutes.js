const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createLead,
  createCallback,
  listLeads,
  listCallbacks,
  updateCallback,
} = require("../controllers/leadController");

const router = express.Router();
router.post("/leads", createLead);
router.post("/callbacks", createCallback);
router.get("/leads", protect, authorize("admin"), listLeads);
router.get("/callbacks", protect, authorize("admin"), listCallbacks);
router.patch("/callbacks/:id", protect, authorize("admin"), updateCallback);

module.exports = router;
