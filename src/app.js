const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./helpers');

const port = 3000;
const directoriopublico = path.join(__dirname, '../public');
const directoriopartials = path.join(__dirname, '../partials');
const dirNode_modules = path.join(__dirname, '../node_modules')

app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'hbs');

//Bootstrap
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));


app.get('/', (req, res) => {
    res.render('index', {
        estudiante: 'Josimar'
    });
});

app.get('/registrarse', (req, res) => {
    res.render('registrarse');
});

app.post('/calculos', (req, res) => {
    res.render('calculos', {
        estudiante: req.query.nombre,
        nota1: parseInt(req.body.nota1),
        nota2: parseInt(req.body.nota2),
        nota3: parseInt(req.body.nota3)
    });
});

app.get('*', (req, res) => {
    res.render('error', {
        estudiante: 'error'
    });
})

app.listen(port, () => {
    console.log('Escuchando por el puerto ' + port);
});