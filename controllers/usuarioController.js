import Usuario from '../models/Usuario.js';
import generarId from '../helpers/generarId.js';


const crearUsuario = async (req, res) => {

    const { email, username } = req.body;
    
    // verifica que ya no exista ese email
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
        const error = new Error('Ya existe un usuario con ese email');
        return res.status(400).json({ msg: error.message });
    }

    // verifica que ya no exista ese username
    const existeUsername = await Usuario.findOne({ username });
    if (existeUsername) {
        const error = new Error('Ya existe un usuario con ese username');
        return res.status(400).json({ msg: error.message });
    }
    
    try {

        const usuario = new Usuario(req.body);

        usuario.token = generarId();
        usuario.fechaAlta = Date.now();

        const usuarioAlmacenado = await usuario.save();

        res.status(201).json({
            _id: usuarioAlmacenado._id,
            username: usuarioAlmacenado.username,
            password: usuarioAlmacenado.password,
            nombre: usuarioAlmacenado.nombre,
            apellido: usuarioAlmacenado.apellido,
            email: usuarioAlmacenado.email
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
};


export {
    crearUsuario,
}