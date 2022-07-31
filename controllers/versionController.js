import { validationResult } from 'express-validator';

import Version from '../models/Version.js';
import Sistema from '../models/Sistema.js';
import Ambiente from '../models/Ambiente.js';
import Tipo from '../models/Tipo.js';


const listarVersionesAgrupadas = async (req, res) => {

    const sistemas = await Sistema.find();
    const tipos = await Tipo.find();
    const ambientes = await Ambiente.find();

    const versiones = await Version.aggregate([
        // obtengo información de otras colecciones
        {$lookup: {
            from: 'sistemas',
            localField: 'sistema',
            foreignField: '_id',
            as: 'sistema'
        }},
        {$lookup: {
            from: 'tipos',
            localField: 'tipo',
            foreignField: '_id',
            as: 'tipo'
        }},
        {$lookup: {
            from: 'ambientes',
            localField: 'ambiente',
            foreignField: '_id',
            as: 'ambiente'
        }},
        // ordeno por ambiente y luego por número
        {$sort: { 'ambiente.orden': 1,'numero': -1 }},
        // primera agrupación por sistema, tipo y ambiente
        {$group: {
            _id: {
                sistema: {
                    _id: { $first: '$sistema._id' },
                    codigo: { $first: '$sistema.codigo' }
                },
                tipo: {
                    _id: { $first: '$tipo._id' },
                    codigo: { $first: '$tipo.codigo' }
                },
                ambiente: {
                    _id: { $first: '$ambiente._id' },
                    codigo: { $first: '$ambiente.codigo' }
                },
            },
            versiones: {
                $push: {
                    numero: '$numero',
                    descripcion: '$descripcion',
                    fechaSubida: '$fechaSubida',
                }
            },
        }},
        // segunda agrupación, anidada de la primera
        {$group: {
            _id: { sistema:'$_id.sistema', tipo: '$_id.tipo' },
            sistema: { $first: '$_id.sistema' },
            tipo: { $first: '$_id.tipo' },
            ambientes: {
                // 	Agrego valores extras al arreglo de resultados del documento
                $push: {
                    ambiente: '$_id.ambiente',
                    versiones: '$versiones'
                }
            },         
        }},
        // tercera agrupación, anidada de la segunda
        {$group: {
            _id: { sistema:'$_id.sistema' },
            sistema: { $first: '$_id.sistema' },
            tipos: {
                $push: {
                    tipo: '$_id.tipo',
                    ambientes: '$ambientes'
                }
            },         
        }},
        // selecciono los datos de la agregación que necesito
        {$project: { _id:0, sistema:1, tipos:1 }},
    ]);

    res.json(versiones);
};


const obtenerVersiones = async (req, res) => {

    const versiones = await Version.find()
        .populate('sistema', 'codigo descripcion')
        .populate('ambiente', 'codigo descripcion')
        .populate('tipo', 'codigo descripcion')
        .where('activo').equals(true)
        .select('-activo -fechaAlta -fechaBaja -fechaModificacion -usuarioAlta -usuarioModificacion -usuarioBaja -__v');

    res.json(versiones);
};

const nuevaVersion = async (req, res) => {

    // validaciones check
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { numero, sistema, ambiente, tipo } = req.body;

    // verifica que exista el sistema
    const existeSistema = await Sistema.findById(sistema).where('activo').equals(true);
    if (!existeSistema) {
        const error = new Error('No existe el sistema');
        return res.status(404).json({ msg: error.message })
    }

    // verifica que exista el ambiente
    const existeAmbiente = await Ambiente.findById(ambiente).where('activo').equals(true);
    if (!existeAmbiente) {
        const error = new Error('No existe el ambiente');
        return res.status(404).json({ msg: error.message })
    }

    // verifica que exista el tipo
    const existeTipo = await Tipo.findById(tipo).where('activo').equals(true);
    if (!existeTipo) {
        const error = new Error('No existe el tipo');
        return res.status(404).json({ msg: error.message })
    }

    // verifica que no exista ese numero de version para ese sistema, ese ambiente y ese tipo
    const existeNumero = await Version.findOne({ numero, sistema, ambiente, tipo }).where('activo').equals(true);

    if (existeNumero) {
        const error = new Error('Ya existe la versión');
        return res.status(400).json({ msg: error.message })
    }
    
    const version = new Version(req.body);
    version.usuarioAlta = req.usuario.username;
    version.fechaAlta = Date.now();

    try {

        const versionAlmacenada = await version.save();

        res.json({
            _id: versionAlmacenada._id,
            numero: versionAlmacenada.numero,
            descripcion: versionAlmacenada.descripcion,
            fechaSubida: versionAlmacenada.fechaSubida,
            sistema: versionAlmacenada.sistema,
            ambiente: versionAlmacenada.ambiente,
            tipo: versionAlmacenada.tipo
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
};

const obtenerVersion = async (req, res) => {

    const { id } = req.params;

    const version = await Version.findById(id)
        .populate('sistema', 'codigo descripcion')
        .populate('ambiente', 'codigo descripcion')
        .populate('tipo', 'codigo descripcion')
        .where('activo').equals(true)
        .select('-activo -fechaAlta -fechaBaja -fechaModificacion -usuarioAlta -usuarioModificacion -usuarioBaja -__v');

    if (!version) {
        const error = new Error('No existe la version');
        return res.status(404).json({ msg: error.message });
    }

    res.json(version);
};

const editarVersion = async (req, res) => {

    const { id } = req.params;
    const { numero, sistema, ambiente, tipo } = req.body;

    // verifica que no se traiga un documeto no activo
    const version = await Version.findById(id).where('activo').equals(true);
    
    if (!version) {
        const error = new Error('No existe la version');
        return res.status(404).json({ msg: error.message });
    }
    
    // verifica que no exista ese numero de version para ese sistema, ese ambiente y ese tipo
    const existeNumero = await Version.findOne({ numero, sistema, ambiente, tipo }).where('activo').equals(true);
    if (existeNumero) {
        const error = new Error('Ya existe la versión');
        return res.status(400).json({ msg: error.message })
    }

    version.numero = req.body.numero || version.codigo;
    version.descripcion = req.body.descripcion || version.descripcion;
    version.fechaSubida = req.body.fechaSubida || version.fechaSubida;
    version.sistema = req.body.sistema || version.sistema;
    version.ambiente = req.body.ambiente || version.ambiente;
    version.tipo = req.body.tipo || version.tipo;
    version.usuarioModificacion = req.usuario.username;
    version.fechaModificacion = Date.now();

    try {

        const versionAlmacenada = await version.save();

        const versionEditada = await Version.findById(versionAlmacenada._id)
            .populate('sistema', 'codigo descripcion')
            .populate('ambiente', 'codigo descripcion')
            .populate('tipo', 'codigo descripcion')
            .where('activo').equals(true)
            .select('-activo -fechaAlta -fechaBaja -fechaModificacion -usuarioAlta -usuarioModificacion -usuarioBaja -__v');

        res.json(versionEditada);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
};

const eliminarVersion = async (req, res) => {

    const { id } = req.params;

    const version = await Version.findById(id).where('activo').equals(true);
    
    if (!version) {
        const error = new Error('No existe la version');
        return res.status(404).json({ msg: error.message });
    }

    version.activo = false;
    version.usuarioBaja = req.usuario.username;
    version.fechaBaja = Date.now();

    try {

        await version.save();
        res.json({ msg: 'Version eliminada' });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
};


export {
    obtenerVersiones,
    nuevaVersion,
    obtenerVersion,
    editarVersion,
    eliminarVersion,
    listarVersionesAgrupadas
}