import express from 'express';
import { check } from 'express-validator';

import {
    obtenerVersiones,
    nuevaVersion,
    obtenerVersion,
    editarVersion,
    eliminarVersion,
    listarVersionesAgrupadas
} from '../controllers/versionController.js';
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
 *      Version:
 *          type: object
 *          required:
 *              - numero
 *              - descripcion
 *              - fechaSubida
 *              - sistema
 *              - ambiente
 *              - tipo
 *          properties:
 *              numero:
 *                  type: strin
 *                  description: Número de versión
 *              descripcion:
 *                  type: string
 *                  description: Descripción de la versión
 *              fechaSubida:
 *                  type: date
 *                  description: Fecha de subida de la versión
 *              sistema:
 *                  type: ObjectId
 *                  description: Sistema al que pertenece la versión
 *              ambiente:
 *                  type: ObjectId
 *                  description: Ambiente al que pertenece la versión
 *              tipo:
 *                  type: ObjectId
 *                  description: Tipo al que pertenece la versión
 *          example:
 *              numero: 1.1.0,
 *              descripcion: Primera versión del Back-End en desarrollo
 *              fechaSubida: 2022-07-19T00:00:00.000Z,
 *              sistema: 62b640b64955c1d240ba2555,
 *              ambiente: 62b77f2e3be1638241be687c,
 *              tipo: 62b64b58d25e1d4e36fa0c58
 */

/**
 * @swagger
 * tags:
 *  name: Versiones
 *  description: CRUD de Version
 */

/**
 * @swagger
 * /api/versiones:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Devuelve el listado de todas las versiones activos
 *      tags: [Versiones]
 *      responses:
 *          200:
 *              description: Listado de versiones
 *              contents:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Version'
 */
router.get('/', checkAuth, obtenerVersiones);

/**
 * @swagger
 * /api/versiones:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      summary: Crea una nueva versión
 *      tags: [Versiones]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Version'
 *      responses:
 *          200:
 *              description: La versión se creo correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Version'
 *          500:
 *              description: Error en el servidor
 */
router.post('/', checkAuth,
    [
        check('numero', 'El numero es obligatorio').not().isEmpty(),
        check('sistema', 'El sistema es obligatorio').not().isEmpty(),
        check('ambiente', 'El ambiente es obligatorio').not().isEmpty(),
        check('tipo', 'El tipo es obligatorio').not().isEmpty(),
    ],
    nuevaVersion);

/**
 * @swagger
 * /api/versiones/listar:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Devuelve el listado de todas las versiones ordenadas en forma descendente por número de versión y agrupadas por sistema, tipo y ambiente
 *      tags: [Versiones]
 *      responses:
 *          200:
 *              description: Listado de versiones ordenadas y agrupadas
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Version'
 */
router.get('/listar', checkAuth, listarVersionesAgrupadas);

/**
 * @swagger
 * /api/versiones/{id}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Devuelve una versión por su id
 *      tags: [Versiones]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Id de la versión
 *      responses:
 *          200:
 *              description: Información de la versión
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Version'
 *          404:
 *              description: No se encontro la version
 */
router.get('/:id', checkAuth, obtenerVersion);

/**
 * @swagger
 * /api/versiones/{id}:
 *  put:
 *      security:
 *          - bearerAuth: []
 *      summary: Actualiza una versión por su id
 *      tags: [Versiones]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Id de la versión
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Version'
 *      responses:
 *          200:
 *              description: La versión se actualizo correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Version'
 *          404:
 *              description: No se encontro la versión
 *          500:
 *              description: Error en el servidor
 */
router.put('/:id', checkAuth, editarVersion);

/**
 * @swagger
 * /api/versiones/{id}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      summary: Elimina una versión por su id
 *      tags: [Versiones]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Id de la versión
 *      responses:
 *          200:
 *              description: La versión se ha eliminado
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Version'
 *          404:
 *              description: No se encontro la version
 *          500:
 *              description: Error en el servidor
 */
router.delete('/:id', checkAuth, eliminarVersion);


export default router;