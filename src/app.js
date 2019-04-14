require('./config/config');
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const hbs = require('hbs');
const bodyParser = require('body-parser');

//Path
const dirPublic = path.join(__dirname, '../public');
const dirNode_modules = path.join(__dirname, '../node_modules')

app.use(express.static(dirPublic));

//Bootstrap
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

const session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use((req, res, next) => {
    if (req.session.usuario) {
        res.locals.sesion = true;
        res.locals.nombre = req.session.nombre;
        res.locals.rol = req.session.rol;
    }
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));

//Routes
app.use(require('./routes/index'));


mongoose.connect('mongodb://localhost:27017/proyecto-node-js', { useNewUrlParser: true },
    (err, resultado) => {
        if (err) {
            return console.log("No se conecto");
        }
        console.log("Conectados");
    });


app.listen(process.env.PORT, () => {
    console.log('Escuchando por el puerto ' + process.env.PORT);
});