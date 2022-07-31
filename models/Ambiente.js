import mongoose from 'mongoose';

const AmbientesSchema = mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    orden: {
        type: Number,
        default: 0,
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

const Ambiente = mongoose.model('Ambiente', AmbientesSchema);

export default Ambiente;