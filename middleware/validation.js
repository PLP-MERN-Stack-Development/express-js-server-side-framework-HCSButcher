// middleware/validation.js
function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !description || price == null || !category) {
    return res
      .status(400)
      .json({ message: "Missing required product fields." });
  }

  if (typeof price !== "number" || price < 0) {
    return res.status(400).json({ message: "Invalid price value." });
  }

  if (typeof inStock !== "boolean") {
    return res.status(400).json({ message: "inStock must be a boolean." });
  }

  next();
}

module.exports = { validateProduct };
