const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  listPackages,
  createPackage,
  updatePackage,
  deletePackage,
} = require("../controllers/packageController");

const router = express.Router();
router.get(
  "/",
  (req, res, next) => {
    if (req.query.all !== "true") return next();
    return protect(req, res, () => authorize("admin")(req, res, next));
  },
  listPackages,
);
router.post("/", protect, authorize("admin"), createPackage);
router.put("/:id", protect, authorize("admin"), updatePackage);
router.delete("/:id", protect, authorize("admin"), deletePackage);

module.exports = router;
