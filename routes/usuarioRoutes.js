import express from 'express';
import { check } from 'express-validator';

import {
    crearUsuario,
    autenticar,
    perfil
} from '../controllers/usuarioController.js';
import checkAuth from '../middleware/checkAuth.js';
import validarCampos from '../middleware/validarCampos.js';

const router = express.Router();


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
router.post('/login',
    [
        check('username', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ],
    autenticar);
router.get('/perfil', checkAuth, perfil);


export default router;