const express = require("express");
const router = express.Router();
const { readProducts } = require("../managers/productManager");

router.get("/", async (req, res) => {
  const products = await readProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await readProducts();
  res.render("realTimeProducts", { products });
});

module.exports = router;
