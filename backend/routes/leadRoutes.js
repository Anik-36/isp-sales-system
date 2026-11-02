const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createLead,
  createCallback,
  listLeads,
  listCallbacks,
  listAssignedCallbacks,
  assignCallback,
  updateCallbackStatus,
  updateLeadCoverage,
  deleteLead,
} = require("../controllers/leadController");

const router = express.Router();
router.post("/leads", createLead);
router.post("/callbacks", createCallback);
router.get("/leads", protect, authorize("admin"), listLeads);
router.patch(
  "/leads/:id/coverage",
  protect,
  authorize("admin"),
  updateLeadCoverage,
);
router.delete("/leads/:id", protect, authorize("admin"), deleteLead);
router.get("/callbacks", protect, authorize("admin"), listCallbacks);
router.patch(
  "/callbacks/:id/assign",
  protect,
  authorize("admin"),
  assignCallback,
);
router.get(
  "/agent/callbacks",
  protect,
  authorize("sales_agent"),
  listAssignedCallbacks,
);
router.patch(
  "/callbacks/:id/status",
  protect,
  authorize("admin", "sales_agent"),
  updateCallbackStatus,
);

module.exports = router;
