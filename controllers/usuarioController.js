import Usuario from '../models/Usuario.js';
import generarId from '../helpers/generarId.js';
import generarJWT from '../helpers/generarJWT.js';

const usuarios = (req, res) => {
    res.json({msg: 'Listando usuarios'})
};

const crearUsuario = async (req, res) => {

    // evita registros duplicados
    const { email, username } = req.body;
    const existeEmail = await Usuario.findOne({ email });
    const existeUsername = await Usuario.findOne({ username });

    if (existeEmail) {
        const error = new Error('Ya existe un usuario con ese email');
        return res.status(400).json({ msg: error.message });
    }

    if (existeUsername) {
        const error = new Error('Ya existe un usuario con ese username');
        return res.status(400).json({ msg: error.message });
    }
    
    try {

        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        usuario.fechaAlta = Date.now();
        const usuarioAlmacenado = await usuario.save();

        res.json(usuarioAlmacenado);
        
    } catch (error) {
        console.log(error);
    }
};

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

const perfil = async (req, res) => {
    const { usuario } = req;

    res.json(usuario);
}


export {
    usuarios,
    crearUsuario,
    autenticar,
    perfil
}