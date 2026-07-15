const express = require("express");
const { body, validationResult } = require("express-validator");
const Order = require("../models/Order");
const auth = require("../middleware/auth");
const { adminOnly } = require("../middleware/auth");

const router = express.Router();

// POST /api/orders — place an order (public, cash on delivery)
router.post(
  "/",
  [
    body("fullName").trim().notEmpty().withMessage("Full name is required"),
    body("phone").trim().notEmpty().withMessage("Phone number is required"),
    body("address").trim().notEmpty().withMessage("Address is required"),
    body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { fullName, phone, address, items, subtotal } = req.body;

      const order = await Order.create({
        fullName,
        phone,
        address,
        items,
        subtotal,
      });

      res.status(201).json(order);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET /api/orders — list all orders (admin)
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "name image")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/orders/:id/status — update order status (admin)
router.put(
  "/:id/status",
  auth,
  adminOnly,
  [
    body("status")
      .isIn(["pending", "processing", "shipped", "delivered", "cancelled"])
      .withMessage("Invalid status"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
