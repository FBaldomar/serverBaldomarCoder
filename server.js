const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const exphbs = require("express-handlebars");
const path = require("path");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");
const viewsRouter = require("./routes/views"); // Router para las vistas

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = 8080;

// Configurar Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter); // Usar el router para las vistas

// Configurar el servidor Socket.io
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");
  // Configuraciones de socket si es necesario
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Exportar io para usarlo en otros archivos
module.exports = { app, io };
