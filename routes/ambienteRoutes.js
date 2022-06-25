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

router.get('/', checkAuth, obtenerAmbientes)
router.post('/', checkAuth,
    [
        check('codigo', 'El codigo es obligatorio').not().isEmpty(),
    ],
    nuevoAmbiente);

router
    .route('/:id')
    .get(checkAuth, obtenerAmbiente)
    .put(checkAuth, editarAmbiente)
    .delete(checkAuth, eliminarAmbiente);


export default router;