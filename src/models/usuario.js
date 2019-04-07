const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const usuarioSchema = new Schema({
    documentoIdentidad: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    nombre: {
        type: String,
        trim: true
    },
    correo: {
        type: String,
        trim: true
    },
    telefono: {
        type: String
    },
    rol: {
        type: String,
        trim: true,
        default: 'aspirante',
        enum: { values: ['aspirante', 'coordinador'] }
    }
});

usuarioSchema.plugin(uniqueValidator);

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;