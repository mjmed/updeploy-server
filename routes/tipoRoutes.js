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

router.get('/', checkAuth, obtenerTipos);
router.post('/', checkAuth,
    [
        check('codigo', 'El codigo es obligatorio').not().isEmpty(),
    ],
    nuevoTipo);

router
    .route('/:id')
    .get(checkAuth, obtenerTipo)
    .put(checkAuth, editarTipo)
    .delete(checkAuth, eliminarTipo);


export default router;