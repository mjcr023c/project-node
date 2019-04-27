const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const contactoSchema = new Schema({
    nombre: {
        type: String,
        trim: true
    },
    correo: {
        type: String,
        required: true,
        trim: true
    },
    mensaje: {
        type: String,
        trim: true
    },
});

//contactoSchema.plugin(uniqueValidator);

const Contacto = mongoose.model('Contacto', contactoSchema);

module.exports = Contacto;