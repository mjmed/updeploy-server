import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import sistemaRoutes from './routes/sistemaRoutes.js';
import tipoRoutes from './routes/tipoRoutes.js';
import ambienteRoutes from './routes/ambienteRoutes.js';
import versionRoutes from './routes/versionRoutes.js';
import authRoutes from './routes/authRoutes.js';

// puerto de la app
const PORT = process.env.PORT || 4000;

// swagger documentación
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "UpDeploy API",
            version: "1.0.0",
            description: "Servidor Express para UpDeploy API"
        },
        servers: [
            {
                url: `http://localhost:${PORT}`
            }
        ],
    },
    components: {
        securitySchemes: {
          jwt: {
            type: "http",
            scheme: "bearer",
            in: "header",
            bearerFormat: "JWT"
          },
        }
    },
    apis: ["./routes/*.js"],
}

const specs = swaggerJSDoc(options)

// crear el servidor 
const app = express();

// habilitar leer los valores de un body
app.use(express.json());

// habilitar variables de entorno
dotenv.config();

// conexión a la base de datos
conectarDB();

// configurar cors
// const whitelist = [process.env.FRONTEND_URL];

// const corsOptions = {
//     origin: function(origin, callback) {
//         if (whitelist.includes(origin)) {

//             // tiene permiso de consultar la api
//             callback(null, true);

//         } else {
//             callback(new Error("Error de CORS"));
//         }
//     }
// };

// app.use(cors(corsOptions));
app.use(cors());

// routing
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/sistemas', sistemaRoutes);
app.use('/api/tipos', tipoRoutes);
app.use('/api/ambientes', ambienteRoutes);
app.use('/api/versiones', versionRoutes);



// arrancar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${ PORT }`);
});