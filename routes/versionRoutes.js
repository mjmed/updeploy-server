import express from 'express';
import { check } from 'express-validator';

import {
    obtenerVersiones,
    nuevaVersion,
    obtenerVersion,
    editarVersion,
    eliminarVersion,
} from '../controllers/versionController.js';
import checkAuth from '../middleware/checkAuth.js';


const router = express.Router();

router.get('/', checkAuth, obtenerVersiones);
router.post('/', checkAuth,
    [
        check('numero', 'El numero es obligatorio').not().isEmpty(),
        check('sistema', 'El sistema es obligatorio').not().isEmpty(),
        check('ambiente', 'El ambiente es obligatorio').not().isEmpty(),
        check('tipo', 'El tipo es obligatorio').not().isEmpty(),
    ],
    nuevaVersion);

router
    .route('/:id')
    .get(checkAuth, obtenerVersion)
    .put(checkAuth, editarVersion)
    .delete(checkAuth, eliminarVersion);


export default router;