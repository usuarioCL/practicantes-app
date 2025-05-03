const express = require("express");
const path = require("path");
const app = express();
const methodOverride = require("method-override");

// Importa las rutas de los practicantes

// Configuración del motor de plantillas EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Middleware para parsear datos de formularios (POST)
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Opcional
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // Extrae el método desde el body (_method)
    const method = req.body._method;
    delete req.body._method; // Limpia para que no se pase al controlador
    return method;
  }
}));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "src/public")));

// Asociar las rutas de los practicantes (después de middlewares!)
const practicantesRoutes = require("./src/routes/practicantesRoutes");
app.use("/practicantes", practicantesRoutes);

// Ruta raíz redirige a /practicantes
app.get("/", (req, res) => {
  res.redirect("/practicantes");
});

// Configurar el puerto y arrancar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
