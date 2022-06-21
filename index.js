import express from 'express';
import dotenv from 'dotenv';

import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import sistemaRoutes from './routes/sistemaRoutes.js';


// crear el servidor
const app = express();

app.use(express.json());

// habilitar variables de entorno
dotenv.config();

// conectar a la base de datos
conectarDB();

// routing
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/sistemas', sistemaRoutes);

// puerto de la app
const PORT = process.env.PORT || 4000;

// arrancar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${ PORT }`);
});