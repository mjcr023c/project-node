const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcrypt');
const funciones = require('../utils/funciones');
const constantes = require('../utils/constants');
const Usuario = require('./../models/usuario');
const Contacto = require('./../models/contacto');
const Curso = require('./../models/cursos');
const Inscripcion = require('./../models/inscripcion');
const multer = require('multer');


/*const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'public/uploads')
        },
        filename: function(req, file, cb) {
            cb(null, req.body.documentoIdentidad + path.extname(file.originalname))
        }
    })
const upload = multer({ storage: storage });*/
const upload = multer({
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png)$/)) {
            return cb(new Error('No es un archivo valido!'))
        }
        cb(null, true);
    }
});
const sgMail = require('@sendgrid/mail');
/*console.log('12_:' + process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
*/
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

app.get('/chat', (req, res) => {
    if (req.session.usuario) {
        res.render('chat', {
            usuario: req.session.usuario,
            sesion: true,
            nombre: req.session.nombre,
            rol: req.session.rol
        });
    } else {
        res.render('index');
    }
});

app.post('/salaChat', (req, res) => {
    res.render('salaChat');
});

app.get('/', (req, res) => {
    if (req.session.usuario) {
        res.render('home', {
            usuario: req.session.usuario,
            sesion: true,
            nombre: req.session.nombre,
            rol: req.session.rol
        });
    } else {
        res.render('index');
    }
});
app.get('/contactanos', (req, res) => {
    res.render('formContactanos');
});

app.post('/enviaMensajeCreador', (req, res) => {
    let contacto = new Contacto({
        nombre: req.body.nombre,
        correo: req.body.correo,
        mensaje: req.body.mensaje
    });
    contacto.save((err, resultado) => {
        if (err) {
            res.render('respContacto', {
                respuesta: 'No se envio el mensaje' + err
            });
        }
        let msg = {
            to: req.body.correo,
            from: process.env.SENDGRID_API_KEY_CORREO,
            subject: 'Gracias por Contactarnos',
            text: 'Pronto lo contactaremos'
        };
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        sgMail.send(msg).catch((error) => {
            // console.log(error);
        });
        res.render('respContacto', {
            respuesta: ' exitoso '
        });
    });
});


app.get('/registroUsuario', (req, res) => {
    res.render('formRegistroUsuario');
});

app.post('/registroUsuario', upload.single('archivo'), (req, res) => {
    let usuario = new Usuario({
        documentoIdentidad: req.body.documentoIdentidad,
        password: bcrypt.hashSync(req.body.password, 10),
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: req.body.telefono,
        avatar: req.file.buffer
    });
    usuario.save((err, resultado) => {
        if (err) {
            res.render('respRegistroUsuario', {
                respuesta: 'No se guardo el usuario ' + err
            });
        }
        let msg = {
            to: req.body.correo,
            from: process.env.SENDGRID_API_KEY_CORREO,
            subject: 'Bienvenid@',
            text: 'Bienvenid@ a la página Education'
        };
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        sgMail.send(msg).catch((error) => {
            //   console.log(error);
        });
        res.render('respRegistroUsuario', {
            respuesta: ' exitoso '
        });
    });

});

app.get('/verUsuarios', (req, res) => {
    if (req.session.usuario) {
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
                    return res.render('error');
                }
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
            let avatar = 'img/avatar.jpg';
            if (usuario.avatar) {
                avatar = 'data:img/png;base64,' + usuario.avatar.toString('base64');
            }
            res.render('home', {
                usuario: usuario,
                sesion: true,
                nombre: req.session.nombre,
                rol: req.session.rol,
                avatar: avatar
            });
        });
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
        //console.log(usuarios);
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
    //console.log(req.body);
    // console.log(cursos);
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
    if (req.session.usuario) {
        res.render('crearCurso', {
            usuario: req.session.usuario,
            sesion: true,
            nombre: req.session.nombre,
            rol: req.session.rol
        });
    } else {
        res.render('index');
    }
});

