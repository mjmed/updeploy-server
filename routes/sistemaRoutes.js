import express from 'express';
import { check } from 'express-validator';

import { obtenerSistemas,
    nuevoSistema,
    obtenerSistema,
    editarSistema,
    eliminarSistema,
} from '../controllers/sistemaController.js';
import checkAuth from '../middleware/checkAuth.js';


const router = express.Router();

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      Sistema:
 *          type: object
 *          required:
 *              - codigo
 *              - descripcion
 *          properties:
 *              codigo:
 *                  type: string
 *                  description: Código del sistema
 *              descripcion:
 *                  type: string
 *                  description: Descripción del sistema
 *              orden:
 *                  type: number
 *                  description: Número de orden del sistema
 *          example:
 *              codigo: SISPRUEBA
 *              descripcion: Sistema de prueba
 *              orden: 1
 */

/**
 * @swagger
 * tags:
 *  name: Sistemas
 *  description: CRUD Sistemas
 */

/**
 * @swagger
 * /api/sistemas:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Devuelve el listado de todos los sistemas activos
 *      tags: [Sistemas]
 *      responses:
 *          200:
 *              description: Listado de sistemas
 *              contents:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Sistema'
 */
router.get('/', checkAuth, obtenerSistemas);

/**
 * @swagger
 * /api/sistemas:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      summary: Crea un nuevo sistema
 *      tags: [Sistemas]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Sistema'
 *      responses:
 *          200:
 *              description: El sistema se creo correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Sistema'
 *          500:
 *              description: Error en el servidor
 */
router.post('/', checkAuth,
    [
        check('codigo', 'El codigo es obligatorio').not().isEmpty(),
        check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    ],
    nuevoSistema);

/**
 * @swagger
 * /api/sistemas/{id}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Devuelve un sistema por su id
 *      tags: [Sistemas]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Id del sistema
 *      responses:
 *          200:
 *              description: Información del sistema
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Sistema'
 *          404:
 *              description: No se encontro el sistema
 */
router.get('/:id', checkAuth, obtenerSistema);

/**
 * @swagger
 * /api/sistemas/{id}:
 *  put:
 *      security:
 *          - bearerAuth: []
 *      summary: Actualiza un sistema por su id
 *      tags: [Sistemas]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Id del sistema
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Sistema'
 *      responses:
 *          200:
 *              description: El sistema se actualizo correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Sistema'
 *          404:
 *              description: El sistema no fue encontrado
 *          500:
 *              description: Error en el servidor
 */
router.put('/:id', checkAuth, editarSistema);

/**
 * @swagger
 * /api/sistemas/{id}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      summary: Elimina un sistema por su id
 *      tags: [Sistemas]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Id del sistema
 *      responses:
 *          200:
 *              description: El sistema se ha eliminado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Sistema'
 *          404:
 *              description: El sistema no fue encontrado
 *          500:
 *              description: Error en el servidor
 */
router.delete('/:id', checkAuth, eliminarSistema);


export default router;