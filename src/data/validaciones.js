export function correoValido(correo) {
  const dominios = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com']
  return dominios.some((dominio) => correo.endsWith(dominio))
}

export function claveValida(clave) {
  return clave.length >= 6
}

const MENSAJE_CORREO = 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com'
const MENSAJE_CLAVE = 'La contraseña debe tener al menos 6 caracteres'

export function validarRegistro(datos) {
  const errores = {}

  if (datos.nombre.trim() === '') {
    errores.nombre = 'Ingresa tu nombre'
  }
  if (datos.apellidos.trim() === '') {
    errores.apellidos = 'Ingresa tus apellidos'
  }
  if (!correoValido(datos.correo)) {
    errores.correo = MENSAJE_CORREO
  }
  if (!claveValida(datos.clave)) {
    errores.clave = MENSAJE_CLAVE
  }
  if (datos.repetir !== datos.clave) {
    errores.repetir = 'Las contraseñas no coinciden'
  }

  return errores
}

export function validarEnvio(datos) {
  const errores = {}

  if (datos.calle.trim() === '') {
    errores.calle = 'Ingresa la calle'
  }
  if (datos.region === '') {
    errores.region = 'Selecciona una region'
  }
  if (datos.comuna === '') {
    errores.comuna = 'Selecciona una comuna'
  }

  return errores
}

export function validarContacto(datos) {
  const errores = {}

  if (datos.nombre.trim() === '') {
    errores.nombre = 'Ingresa tu nombre'
  }
  if (!correoValido(datos.correo)) {
    errores.correo = MENSAJE_CORREO
  }
  if (datos.mensaje.trim() === '' || datos.mensaje.length > 500) {
    errores.mensaje = 'Escribe un mensaje de maximo 500 caracteres'
  }

  return errores
}

export function validarProducto(datos) {
  const errores = {}

  if (datos.nombre.trim() === '') {
    errores.nombre = 'Ingresa el nombre'
  }
  if (datos.categoriaId === '') {
    errores.categoriaId = 'Selecciona una categoria'
  }
  if (!(Number(datos.precio) > 0)) {
    errores.precio = 'El precio debe ser mayor a 0'
  }
  if (datos.stock === '' || !Number.isInteger(Number(datos.stock)) || Number(datos.stock) < 0) {
    errores.stock = 'El stock debe ser un numero entero (0 o mas)'
  }
  if (datos.oferta && !(Number(datos.precioOferta) > 0 && Number(datos.precioOferta) < Number(datos.precio))) {
    errores.precioOferta = 'El precio de oferta debe ser menor al precio normal'
  }

  return errores
}

export function validarUsuario(datos, editando) {
  const errores = {}

  if (datos.nombre.trim() === '') {
    errores.nombre = 'Ingresa el nombre'
  }
  if (datos.apellidos.trim() === '') {
    errores.apellidos = 'Ingresa los apellidos'
  }
  if (!correoValido(datos.correo)) {
    errores.correo = MENSAJE_CORREO
  }
  if ((!editando || datos.clave !== '') && !claveValida(datos.clave)) {
    errores.clave = MENSAJE_CLAVE
  }

  return errores
}
