const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


const Schema = mongoose.Schema;
const propertiesSchema = new Schema({

    nombre: {
        type: String,
        required: true
    },

    valor: {
        type: String,
        required: true
    }

});

mongoose.set('useCreateIndex', true);

propertiesSchema.plugin(uniqueValidator);

const Properties = mongoose.model('Properties', propertiesSchema);

module.exports = Properties;