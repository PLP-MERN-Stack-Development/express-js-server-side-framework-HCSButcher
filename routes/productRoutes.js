const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { authenticate } = require("../middleware/auth");
const { validateProduct } = require("../middleware/validation");
const { NotFoundError } = require("../utils/errors");

let products = [
  {
    id: "1",
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM",
    price: 1200,
    category: "electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Smartphone",
    description: "Latest model with 128GB storage",
    price: 800,
    category: "electronics",
    inStock: true,
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Programmable coffee maker with timer",
    price: 50,
    category: "kitchen",
    inStock: false,
  },
];

// GET /api/products - List all products (with filter + pagination)
router.get("/", (req, res) => {
  let { category, page = 1, limit = 5, search } = req.query;
  let filtered = products;

  if (category) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + Number(limit));

  res.json({
    total: filtered.length,
    page: Number(page),
    limit: Number(limit),
    data: paginated,
  });
});

// GET /api/products/:id
router.get("/:id", (req, res, next) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return next(new NotFoundError("Product not found"));
  res.json(product);
});

// POST /api/products
router.post("/", authenticate, validateProduct, (req, res) => {
  const newProduct = { id: uuidv4(), ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id
router.put("/:id", authenticate, validateProduct, (req, res, next) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError("Product not found"));
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// DELETE /api/products/:id
router.delete("/:id", authenticate, (req, res, next) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError("Product not found"));
  const deleted = products.splice(index, 1);
  res.json({ message: "Product deleted", deleted });
});

// GET /api/products/stats - count by category
router.get("/stats/category", (req, res) => {
  const stats = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  res.json(stats);
});

module.exports = router;
