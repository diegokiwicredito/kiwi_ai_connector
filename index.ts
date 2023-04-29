import express from "express";
import router from "./src/router";

const app = express();

// Configuración de rutas
app.use(router);

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});