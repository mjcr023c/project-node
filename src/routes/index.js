const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcrypt');
const funciones = require('../utils/funciones');
const constantes = require('../utils/constants');
const Usuario = require('./../models/usuario');
/*
const session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));*/

const dirViews = path.join(__dirname, '../../templates/views');
const dirPartials = path.join(__dirname, '../../templates/partials');




require('./../helpers/helpers');
require('./../helpers/usuariosHelpers');


//global.usuario = undefined;


//hbs
app.set('view engine', 'hbs');
app.set('views', dirViews);
hbs.registerPartials(dirPartials);


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/registroUsuario', (req, res) => {
    res.render('formRegistroUsuario');
});
app.post('/registroUsuario', (req, res) => {
    let usuario = new Usuario({
        documentoIdentidad: req.body.documentoIdentidad,
        password: bcrypt.hashSync(req.body.password, 10),
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: req.body.telefono
    });
    usuario.save((err, resultado) => {
        if (err) {
            res.render('respRegistroUsuario', {
                respuesta: 'No se guardo el usuario ' + err
            });
        }
        res.render('respRegistroUsuario', {
            respuesta: ' exitoso '
        });
    });

});

app.get('/verUsuarios', (req, res) => {
    // Usuario.find({ nombre: 'Josimar C' }).exec((err, respuesta) => {

    if (req.session.usuario) {
        console.log(req.session.rol);
        Usuario.find({}).exec((err, respuesta) => {
            if (err) {
                return console.log(err);
            }
            res.render('verUsuarios', {
                listado: respuesta,
                usuario: req.session.usuario,
                sesion: true,
                nombre: req.session.nombre,
                rol: req.session.rol
            });
        });
    } else {
        res.render('index');
    }
});

app.post('/formActualizarUsuario', (req, res) => {
    if (req.session.usuario) {
        Usuario.findOne({ documentoIdentidad: req.body.documentoIdentidad },
            (err, usuario) => {
                if (err) {
                    return res.render('error');
                }
                if (usuario) {
                    return res.render('formActualizarUsuario', {
                        usuarioMod: usuario,
                        usuario: req.session.usuario,
                        sesion: true,
                        nombre: req.session.nombre,
                        rol: req.session.rol
                    });
                } else {
                    return res.render('error');
                }

            });
    } else {
        res.render('index');
    }

});
app.post('/actualizarUsuario', (req, res) => {
    if (req.session.usuario) {
        Usuario.findOneAndUpdate({ documentoIdentidad: req.body.documentoIdentidad }, req.body, { new: true, runValidators: true, context: 'query' },
            (err, respuesta) => {
                if (err) {
                    return console.log(err);
                }
                console.log(respuesta);
                res.render('verUsuarios', {
                    listado: [respuesta],
                    usuario: req.session.usuario,
                    sesion: true,
                    nombre: req.session.nombre,
                    rol: req.session.rol
                });
            });
    } else {
        res.render('index');
    }
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

app.post('/ingresar', (req, res) => {
    Usuario.findOne({ documentoIdentidad: req.body.username },
        (err, usuario) => {
            if (err) {
                return console.log(err);
            }
            if (!usuario) {
                return res.render('index', {
                    tipoMensaje: constantes.alertas.danger,
                    mensaje: constantes.mensajes.usuarioNoExiste
                });
            }
            if (!bcrypt.compareSync(req.body.password, usuario.password)) {
                return res.render('index', {
                    tipoMensaje: constantes.alertas.danger,
                    mensaje: constantes.mensajes.contrasenaInvalida
                });
            }
            req.session.usuario = usuario._id;
            req.session.nombre = usuario.nombre;
            req.session.rol = usuario.rol;
            res.render('home', {
                usuario: usuario,
                sesion: true,
                nombre: req.session.nombre,
                rol: req.session.rol
            });
        });
});

/*
app.get('/registrarse', (req, res) => {
    res.render('registrarse');
});
*/

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
/*
app.post('/registro', (req, res) => {
    res.render('registro', {
        documentoIdentidad: req.body.documentoIdentidad,
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: req.body.telefono
    });
});
*/
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