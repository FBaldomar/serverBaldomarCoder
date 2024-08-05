const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { io } = require("../server"); // Importar io desde server.js

const productsFilePath = path.join(__dirname, "../data/productos.json");

// Leer productos desde el archivo
const readProducts = () => {
  const productsData = fs.readFileSync(productsFilePath, "utf-8");
  return JSON.parse(productsData);
};

// Guardar productos en el archivo
const saveProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// Generar un nuevo ID
const generateId = () => {
  const products = readProducts();
  return products.length ? products[products.length - 1].id + 1 : 1;
};

// Rutas
router.get("/", (req, res) => {
  const products = readProducts();
  const limit = parseInt(req.query.limit) || products.length;
  res.json(products.slice(0, limit));
});

router.get("/:pid", (req, res) => {
  const products = readProducts();
  const product = products.find((p) => p.id === parseInt(req.params.pid));
  if (!product)
    return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

router.post("/", (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = [],
  } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios excepto thumbnails" });
  }

  const newProduct = {
    id: generateId(),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };
  const products = readProducts();
  products.push(newProduct);
  saveProducts(products);

  io.emit("updateProducts", products); // Emitir evento de actualización

  res.status(201).json(newProduct);
});

router.put("/:pid", (req, res) => {
  const products = readProducts();
  const productIndex = products.findIndex(
    (p) => p.id === parseInt(req.params.pid)
  );
  if (productIndex === -1)
    return res.status(404).json({ error: "Producto no encontrado" });

  const updatedProduct = {
    ...products[productIndex],
    ...req.body,
    id: products[productIndex].id,
  };
  products[productIndex] = updatedProduct;
  saveProducts(products);

  io.emit("updateProducts", products); // Emitir evento de actualización

  res.json(updatedProduct);
});

router.delete("/:pid", (req, res) => {
  const products = readProducts();
  const productIndex = products.findIndex(
    (p) => p.id === parseInt(req.params.pid)
  );
  if (productIndex === -1)
    return res.status(404).json({ error: "Producto no encontrado" });

  products.splice(productIndex, 1);
  saveProducts(products);

  io.emit("updateProducts", products); // Emitir evento de actualización

  res.status(204).send();
});

module.exports = router;
