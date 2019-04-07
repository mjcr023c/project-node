const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const funciones = require('../utils/funciones');
const constantes = require('../utils/constants');
const Usuario = require('./../models/usuario');

const dirViews = path.join(__dirname, '../../templates/views');
const dirPartials = path.join(__dirname, '../../templates/partials');

console.log(dirViews);

require('./../helpers/helpers');
require('./../helpers/usuariosHelpers');


global.usuario = undefined;


//hbs
app.set('view engine', 'hbs');
app.set('views', dirViews);
hbs.registerPartials(dirPartials);


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/formulario', (req, res) => {
    res.render('formulario');
});
app.post('/formulario', (req, res) => {
    let usuario = new Usuario({
        documentoIdentidad: req.body.documentoIdentidad,
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: req.body.telefono
    });
    usuario.save((err, resultado) => {
        if (err) {
            res.render('formulariopost', {
                respuesta: 'No se guardo el usuario ' + err
            });
        }
        res.render('formulariopost', {
            respuesta: ' exitoso '
        });
    });

});

app.get('/verUsuarios', (req, res) => {
    // Usuario.find({ nombre: 'Josimar C' }).exec((err, respuesta) => {
    Usuario.find({}).exec((err, respuesta) => {
        if (err) {
            return console.log(err);
        }
        res.render('verUsuarios', { listado: respuesta });
    });
});

app.get('/actualizarUsuario', (req, res) => {
    res.render('actualizarUsuario');
});
app.post('/actualizarUsuario', (req, res) => {
    Usuario.findOneAndUpdate({ documentoIdentidad: req.body.documentoIdentidad }, req.body, { new: true, runValidators: true, context: 'query' },
        (err, respuesta) => {
            if (err) {
                return console.log(err);
            }
            console.log(respuesta);
            res.render('verUsuarios', { listado: [respuesta] });
        });
});

app.post('/eliminarUsuario', (req, res) => {
    Usuario.findOneAndDelete({ documentoIdentidad: req.body.documentoIdentidad }, req.body,
        (err, respuesta) => {
            if (err) {
                return console.log(err);
            }
            res.render('usuarioEliminado', { eliminado: respuesta.nombre });
        });
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
    if (usuario != undefined && usuario.rol == 'coordinador') {
        let usuarios = funciones.listarUsuarios();
        console.log(usuarios);
        res.render('modificarUsuario', {
            usuario: usuario,
            usuarios: usuarios
        });
    } else {
        res.render('home', { usuario: usuario });
    }
});

app.post('/buscarUsuario', (req, res) => {
    let usuarios = funciones.listarUsuarios();
    let usuarioModificar = funciones.buscarUsuario(req.body.documentoIdentidad);
    res.render('modificarUsuario', {
        usuario: usuario,
        usuarioParaModificar: usuarioModificar,
        usuarios: usuarios
    });
});

app.post('/modificarUsuario', (req, res) => {
    let usuarios = funciones.listarUsuarios();
    let usuarioModificar = funciones.actualizar(req.body.documentoIdentidad, req.body.nombre, req.body.correo, req.body.telefono, req.body.rol);
    res.render('modificarUsuario', {
        usuario: usuario,
        usuarioParaModificar: usuarioModificar,
        usuarios: usuarios
    });
});

app.post('/calculos', (req, res) => {
    console.log(req.body);
    console.log(cursos);
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
    let cursos = funciones.listarCursos();

    res.render('inscribir', {
        cursos: cursos,
        usuario: usuario
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
    let cursos = funciones.listarCursos();
    let inscritos = funciones.listarAlumnos();
    console.log(cursos);
    res.render('verInscritos', {
        usuario: usuario,
        cursos: cursos,
        inscritos: inscritos
    });
});

app.post('/mensaje', (req, res) => {
    res.render('mensaje', {
        usuario: usuario,
        curso: req.body.nombre,
        id: parseInt(req.body.id),
        modalidad: req.body.modalidad,
        descripcion: req.body.descripcion,
        valor: req.body.valor,
        intensidad: req.body.intensidad
    });
});

app.post('/mensajeInscribir', (req, res) => {
    res.render('mensajeInscribir', {
        usuario: usuario,
        documento: req.body.documento,
        correo: req.body.correo,
        nombre: req.body.nombre,
        curso: req.body.cursoDisponible
    });
});

app.get('/misCursos', (req, res) => {
    if (usuario == undefined) {
        res.render('home', { usuario: usuario });
    } else {
        let cursos = funciones.buscarMisCursos(usuario.documentoIdentidad);
        console.log(cursos);
        res.render('misCursos', {
            usuario: usuario,
            cursos: cursos

        });
    }
});

app.get('*', (req, res) => {
    res.render('error');
})

module.exports = app