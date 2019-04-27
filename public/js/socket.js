function zfill(number, width) {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */
    var zero = "0"; /* String de cero */

    if (width <= length) {
        if (number < 0) {
            return ("-" + numberOutput.toString());
        } else {
            return numberOutput.toString();
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
        } else {
            return ((zero.repeat(width - length)) + numberOutput.toString());
        }
    }
}

const usuariosConectados = document.querySelector('#usuariosConectados');
//const chat = document.querySelector('#chat')
socket = io();
/*socket.on("mensaje", (informacion) => {
    console.log(informacion);
})*/

socket.emit("contador", "Me conecte");

//socket.emit("contador");


if (document.querySelector('#formLogin') !== null) {
    document.querySelector('#formLogin').addEventListener('submit', () => {
        socket.emit("contador", '+');
    });
}
if (document.querySelector('#formLogout') !== null) {
    document.querySelector('#formLogout').addEventListener('submit', () => {
        socket.emit("contador", '-');
    });
}

socket.on("contador", (contador) => {
    if (contador <= 0) {
        usuariosConectados.innerHTML = '';
    } else {
        usuariosConectados.innerHTML = zfill(contador, 10) + '<div class="icon icon-danger"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users align-middle"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>';
    }
    //chat.innerHTML = chat.innerHTML + text.nombreChat + ':' + text.mensaje + '<br>'
    console.log(contador);
});