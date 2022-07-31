import express from 'express';
import { check } from 'express-validator';

import {
    obtenerAmbientes,
    nuevoAmbiente,
    obtenerAmbiente,
    editarAmbiente,
    eliminarAmbiente,
} from '../controllers/ambienteController.js';
import checkAuth from '../middleware/checkAuth.js';


const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      Ambiente:
 *          type: object
 *          required:
 *              - codigo
 *              - descripcion
 *          properties:
 *              codigo:
 *                  type: string
 *                  description: Código del ambiente
 *              descripcion:
 *                  type: string
 *                  description: Descripción del ambiente
 *              orden:
 *                  type: number
 *                  description: Número de orden del ambiente
 *          example:
 *              codigo: DESARROLLO
 *              descripcion: Ambiente de desarrollo
 *              orden: 1
 */

/**
 * @swagger
 * tags:
 *  name: Ambientes
 *  description: CRUD Ambientes
 */

/**
 * @swagger
 * /api/ambientes:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Devuelve el listado de todos los ambientes activos
 *      tags: [Ambientes]
 *      responses:
 *          200:
 *              description: Listado de ambientes
 *              contents:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Ambiente'
 */
router.get('/', checkAuth, obtenerAmbientes);


/**
 * @swagger
 * /api/ambientes:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      summary: Crea un nuevo ambiente
 *      tags: [Ambientes]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Ambiente'
 *      responses:
 *          200:
 *              description: El ambiente se creo correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Ambiente'
 *          500:
 *              description: Error en el servidor
 */
router.post('/', checkAuth,
    [
        check('codigo', 'El codigo es obligatorio').not().isEmpty(),
    ],
    nuevoAmbiente);

/**
 * @swagger
 * /api/ambientes/{id}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Devuelve un ambiente por su id
 *      tags: [Ambientes]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Id del ambiente
 *      responses:
 *          200:
 *              description: Información del ambiente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Ambiente'
 *          404:
 *              description: No se encontro el ambiente
 */
router.get('/:id', checkAuth, obtenerAmbiente);


/**
 * @swagger
 * /api/ambientes/{id}:
 *  put:
 *      security:
 *          - bearerAuth: []
 *      summary: Actualiza un ambiente por su id
 *      tags: [Ambientes]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Id del ambiente
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Ambiente'
 *      responses:
 *          200:
 *              description: El ambiente se actualizo correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Ambiente'
 *          404:
 *              description: El ambiente no fue encontrado
 *          500:
 *              description: Error en el servidor
 */
router.put('/:id', checkAuth, editarAmbiente);


/**
 * @swagger
 * /api/ambientes/{id}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      summary: Elimina un ambiente por su id
 *      tags: [Ambientes]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Id del ambiente
 *      responses:
 *          200:
 *              description: El ambiente se ha eliminado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Ambiente'
 *          404:
 *              description: El ambiente no fue encontrado
 *          500:
 *              description: Error en el servidor
 */
router.delete('/:id', checkAuth, eliminarAmbiente);


export default router;