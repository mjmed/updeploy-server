import express from 'express';
import { check } from 'express-validator';

import { crearUsuario } from '../controllers/usuarioController.js';
import checkAuth from '../middleware/checkAuth.js';
import validarCampos from '../middleware/validarCampos.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      Usuario:
 *          type: object
 *          required:
 *              - nombre
 *              - apellido
 *              - username
 *              - email
 *              - password
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: Nombre del usuario
 *              apellido:
 *                  type: string
 *                  description: Apellido del usuario
 *              username:
 *                  type: string
 *                  description: Nombre de usuario del usuario
 *              email:
 *                  type: string
 *                  description: Correo electrónico del usuario
 *              password:
 *                  type: string
 *                  description: Contraseña del usuario
 *          example:
 *              nombre: Usuario
 *              apellido: Prueba
 *              email: usuario.prueba@test.com
 *              username: usuario.prueba
 *              password: usuario.prueba
 */

/**
 * @swagger
 * tags:
 *  name: Usuarios
 *  description: Administrador API de Usuarios
 */

/**
 * @swagger
 * /api/usuarios:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      summary: Crea un nuevo usuario
 *      tags: [Usuarios]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Usuario'
 *      responses:
 *          200:
 *              description: Usuario creado correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Usuario'
 *          500:
 *              description: Error en el servidor
 */
router.post('/', checkAuth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellido', 'El apellido es obligatorio').not().isEmpty(),
        check('username', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('email', 'El email no es valido').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('password', 'El password debe ser de 6 caracteres como mínimo').isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario);


export default router;