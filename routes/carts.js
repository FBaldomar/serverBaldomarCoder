const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const cartsFilePath = path.join(__dirname, "../data/carrito.json");
const productsFilePath = path.join(__dirname, "../data/productos.json");

// Leer carritos desde el archivo
const readCarts = () => {
  const cartsData = fs.readFileSync(cartsFilePath, "utf-8");
  return JSON.parse(cartsData);
};

// Guardar carritos en el archivo
const saveCarts = (carts) => {
  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

// Leer productos desde el archivo
const readProducts = () => {
  const productsData = fs.readFileSync(productsFilePath, "utf-8");
  return JSON.parse(productsData);
};

// Generar un nuevo ID
const generateId = () => {
  const carts = readCarts();
  return carts.length ? carts[carts.length - 1].id + 1 : 1;
};

// Rutas
router.post("/", (req, res) => {
  const newCart = { id: generateId(), products: [] };
  const carts = readCarts();
  carts.push(newCart);
  saveCarts(carts);

  res.status(201).json(newCart);
});

router.get("/:cid", (req, res) => {
  const carts = readCarts();
  const cart = carts.find((c) => c.id === parseInt(req.params.cid));
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart.products);
});

router.post("/:cid/product/:pid", (req, res) => {
  const carts = readCarts();
  const cart = carts.find((c) => c.id === parseInt(req.params.cid));
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  const products = readProducts();
  const product = products.find((p) => p.id === parseInt(req.params.pid));
  if (!product)
    return res.status(404).json({ error: "Producto no encontrado" });

  const existingProduct = cart.products.find((p) => p.product === product.id);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.products.push({ product: product.id, quantity: 1 });
  }

  saveCarts(carts);
  res.status(201).json(cart);
});

module.exports = router;
