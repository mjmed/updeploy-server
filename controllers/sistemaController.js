import { validationResult } from 'express-validator';

import Sistema from '../models/Sistema.js';


const obtenerSistemas = async (req, res) => {

    const sistemas = await Sistema.find()
        .where('activo').equals(true)
        .select('-activo -fechaAlta -fechaBaja -fechaModificacion -usuarioAlta -usuarioModificacion -usuarioBaja -__v');

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
            descripcion: sistemaAlmacenado.descripcion,
            orden: sistemaAlmacenado.orden
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
};

const obtenerSistema = async (req, res) => {

    const { id } = req.params;

    const sistema = await Sistema.findById(id).where('activo').equals(true);

    if (!sistema) {
        return res.status(404).json({ msg: 'No existe el sistema' });
    }

    res.json({
        _id: sistema._id,
        codigo: sistema.codigo,
        descripcion: sistema.descripcion,
        orden: sistema.orden
    });
};

const editarSistema = async (req, res) => {

    const { id } = req.params;
    const { codigo } = req.body;

    // verifica que no se traiga un documeto no activo
    const sistema = await Sistema.findById(id).where('activo').equals(true);
    
    if (!sistema) {
        const error = new Error('No existe el sistema');
        return res.status(404).json({ msg: error.message });
    }
    
    // verifica que no se repita el codigo
    if (req.body.codigo) {
        const existeCodigo = await Sistema.findOne({ codigo })
            .where('activo').equals(true)
            .where({"_id": {"$ne":id}})

        if (existeCodigo) {
            const error = new Error('Ya existe un sistema con ese código');
            return res.status(400).json({ msg: error.message })
        }
    }

    sistema.codigo = req.body.codigo || sistema.codigo;
    sistema.descripcion = req.body.descripcion || sistema.descripcion;
    sistema.orden = req.body.orden || sistema.orden;
    sistema.usuarioModificacion = req.usuario.username;
    sistema.fechaModificacion = Date.now();

    try {

        const sistemaAlmacenado = await sistema.save();
        res.json({
            _id: sistemaAlmacenado._id,
            codigo: sistemaAlmacenado.codigo,
            descripcion: sistemaAlmacenado.descripcion,
            orden: sistemaAlmacenado.orden
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }

};

const eliminarSistema = async (req, res) => {

    const { id } = req.params;

    const sistema = await Sistema.findById(id).where('activo').equals(true);
    
    if (!sistema) {
        const error = new Error('No existe el sistema');
        return res.status(404).json({ msg: error.message });
    }

    sistema.activo = false;
    sistema.usuarioBaja = req.usuario.username;
    sistema.fechaBaja = Date.now();

    try {

        await sistema.save();
        res.json({ msg: 'Sistema eliminado' });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }

};


export {
    obtenerSistemas,
    nuevoSistema,
    obtenerSistema,
    editarSistema,
    eliminarSistema,
}