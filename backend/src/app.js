/**
 * Configuración de la Aplicación Express (Backend MVC)
 */

const express = require("express");
const path = require("path");
const cors = require("cors");

const webRoutes = require("./routes/webRoutes");
const apiRoutes = require("./routes/apiRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración del Motor de Vistas (EJS para MVC)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Servir archivos estáticos del frontend si se requiere acceder al prototipo SPA
app.use("/public", express.static(path.join(__dirname, "../../")));

// Rutas Web (SSR)
app.use("/", webRoutes);

// Rutas API REST
app.use("/api", apiRoutes);

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
  if (req.accepts("html")) {
    return res.status(404).send("<h2>404 - Página no encontrada en el BSC MVC</h2>");
  }
  res.status(404).json({ success: false, message: "Recurso no encontrado" });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error("Error en el servidor:", err);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

module.exports = app;
