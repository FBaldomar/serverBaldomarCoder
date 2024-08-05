const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const exphbs = require("express-handlebars");
const path = require("path");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = 8080;

// Configurar Handlebars
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Ruta para la vista home
app.get("/", (req, res) => {
  const products = readProducts(); // Asegúrate de tener esta función disponible
  res.render("home", { products });
});

// Ruta para la vista realTimeProducts
app.get("/realtimeproducts", (req, res) => {
  const products = readProducts(); // Asegúrate de tener esta función disponible
  res.render("realTimeProducts", { products });
});

// Configurar el servidor Socket.io
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("newProduct", (product) => {
    const products = readProducts();
    products.push(product);
    saveProducts(products);
    io.emit("updateProducts", products);
  });

  socket.on("deleteProduct", (productId) => {
    let products = readProducts();
    products = products.filter((p) => p.id !== productId);
    saveProducts(products);
    io.emit("updateProducts", products);
  });
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Exportar io para usarlo en otros archivos
module.exports = { app, io };

// Leer productos desde el archivo
function readProducts() {
  const productsData = fs.readFileSync(productsFilePath, "utf-8");
  return JSON.parse(productsData);
}

// Guardar productos en el archivo
function saveProducts(products) {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
}
