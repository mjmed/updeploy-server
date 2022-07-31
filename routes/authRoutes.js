import express from 'express';
import { check } from 'express-validator';

import { autenticar, perfil } from '../controllers/authController.js';
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
 *  name: Auth
 *  description: Autenticación
 */

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *      summary: Autentica un usuario
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              description: Nombre de usuario del usuario
 *                          password:
 *                              type: string
 *                              description: Contraseña del usuario
 *                      required:
 *                          - username
 *                          - password
 *                      example:
 *                          username: usuario.prueba
 *                          password: usuario.prueba
 *      responses:
 *          200:
 *              description: Usuario autenticado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Usuario'
 *          500:
 *              description: Error en el servidor
 */
router.post('/login',
    [
        check('username', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ],
    autenticar);

/**
 * @swagger
 * /api/auth/perfil:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Devuelve la información del usuario autenticado
 *      tags: [Auth]
 *      responses:
 *          200:
 *              description: Información del usuario
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Usuario'
 *          500:
 *              description: Error del servidor
 */
router.get('/perfil', checkAuth, perfil);


export default router;