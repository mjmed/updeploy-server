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

router.get('/', checkAuth, obtenerSistemas)
router.post('/', checkAuth,
    [
        check('codigo', 'El codigo es obligatorio').not().isEmpty(),
        check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    ],
    nuevoSistema);

router
    .route('/:id')
    .get(checkAuth, obtenerSistema)
    .put(checkAuth, editarSistema)
    .delete(checkAuth, eliminarSistema);


export default router;