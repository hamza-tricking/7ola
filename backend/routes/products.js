const express = require("express");
const { body, validationResult } = require("express-validator");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const { adminOnly } = require("../middleware/auth");

const router = express.Router();

// GET /api/products — list all, optional ?section= filter
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.section) {
      filter.section = req.query.section;
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/products/:id — get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/products — create product (admin)
router.post(
  "/",
  auth,
  adminOnly,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("image").trim().notEmpty().withMessage("Image is required"),
    body("section").isIn(["new-arrivals", "best-sellers"]).withMessage("Section must be new-arrivals or best-sellers"),
    body("colors").isArray({ min: 1 }).withMessage("At least one color is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT /api/products/:id — update product (admin)
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/products/:id — delete product (admin)
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
