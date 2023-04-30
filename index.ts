import express from "express";
import morgan from 'morgan';
import cors from 'cors';
import router from "./src/router";

const app = express();

// Configuración de rutas
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.options('*', cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(router);

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});