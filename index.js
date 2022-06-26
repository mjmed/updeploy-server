import express from 'express';
import dotenv from 'dotenv';

import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import sistemaRoutes from './routes/sistemaRoutes.js';
import tipoRoutes from './routes/tipoRoutes.js';
import ambienteRoutes from './routes/ambienteRoutes.js';
import versionRoutes from './routes/versionRoutes.js';


// crear el servidor
const app = express();

app.use(express.json());

// habilitar variables de entorno
dotenv.config();

// conexión a la base de datos
conectarDB();

// routing
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/sistemas', sistemaRoutes);
app.use('/api/tipos', tipoRoutes);
app.use('/api/ambientes', ambienteRoutes);
app.use('/api/versiones', versionRoutes);

// puerto de la app
const PORT = process.env.PORT || 4000;

// arrancar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${ PORT }`);
});