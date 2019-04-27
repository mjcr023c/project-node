socket = io()

socket.on("mensaje", (informacion) => {
    console.log(informacion)
})

socket.emit("mensaje", "Estoy conectado")

socket.emit("contador")

socket.on("contador", (contador) => {
    console.log(contador)
})

var param = new URLSearchParams(window.location.search);

var usuario = param.get(nombreChat)

socket.on("connect", () => {
    console.log(usuario)
    socket.emit('usuarioNuevo', usuario)
})

socket.on("nuevoUsuario", (texto) => {
    console.log(texto)
    chat.innerHTML = chat.innerHTML + texto + '<br>'
})

socket.on("usuarioDesconectado", (texto) => {
    console.log(texto)
    chat.innerHTML = chat.innerHTML + texto + '<br>'

})
const formulario = document.querySelector('#formulario')
const mensaje = formulario.querySelector("#texto")
const chat = document.querySelector('#chat')

formulario.addEventListener('submit', (datos) => {
    datos.preventDefault()
    const texto = datos.target.elements.texto.value
    const nombreChat = datos.target.elements.nombreChat.value
    socket.emit("texto", {
        nombreChat: nombreChat,
        mensaje: texto
    }, () => {
        mensaje.value = ''
        mensaje.focus()
    })

})

socket.on("texto", (text) => {
    console.log(text)
    chat.innerHTML = chat.innerHTML + text.nombreChat + ':' + text.mensaje + '<br>'

})