import { validationResult } from 'express-validator';

import Ambiente from '../models/Ambiente.js';


const obtenerAmbientes = async (req, res) => {

    const ambientes = await Ambiente.find()
        .where('activo').equals(true)
        .select('-activo -fechaAlta -fechaBaja -fechaModificacion -usuarioAlta -usuarioModificacion -usuarioBaja -__v');

    res.json(ambientes);
};

const nuevoAmbiente = async (req, res) => {

    // validaciones check
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    // verifica que ya no exista el codigo
    const { codigo } = req.body;
    const existeCodigo = await Ambiente.findOne({ codigo }).where('activo').equals(true);

    if (existeCodigo) {
        const error = new Error('Ya existe un ambiente con ese código');
        return res.status(400).json({ msg: error.message })
    }
    
    const ambiente = new Ambiente(req.body);
    ambiente.usuarioAlta = req.usuario.username;
    ambiente.fechaAlta = Date.now();

    try {

        const ambienteAlmacenado = await ambiente.save();

        res.json({
            _id: ambienteAlmacenado._id,
            codigo: ambienteAlmacenado.codigo,
            descripcion: ambienteAlmacenado.descripcion,
            orden: ambienteAlmacenado.orden
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
};

const obtenerAmbiente = async (req, res) => {

    const { id } = req.params;

    const ambiente = await Ambiente.findById(id).where('activo').equals(true);

    if (!ambiente) {
        const error = new Error('No existe el ambiente');
        return res.status(404).json({ msg: error.message });
    }

    res.json({
        _id: ambiente._id,
        codigo: ambiente.codigo,
        descripcion: ambiente.descripcion,
        orden: ambiente.orden
    });
};

const editarAmbiente = async (req, res) => {

    const { id } = req.params;
    const { codigo } = req.body;

    // verifica que no se traiga un documeto no activo
    const ambiente = await Ambiente.findById(id).where('activo').equals(true);
    
    if (!ambiente) {
        const error = new Error('No existe el ambiente');
        return res.status(404).json({ msg: error.message });
    }
    
    // verifica que ya no exista el codigo
    if (req.body.codigo) {
        const existeCodigo = await Ambiente.findOne({ codigo })
            .where('activo').equals(true)
            .where({"_id": {"$ne":id}})

        if (existeCodigo) {
            const error = new Error('Ya existe un ambiente con ese código');
            return res.status(400).json({ msg: error.message })
        }
    }

    ambiente.codigo = req.body.codigo || ambiente.codigo;
    ambiente.descripcion = req.body.descripcion || ambiente.descripcion;
    ambiente.orden = req.body.orden || ambiente.orden;
    ambiente.usuarioModificacion = req.usuario.username;
    ambiente.fechaModificacion = Date.now();

    try {

        const ambienteAlmacenado = await ambiente.save();
        res.json({
            _id: ambienteAlmacenado._id,
            codigo: ambienteAlmacenado.codigo,
            descripcion: ambienteAlmacenado.descripcion,
            orden: ambienteAlmacenado.orden
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
};

const eliminarAmbiente = async (req, res) => {

    const { id } = req.params;

    const ambiente = await Ambiente.findById(id).where('activo').equals(true);
    
    if (!ambiente) {
        const error = new Error('No existe el ambiente');
        return res.status(404).json({ msg: error.message });
    }

    ambiente.activo = false;
    ambiente.usuarioBaja = req.usuario.username;
    ambiente.fechaBaja = Date.now();

    try {

        await ambiente.save();
        res.json({ msg: 'Ambiente eliminado' });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
};


export {
    obtenerAmbientes,
    nuevoAmbiente,
    obtenerAmbiente,
    editarAmbiente,
    eliminarAmbiente,
}