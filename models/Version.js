import mongoose from 'mongoose';

const VersionesSchema = mongoose.Schema({
    numero: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    fechaSubida: {
        type: Date,
        required: true,
        default: Date.now()
    },
    sistema: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sistema',
        required: true
    },
    ambiente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ambiente',
        required: true
    },
    tipo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tipo',
        required: true
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

const Version = mongoose.model('Version', VersionesSchema);

export default Version;