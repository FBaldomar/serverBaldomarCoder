const fs = require("fs").promises;
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/productos.json");

const readProducts = async () => {
  try {
    const productsData = await fs.readFile(productsFilePath, "utf-8");
    return JSON.parse(productsData);
  } catch (error) {
    console.error("Error leyendo los productos:", error);
    return [];
  }
};

const saveProducts = async (products) => {
  try {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("Error guardando los productos:", error);
  }
};

module.exports = { readProducts, saveProducts };
