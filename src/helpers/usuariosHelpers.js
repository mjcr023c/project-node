const hbs = require('hbs');
const funciones = require('../utils/funciones');

hbs.registerHelper('mostrar', (listado) => {
    let texto = `
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
        <td>
            <form action='/formActualizarUsuario' method='post'> 
                <button class="btn btn-primary" name="documentoIdentidad" value="${usuario.documentoIdentidad}" type="submit">modificar</button>
            </form>
            <form action='/eliminarUsuario' method='post'>     
                <button class="btn btn-danger" name="documentoIdentidad" value="${usuario.documentoIdentidad}" type="submit">eliminar</button>
            </form>
        </td>
        </tr>`
    })
    texto = texto + `</tbody></table>`
    return texto;
});

hbs.registerHelper('mostrarMensajesContactos', (listado) => {
    let texto = `
                 <table class='table table-striped table-hover'>
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Mensajes</th>
                    </tr>
                    </thead>
                    <tbody>`;
    listado.forEach(usuario => {
        texto = texto +
            `<tr>
        <td>${usuario.nombre}</td>
        <td>${usuario.correo}</td>
        <td>${usuario.mensaje}</td>
        </tr>`
    })
    texto = texto + `</tbody></table>`
    return texto;
});