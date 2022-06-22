import mongoose from 'mongoose';

const SistemasSchema = mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    activo: {
        type: Boolean,
        default: true
    },
    usuarioAlta: {
        type: String,
        trim: true
    },
    fechaAlta: {
        type: Date
    },
    usuarioModificacion: {
        type: String,
        trim: true,
        default: null
    },
    fechaModificacion: {
        type: Date,
        default: null
    },
    usuarioBaja: {
        type: String,
        trim: true,
        default: null
    },
    fechaBaja: {
        type: Date,
        default: null
    },
});

const Sistema = mongoose.model('Sistema', SistemasSchema);

export default Sistema;