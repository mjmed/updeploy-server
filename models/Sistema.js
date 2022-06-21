import mongoose from 'mongoose';

const SistemasSchema = mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        trim: true,
        unique: true
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
        trim: true
    },
    fechaModificacion: {
        type: Date
    },
    usuarioBaja: {
        type: String,
        trim: true
    },
    fechaBaja: {
        type: Date
    },
});

const Sistema = mongoose.model('Sistema', SistemasSchema);

export default Sistema;