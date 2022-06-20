import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UsuariosSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: {
        type: String,
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

UsuariosSchema.pre('save', async function(next) {

    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// comprueba el password
UsuariosSchema.methods.comprobarPassword = async function(passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password);
}

const Usuario = mongoose.model('Usuario', UsuariosSchema);

export default Usuario;