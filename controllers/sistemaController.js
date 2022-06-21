
import Sistema from '../models/Sistema.js';
import { validationResult } from 'express-validator';


const obtenerSistemas = async (req, res) => {

};

const nuevoSistema = async (req, res) => {

    // validaciones
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
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