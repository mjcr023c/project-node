const hbs = require('hbs');
const funciones = require('./funciones');

hbs.registerHelper('obtenerPromedio', (nota1, nota2, nota3) => {
    return (nota1 + nota2 + nota3) / 3;
});

hbs.registerHelper('crear', (documentoIdentidad, nombre, correo, telefono) => {
    usuario = {
        documentoIdentidad: documentoIdentidad,
        nombre: nombre,
        correo: correo,
        telefono: telefono
    }
    return funciones.crear(usuario);
});

hbs.registerHelper('buscarUsuario', (documentoIdentidad) => {
    return funciones.buscarUsuario(documentoIdentidad);
});

hbs.registerHelper('crearCurso', (curso, id, modalidad, descripcion, valor, intensidad) => {
    curso = {
        nombre: curso,
        id: id,
        modalidad: modalidad,
        descripcion: descripcion,
        valor: valor,
        intensidad: intensidad,
        estado: 'disponible'
    }

    return funciones.crearCurso(curso);

});

hbs.registerHelper('listarCurso', () => {
    return funciones.listarCurso();
});

hbs.registerHelper('crearInscripcion', (documento, correo, nombre, curso) => {
    insCurso = {
        documento: documento,
        correo: correo,
        nombre: nombre,
        curso: curso,
        idCurso: documento + curso
    }

    return funciones.crearInscripcion(insCurso);
});