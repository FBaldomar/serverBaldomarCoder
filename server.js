const express = require("express");
const app = express();
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");
const PORT = 8080;

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
