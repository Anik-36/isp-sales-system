const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  listCoverage,
  createCoverage,
  updateCoverage,
  deleteCoverage,
} = require("../controllers/coverageController");

const router = express.Router();
router.get("/", listCoverage);
router.post("/", protect, authorize("admin"), createCoverage);
router.put("/:id", protect, authorize("admin"), updateCoverage);
router.delete("/:id", protect, authorize("admin"), deleteCoverage);

module.exports = router;
