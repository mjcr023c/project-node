const Properties = require('./../models/properties');
process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB
if (process.env.NODE_ENV === 'local') {
    urlDB = 'mongodb://localhost:27017/proyecto-node-js';
} else {
    urlDB = 'mongodb+srv://user-project-node-js-2019:kfropQqWzk3D0VXm@proyecto-node-js-e6i3t.mongodb.net/test?retryWrites=true'
}

Properties.findOne({ nombre: 'api-key-correo' },
    (err, propiedad) => {
        if (err) {
            process.env.SENDGRID_API_KEY = '';

        }
        if (propiedad) {
            process.env.SENDGRID_API_KEY = propiedad.valor;
        } else {
            process.env.SENDGRID_API_KEY = '';
        }

    });


Properties.findOne({ nombre: 'api-key-correo-usuario' },
    (err, propiedad) => {

        if (err) {
            process.env.SENDGRID_API_KEY_CORREO = '';
        }
        if (propiedad) {

            process.env.SENDGRID_API_KEY_CORREO = propiedad.valor;
        } else {
            process.env.SENDGRID_API_KEY_CORREO = '';
        }

    });
process.env.URLDB = urlDB;