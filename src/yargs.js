const nombre = {
    demand: true,
    alias: 'n'
}

const matematicas = {
    demand: true,
    alias: 'm'
}

const ingles = {
    demand: true,
    alias: 'i'
}

const programacion = {
    demand: true,
    alias: 'p'
}

const creacion = {
    nombre,
    matematicas,
    ingles,
    programacion
}

const mostrarest = {
    nombre
}

const actualiza = {
    nombre,
    asignatura: {
        demand: true,
        alias: 'a'
    },
    calificacion: {
        demand: true,
        alias: 'c'
    }
}

const elimina = {
    nombre
}

const argv = require('yargs')
    .command('crear', 'Crear un estudiante en mi BD', creacion)
    .command('mostrar', 'Mostrar estudiantes y sus notas')
    .command('mostrarest', 'Mostrar estudiante y sus notas', mostrarest)
    .command('mostrarmat', 'Mostrar estudiantes con altas notas en matematicas')
    .command('mostrarpromedioalto', 'Mostrar estudiantes con promedios altos')
    .command('actualizar', 'Actualiza un estudiante en mi BD', actualiza)
    .command('eliminar', 'Elimina un estudiante en mi BD', elimina)
    .argv


module.exports = {
    argv
}