app.get('/inscribir', (req, res) => {
    //let cursos = funciones.listarCursos();
    if (req.session.usuario) {
        Curso.find({}).exec((err, respuesta) => {
            if (err) {
                return console.log(err)
            }
            res.render('inscribir', {
                cursos: respuesta,
                usuario: req.session.usuario,
                sesion: true,
                nombre: req.session.nombre,
                rol: req.session.rol
            })
        })
    } else {
        res.render('index');
    }
});

app.get('/verCursos', (req, res) => {
    if (req.session.usuario) {
        Curso.find({}).exec((err, respuesta) => {
            if (err) {
                return console.log(err)
            }
            res.render('verCursos', {
                cursos: respuesta,
                usuario: req.session.usuario,
                sesion: true,
                nombre: req.session.nombre,
                rol: req.session.rol
            })
        })
    } else {
        res.render('index');
    }

    /*let cursos = funciones.listarCursos();
    console.log(cursos);
    res.render('verCursos', {
        usuario: usuario,
        cursos: cursos
    });*/
});


app.get('/verInscritos', (req, res) => {
    //let cursos = funciones.listarCursos();
    let inscritos = funciones.listarAlumnos();
    Curso.find({}).exec((err, respuesta) => {
        if (err) {
            return console.log(err)
        }
        res.render('verInscritos', {
            usuario: usuario,
            cursos: respuesta,
            inscritos: inscritos
        })
    })
});

app.post('/mensaje', (req, res) => {
    if (req.session.usuario) {
        let curso = new Curso({
            nombre: req.body.nombre,
            id: parseInt(req.body.id),
            modalidad: req.body.modalidad,
            descripcion: req.body.descripcion,
            valor: req.body.valor,
            intensidad: req.body.intensidad,
            estado: 'disponible'
        })

        curso.save((err, resultado) => {
            if (err) {
                return res.render('mensaje', {
                    respuesta: 'Ocurrio un error al crear el curso ' + err,
                    usuario: req.session.usuario,
                    sesion: true,
                    nombre: req.session.nombre,
                    rol: req.session.rol
                });
            }

            if (!resultado) {
                return res.render('mensaje', {
                    respuesta: 'no se pudo crear el curso',
                    usuario: req.session.usuario,
                    sesion: true,
                    nombre: req.session.nombre,
                    rol: req.session.rol
                });

            }
            res.render('mensaje', {
                respuesta: 'Curso creado exitosamente',
                usuario: req.session.usuario,
                sesion: true,
                nombre: req.session.nombre,
                rol: req.session.rol
            });

        })
    } else {
        res.render('index');
    }

});

app.post('/mensajeInscribir', (req, res) => {
    if (req.session.usuario) {
        let inscribir = new Inscripcion({
            documento: req.body.documento,
            correo: req.body.correo,
            nombre: req.body.nombre,
            curso: req.body.cursoDisponible
        })

        inscribir.save((err, resultado) => {
            if (err) {
                return res.render('mensajeInscribir', {
                    respuesta: 'No se realizo la inscripcion ' + err,
                    usuario: req.session.usuario,
                    sesion: true,
                    nombre: req.session.nombre,
                    rol: req.session.rol
                })

            }
            res.render('mensajeInscribir', {
                respuesta: 'Se registro la inscripcion',
                usuario: req.session.usuario,
                sesion: true,
                nombre: req.session.nombre,
                rol: req.session.rol
            })

        })
    } else {
        res.render('index');
    }
});

app.get('/misCursos', (req, res) => {
    if (req.session.usuario) {
        // let cursos = funciones.buscarMisCursos(usuario.documentoIdentidad);

        Inscripcion.find({ nombre: req.session.nombre },
            (err, cursos) => {
                if (err) {
                    return console.log(err);
                }

                res.render('misCursos', {
                    cursos: cursos,
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

app.get('/verMisMensajes', (req, res) => {
    if (req.session.usuario) {
        Contacto.find({}).exec((err, respuesta) => {
            if (err) {
                return console.log(err);
            }
            res.render('verMensajes', {
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

app.get('*', (req, res) => {
    res.render('error');
})

module.exports = app