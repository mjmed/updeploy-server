import express from 'express';

import { usuarios, crearUsuario, autenticar, perfil } from '../controllers/usuarioController.js';

import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();


router.get('/', usuarios);
router.post('/', crearUsuario);
router.post('/login', autenticar);

router.get('/perfil', checkAuth, perfil);


export default router;