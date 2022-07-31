import Usuario from '../models/Usuario.js';
import generarJWT from '../helpers/generarJWT.js';


const autenticar = async (req, res) => {

    const { username, password } = req.body;

    // comprueba si el usuario existe
    const usuario = await Usuario.findOne({ username });
    if (!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(404).json({ msg: error.message })
    }

    // comprobar si el usuario esta activo
    if (!usuario.activo) {
        const error = new Error('El usuario no se encuentra activo');
        return res.status(403).json({ msg: error.message });
    }

    // comprobar el password
    if (await usuario.comprobarPassword(password)) {

        res.json({
            _id: usuario._id,
            username: usuario.username,
            apellido: usuario.apellido,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id),
        })

    } else {
        const error = new Error('El password es incorrecto');
        return res.status(403).json({ msg: error.message });
    }
}

// devuelve los datos del usuario logueado
const perfil = async (req, res) => {
    const { usuario } = req;

    res.json(usuario);
}


export {
    autenticar,
    perfil
}