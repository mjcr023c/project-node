const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


const Schema = mongoose.Schema;
const InscritosSchema = new Schema({

    documento: {
        type: String,
        required: true
    },

    correo: {
        type: String,
        required: true
    },

    nombre: {
        type: String,
        required: true
    },

    curso: {
        type: String,
        required: true,
        unique: true
    }

});

mongoose.set('useCreateIndex', true);

InscritosSchema.plugin(uniqueValidator);

const inscribir = mongoose.model('Inscripcion', InscritosSchema);

module.exports = inscribir;