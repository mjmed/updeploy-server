import express from 'express';
import { check } from 'express-validator';

import {
    obtenerTipos,
    nuevoTipo,
    obtenerTipo,
    editarTipo,
    eliminarTipo,
} from '../controllers/tipoController.js';
import checkAuth from '../middleware/checkAuth.js';


const router = express.Router();


/**
 * @swagger
 * components:
 *  schemas:
 *      Tipo:
 *          type: object
 *          required:
 *              - codigo
 *              - descripcion
 *          properties:
 *              codigo:
 *                  type: string
 *                  description: Código de tipo
 *              descripcion:
 *                  type: string
 *                  description: Descripción de tipo
 *          example:
 *              codigo: BACKEND
 *              descripcion: Tipo back-end
 */

/**
 * @swagger
 * tags:
 *  name: Tipos
 *  description: CRUD Tipos
 */

/**
 * @swagger
 * /api/tipos:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Devuelve el listado de todos los tipos activos
 *      tags: [Tipos]
 *      responses:
 *          200:
 *              description: Listado de tipos
 *              contents:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Tipo'
 */
router.get('/', checkAuth, obtenerTipos);

/**
 * @swagger
 * /api/tipos:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      summary: Crea un nuevo tipo
 *      tags: [Tipos]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Tipo'
 *      responses:
 *          200:
 *              description: El tipo se creo correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Tipo'
 *          500:
 *              description: Error en el servidor
 */
router.post('/', checkAuth,
    [
        check('codigo', 'El codigo es obligatorio').not().isEmpty(),
    ],
    nuevoTipo);

/**
 * @swagger
 * /api/tipos/{id}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Devuelve un tipo por su id
 *      tags: [Tipos]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Id del tipo
 *      responses:
 *          200:
 *              description: Información del tipo
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Tipo'
 *          404:
 *              description: No se encontro el tipo
 */
router.get('/:id', checkAuth, obtenerTipo);

/**
 * @swagger
 * /api/tipos/{id}:
 *  put:
 *      security:
 *          - bearerAuth: []
 *      summary: Actualiza un tipo por su id
 *      tags: [Tipos]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Id del tipo
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Tipo'
 *      responses:
 *          200:
 *              description: El tipo se actualizo correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Tipo'
 *          404:
 *              description: El tipo no fue encontrado
 *          500:
 *              description: Error en el servidor
 */
router.put('/:id', checkAuth, editarTipo);

/**
 * @swagger
 * /api/tipos/{id}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      summary: Elimina un tipo por su id
 *      tags: [Tipos]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Id del tipo
 *      responses:
 *          200:
 *              description: El tipo se ha eliminado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Tipo'
 *          404:
 *              description: El tipo no fue encontrado
 *          500:
 *              description: Error en el servidor
 */
router.delete('/:id', checkAuth, eliminarTipo);


export default router;