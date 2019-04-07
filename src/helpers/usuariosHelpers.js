const hbs = require('hbs');
const funciones = require('../utils/funciones');

hbs.registerHelper('mostrar', (listado) => {
    let texto = `<form action='/eliminarUsuario' method='post'>
                 <table class='table table-striped table-hover'>
                    <thead>
                    <tr>
                        <th>Documento de identidad</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Telefono</th>
                        <th>Rol</th>
                        <th>Accion</th>
                    </tr>
                    </thead>
                    <tbody>`;
    listado.forEach(usuario => {
        texto = texto +
            `<tr>
        <td>${usuario.documentoIdentidad}</td>
        <td>${usuario.nombre}</td>
        <td>${usuario.correo}</td>
        <td>${usuario.telefono}</td>
        <td>${usuario.rol}</td>
        <td> <button class="btn btn-danger" name="documentoIdentidad" value="${usuario.documentoIdentidad}" type="submit">eliminar</button></td>
        </tr>`
    })
    texto = texto + `</tbody></table></form>`
    return texto;
});