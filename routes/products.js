const express = require("express");
const router = express.Router();
const { readProducts, saveProducts } = require("../managers/productManager");
const { io } = require("../server");

const generateId = async () => {
  const products = await readProducts();
  return products.length ? products[products.length - 1].id + 1 : 1;
};

router.get("/", async (req, res) => {
  const products = await readProducts();
  const limit = parseInt(req.query.limit) || products.length;
  res.json(products.slice(0, limit));
});

router.get("/:pid", async (req, res) => {
  const products = await readProducts();
  const product = products.find((p) => p.id === parseInt(req.params.pid));
  if (!product)
    return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

router.post("/", async (req, res) => {
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
    id: await generateId(),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };
  const products = await readProducts();
  products.push(newProduct);
  await saveProducts(products);

  io.emit("updateProducts", products); // Emitir evento de actualización

  res.status(201).json(newProduct);
});

router.put("/:pid", async (req, res) => {
  const products = await readProducts();
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
  await saveProducts(products);

  io.emit("updateProducts", products); // Emitir evento de actualización

  res.json(updatedProduct);
});

router.delete("/:pid", async (req, res) => {
  const products = await readProducts();
  const productIndex = products.findIndex(
    (p) => p.id === parseInt(req.params.pid)
  );
  if (productIndex === -1)
    return res.status(404).json({ error: "Producto no encontrado" });

  products.splice(productIndex, 1);
  await saveProducts(products);

  io.emit("updateProducts", products); // Emitir evento de actualización

  res.status(204).send();
});

module.exports = router;
