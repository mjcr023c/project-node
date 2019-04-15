const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


const Schema = mongoose.Schema;
const cursoSchema = new Schema({

    nombre: {
        type: String,
        required: true
    },

    id: {
        type: String,
        required: true
    },

    modalidad: {
        type: String,
        required: true
    },

    descripcion: {
        type: String,
        required: true
    },

    valor: {
        type: String,
        required: true
    },

    intensidad: {
        type: String,
        required: true
    },

    estado: {
        type: String,
        required: true
    }

});

mongoose.set('useCreateIndex', true);

cursoSchema.plugin(uniqueValidator);

const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;