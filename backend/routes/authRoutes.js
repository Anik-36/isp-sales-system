const express = require("express");
const {
  login,
  registerSalesAgent,
  registerInitialAdmin,
} = require("../controllers/authController");

const router = express.Router();
router.post("/admin/login", login(["admin"]));
router.post("/agent/login", login(["sales_agent"]));
router.post("/agent/register", registerSalesAgent);
router.post("/admin/register", registerInitialAdmin);

module.exports = router;
