const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createOrder,
  listOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();
router.post("/", createOrder);
router.get("/", protect, authorize("admin", "sales_agent"), listOrders);
router.patch(
  "/:id/status",
  protect,
  authorize("admin", "sales_agent"),
  updateOrderStatus,
);

module.exports = router;
