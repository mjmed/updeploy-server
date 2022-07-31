import mongoose from 'mongoose';

const TiposSchema = mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
    },
    descripcion: {
        type: String,
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

const Tipo = mongoose.model('Tipo', TiposSchema);

export default Tipo;