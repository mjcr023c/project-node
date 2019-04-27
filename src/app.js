require('./config/config');
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

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
    cookie: { maxAge: 86400000 },
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))


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

/*
mongoose.connect('mongodb://localhost:27017/proyecto-node-js', { useNewUrlParser: true },
    (err, resultado) => {
        if (err) {
            return console.log("No se conecto");
        }
        console.log("Conectados");
    });
*/
//kfropQqWzk3D0VXm
//user-project-node-js-2019

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, resultado) => {
    if (err) {
        return console.log(error)
    }
    console.log("conectado")
});

/*
app.listen(process.env.PORT, () => {
    console.log('Escuchando por el puerto ' + process.env.PORT);
});
*/
var contador = 0;
io.on('connection', client => {

    client.on("contador", (signo) => {
        if (signo == '+') {
            contador++;
        } else if (signo == '-') {
            contador--;
        }
        if (contador < 0) {
            contador = 0;
        }

        io.emit("contador", contador);
    });

    client.on("mensaje", (informacion) => {
        //console.log(informacion)
    })

    client.on('usuarioNuevo', (usuario) => {
        let texto = 'Se ha conectado un nuevo usuario'

        io.emit('nuevoUsuario', texto)
    })

    client.on('disconnect', () => {
        let texto = 'Se ha desconectado ';
        io.emit('usuarioDesconectado', texto)
    })

    client.on("texto", (text, callback) => {
        // console.log(text)
        io.emit("texto", (text))
        callback()
    })


});

server.listen(process.env.PORT, (err) => {
    console.log('Servidor en el puerto ' + process.env.PORT);
});