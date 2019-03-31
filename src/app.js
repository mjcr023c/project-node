const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const funciones = require('./funciones');
const constantes = require('./constants');

global.usuario = undefined;

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
    res.render('index');
});

app.get('/registrarse', (req, res) => {
    res.render('registrarse');
});


app.post('/login', (req, res) => {
    usuario = funciones.buscarUsuario(req.body.username);
    if (usuario != undefined) {
        res.render('home', { usuario: usuario });
    } else {
        res.render('index', {
            tipoMensaje: constantes.alertas.danger,
            mensaje: constantes.mensajes.usuarioNoExiste
        });
    }
});

app.get('/logout', (req, res) => {
    usuario = undefined;
    res.render('index', {
        tipoMensaje: constantes.alertas.success,
        mensaje: constantes.mensajes.logoutSuccess
    });
});


app.get('/modificarUsuario', (req, res) => {
    console.log(usuario);
    if (usuario.rol == 'coordinador') {
        res.render('modificarUsuario', { usuario: usuario });
    } else {
        res.render('home', { usuario: usuario });
    }
});

app.get('/verInscritos', (req, res) => {
    res.render('verInscritos', { usuario: usuario });
});

app.post('/modificarUsuario', (req, res) => {
    usuarioModificar = funciones.buscarUsuario(req.body.documentoIdentidad);
    res.render('modificarUsuario', {
        usuario: usuario,
        usuarioParaModificar: usuarioModificar
    });
});

app.post('/calculos', (req, res) => {
    console.log(req.body);
    res.render('calculos', {
        estudiante: req.query.nombre,
        nota1: parseInt(req.body.nota1),
        nota2: parseInt(req.body.nota2),
        nota3: parseInt(req.body.nota3)
    });
});

app.post('/registro', (req, res) => {
    res.render('registro', {
        documentoIdentidad: req.body.documentoIdentidad,
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: req.body.telefono
    });
});

app.get('/crearCurso', (req, res) => {
    res.render('crearCurso', {
        usuario: usuario
    });
});

app.get('/inscribir', (req, res) => {
    res.render('inscribir', {

    });
});

app.get('/verCursos', (req, res) => {
    let cursos = funciones.listarCursos();
    console.log(cursos);
    res.render('verCursos', {
        usuario: usuario,
        cursos: cursos
    });
});


app.get('/verInscritos', (req, res) => {
    res.render('verInscritos', {

    });
});

app.post('/mensaje', (req, res) => {
    res.render('mensaje', {
        curso: req.body.nombre,
        id: parseInt(req.body.id),
        modalidad: req.body.modalidad,
        descripcion: req.body.descripcion,
        valor: parseInt(req.body.valor),
        intensidad: parseInt(req.body.intensidad)
    });
});


app.get('*', (req, res) => {
    res.render('error');
})

app.listen(port, () => {
    console.log('Escuchando por el puerto ' + port);
});