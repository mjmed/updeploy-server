import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';


const checkAuth = async (req, res, next) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        try {

            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.usuario = await Usuario.findById(decoded.id)
                .where('activo').equals(true)
                .select('-password -activo -token -fechaAlta -fechaBaja -fechaModificacion -usuarioAlta -usuarioModificacion -usuarioBaja -__v')

            return next();
            
        } catch (error) {
            console.log(error);
            res.status(500).send('Error en el servidor');
        }
    }

    if (!token) {
        const error = new Error('Token no válido');
        return res.status(401).json({ msg: error.message });
    }

    next();
};

export default checkAuth;