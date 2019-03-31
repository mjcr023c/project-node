const fs = require('fs');

listaUsuarios = [];
cursos = [];
inscripcion = [];

const crear = (usuario) => {
    listar();
    let user = {
        documentoIdentidad: usuario.documentoIdentidad,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        rol: 'aspirante'
    };

    let duplicado = listaUsuarios.find(nom => nom.documentoIdentidad == usuario.documentoIdentidad);
    if (!duplicado) {
        listaUsuarios.push(user);
        let mensaje = guardar();
        return 'exitoso';
    } else {
        return ' existe otro usuario con estos datos';
    }
}


const crearCurso = (curso) => {
    listarCurso();
    let creacion = {
        nombre: curso.nombre,
        idCurso: curso.id,
        modalidadCurso: curso.modalidad,
        descripcionCurso: curso.descripcion,
        valorCurso: curso.valor,
        intensidadCurso: curso.intensidad,
        estado: curso.estado
    };
    let duplicado = cursos.find(nom => nom.idCurso == creacion.idCurso)
    if (!duplicado) {
        cursos.push(creacion);
        console.log(cursos);
        guardarCurso();
    } else {
        console.log('Ya existe un curso con ese id');
    }

}

const crearInscripcion = (insCurso) => {
    listarInscritos();
    let inscribir = {
        documento: insCurso.documento,
        correo: insCurso.correo,
        nombre: insCurso.nombre,
        curso: insCurso.curso,
        idCurso: insCurso.idCurso
    };
    let duplicado = inscripcion.find(nom => nom.idCurso == inscribir.idCurso);
    if (!duplicado) {
        inscripcion.push(inscribir);
        console.log(inscripcion);
        guardarInscrito();
    } else {
        console.log('Ya se matriculo en este curso');
    }
}



const listar = () => {
    try {
        listaUsuarios = require('../listadoUsuario.json');
    } catch (error) {
        console.log('Error' + error);
        listaUsuarios = [];
    }
}


const listarInscritos = () => {
    try {
        inscripcion = require('../inscritos.json');
    } catch (error) {
        console.log('Error' + error);
        inscripcion = [];
    }
}

const listarUsuarios = () => {
    try {
        listaUsuarios = require('../listadoUsuario.json');
    } catch (error) {
        console.log('Error' + error);
        listaUsuarios = [];
    }
    return listaUsuarios;
}


const listarCurso = () => {
    try {
        cursos = require('../cursos.json');
    } catch (error) {
        console.log('Error' + error);
        cursos = [];
    }
}

const listarCursos = () => {
    try {
        cursos = require('../cursos.json');
    } catch (error) {
        console.log('Error' + error);
        cursos = [];
    }
    return cursos;
}

const obtenerInform = () => {
    try {
        cursos = require('../cursos.json');
    } catch (error) {
        console.log('Error' + error);
        cursos = [];
    }
}

const guardar = () => {
    let mensaje = '';
    let datos = JSON.stringify(listaUsuarios);
    fs.writeFile('./listadoUsuario.json', datos, (err) => {
        if (err) {
            mensaje = err;
        } else {
            mensaje = 'Información guardada con exito';
        }
    });
    return mensaje;
}

const guardarCurso = () => {
    let mensaje = '';
    let datos = JSON.stringify(cursos);
    fs.writeFile('./cursos.json', datos, (err) => {
        if (err) {
            mensaje = err;
        } else {
            mensaje = 'Información guardada con exito';
        }
    });
    return mensaje;
}

const guardarInscrito = () => {
    let mensaje = '';
    let datos = JSON.stringify(inscripcion);
    fs.writeFile('./inscritos.json', datos, (err) => {
        if (err) {
            mensaje = err;
        } else {
            mensaje = 'Información guardada con exito';
        }
    });
    return mensaje;
}

const mostrar = () => {
    listar();
    console.log('Notas de los usuarios \n ');
    listaUsuarios.forEach(usuario => {
            console.log(usuario.nombre);
            console.log('notas ');
            console.log(' matematicas ' + usuario.matematicas);
            console.log(' ingles ' + usuario.ingles);
            console.log(' programacion ' + usuario.programacion + '.\n');
        }

    );
}
const buscarUsuario = (documentoIdentidad) => {
    listar();
    let user = listaUsuarios.find(buscar => buscar.documentoIdentidad == documentoIdentidad);
    if (!user) {
        return undefined;
    } else {
        return user;
    }
}

const mostrarmat = () => {
    listar();
    let ganan = listaUsuarios.filter(mat => mat.matematicas >= 3);
    if (ganan.length == 0) {
        console.log('ningun usuario va ganando');
    } else {
        ganan.forEach(usuario => {
            console.log(usuario.nombre);
            console.log('notas ');
            console.log(' matematicas ' + usuario.matematicas);
        });
    }
}

const mostrarpromedioalto = () => {
    listar();
    let ganan = listaUsuarios.filter(mat => obtenerPromedio(mat.matematicas, mat.ingles, mat.programacion) >= 3);
    if (ganan.length == 0) {
        console.log('ningun usuario tiene un promedio alto');
    } else {
        ganan.forEach(usuario => {
            console.log(usuario.nombre);
            console.log('notas ');
            console.log(' matematicas ' + usuario.matematicas);
            console.log(' ingles ' + usuario.ingles);
            console.log(' programacion ' + usuario.programacion + '.');
            console.log(' promedio : ' + obtenerPromedio(usuario.matematicas, usuario.ingles, usuario.programacion) + '\n');

        });
    }
}

let obtenerPromedio = (nota_uno, nota_dos, nota_tres) => ((nota_uno + nota_dos + nota_tres) / 3);

const actualizar = (documentoIdentidad, nombre, correo, telefono, rol) => {
    listar();
    let encontrado = listaUsuarios.find(buscar => buscar.documentoIdentidad == documentoIdentidad);

    if (!encontrado) {
        console.log('usuario no existe');
    } else {
        encontrado['nombre'] = nombre;
        encontrado['correo'] = correo;
        encontrado['telefono'] = telefono;
        encontrado['rol'] = rol;
        guardar();
    }
}

const eliminar = (documentoIdentidad) => {
    listar();
    let usuarios = listaUsuarios.filter(user => user.documentoIdentidad != documentoIdentidad);
    if (usuarios.length == listaUsuarios.length) {
        console.log('no existe usuario con ese documento Identidad');
    } else {
        listaUsuarios = usuarios;
        guardar();
    }
}


module.exports = {
    crear,
    mostrar,
    buscarUsuario,
    mostrarmat,
    mostrarpromedioalto,
    actualizar,
    eliminar,
    crearCurso,
    listarCurso,
    listarCursos,
    crearInscripcion,
    listarUsuarios
}