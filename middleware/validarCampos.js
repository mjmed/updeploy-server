import { validationResult } from 'express-validator';


const validarCampos = (req, res, next) => {

    // manejo de errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    next();
}


export default validarCampos;