const express = require("express");
const {
  protect,
  optionalProtect,
  authorize,
} = require("../middleware/authMiddleware");
const {
  createOrder,
  listOrders,
  listCustomerOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();
router.post(
  "/",
  optionalProtect,
  (req, res, next) => {
    if (req.user) {
      return res
        .status(403)
        .json({
          message: "Staff accounts cannot submit public customer orders",
        });
    }
    return next();
  },
  createOrder,
);
router.get("/", protect, authorize("admin", "sales_agent"), listOrders);
router.patch(
  "/:id/status",
  protect,
  authorize("admin", "sales_agent"),
  updateOrderStatus,
);

module.exports = router;
