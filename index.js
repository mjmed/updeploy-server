import express from 'express';
import dotenv from 'dotenv';

import conectarDB from './config/db.js';

// crear el servidor
const app = express();

// habilitar variables de entorno
dotenv.config();

// conectar a la base de datos
conectarDB();

// puerto de la app
const PORT = process.env.PORT || 4000;

// arrancar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${ PORT }`);
});