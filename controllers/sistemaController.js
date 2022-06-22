
import Sistema from '../models/Sistema.js';
import { validationResult } from 'express-validator';


const obtenerSistemas = async (req, res) => {

    const sistemas = await Sistema.find().where('activo').equals(true).select('-activo -fechaAlta -fechaBaja -fechaModificacion -usuarioAlta -usuarioModificacion -usuarioBaja -__v');

    res.json(sistemas);
};

const nuevoSistema = async (req, res) => {

    // validaciones check
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    // validar no repetir objeto
    const { codigo } = req.body;
    const existeCodigo = await Sistema.findOne({ codigo }).where('activo').equals(true);
    if (existeCodigo) {
        const error = new Error('Ya existe un sistema con ese código');
        return res.status(400).json({ msg: error.message })
    }
    
    const sistema = new Sistema(req.body);
    sistema.usuarioAlta = req.usuario.username;
    sistema.fechaAlta = Date.now();

    try {

        const sistemaAlmacenado = await sistema.save();

        res.json({
            _id: sistemaAlmacenado._id,
            codigo: sistemaAlmacenado.codigo,
            descripcion: sistemaAlmacenado.descripcion
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
};

const obtenerSistema = async (req, res) => {

    const { id } = req.params;

    const sistema = await Sistema.findById(id);

    if (!sistema) {
        return res.status(404).json({ msg: 'No existe el sistema' });
    }

    res.json({
        _id: sistema._id,
        codigo: sistema.codigo,
        descripcion: sistema.descripcion
    });
};

const editarSistema = async (req, res) => {

};

const eliminarSistema = async (req, res) => {

};


export {
    obtenerSistemas,
    nuevoSistema,
    obtenerSistema,
    editarSistema,
    eliminarSistema,
}