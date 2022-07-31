import { validationResult } from 'express-validator';

import Tipo from '../models/Tipo.js';


const obtenerTipos = async (req, res) => {

    const tipos = await Tipo.find()
        .where('activo').equals(true)
        .select('-activo -fechaAlta -fechaBaja -fechaModificacion -usuarioAlta -usuarioModificacion -usuarioBaja -__v');

    res.json(tipos);
};

const nuevoTipo = async (req, res) => {

    // validaciones check
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    // validar no repetir objeto
    const { codigo } = req.body;
    const existeCodigo = await Tipo.findOne({ codigo }).where('activo').equals(true);

    if (existeCodigo) {
        const error = new Error('Ya existe un tipo con ese código');
        return res.status(400).json({ msg: error.message });
    }
    
    const tipo = new Tipo(req.body);
    tipo.usuarioAlta = req.usuario.username;
    tipo.fechaAlta = Date.now();

    try {

        const tipoAlmacenado = await tipo.save();

        res.json({
            _id: tipoAlmacenado._id,
            codigo: tipoAlmacenado.codigo,
            descripcion: tipoAlmacenado.descripcion
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
};

const obtenerTipo = async (req, res) => {

    const { id } = req.params;

    const tipo = await Tipo.findById(id).where('activo').equals(true);

    if (!tipo) {
        const error = new Error('No existe el tipo');
        return res.status(404).json({ msg: error.message });
    }

    res.json({
        _id: tipo._id,
        codigo: tipo.codigo,
        descripcion: tipo.descripcion
    });
};

const editarTipo = async (req, res) => {

    const { id } = req.params;
    const { codigo } = req.body;

    // verifica que no se traiga un documeto no activo
    const tipo = await Tipo.findById(id).where('activo').equals(true);
    
    if (!tipo) {
        const error = new Error('No existe el tipo');
        return res.status(404).json({ msg: error.message });
    }
    
    // verifica que no se repita el codigo
    if (req.body.codigo) {
        const existeCodigo = await Tipo.findOne({ codigo })
            .where('activo').equals(true)
            .where({"_id": {"$ne":id}})

        if (existeCodigo) {
            const error = new Error('Ya existe un tipo con ese código');
            return res.status(400).json({ msg: error.message })
        }
    }

    tipo.codigo = req.body.codigo || tipo.codigo;
    tipo.descripcion = req.body.descripcion || tipo.descripcion;
    tipo.usuarioModificacion = req.usuario.username;
    tipo.fechaModificacion = Date.now();

    try {

        const tipoAlmacenado = await tipo.save();

        res.json({
            _id: tipoAlmacenado._id,
            codigo: tipoAlmacenado.codigo,
            descripcion: tipoAlmacenado.descripcion
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
};

const eliminarTipo = async (req, res) => {

    const { id } = req.params;

    const tipo = await Tipo.findById(id).where('activo').equals(true);
    
    if (!tipo) {
        const error = new Error('No existe el tipo');
        return res.status(404).json({ msg: error.message });
    }

    tipo.activo = false;
    tipo.usuarioBaja = req.usuario.username;
    tipo.fechaBaja = Date.now();

    try {

        await tipo.save();
        res.json({ msg: 'Tipo eliminado' });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
};


export {
    obtenerTipos,
    nuevoTipo,
    obtenerTipo,
    editarTipo,
    eliminarTipo,
}