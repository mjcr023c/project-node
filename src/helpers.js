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