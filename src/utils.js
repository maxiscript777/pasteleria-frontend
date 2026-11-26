export function precioFinal(producto) {
  return producto.oferta ? producto.precioOferta : producto.precio
}

export function calcularTotal(items) {
  let total = 0

  items.forEach((item) => {
    total = total + item.precio * item.cantidad
  })

  return total
}

export function fechaCorta(fecha) {
  return new Date(fecha).toLocaleDateString('es-CL')
}

export function itemsDeBoleta(boleta) {
  return boleta.detalles.map((detalle) => ({
    id: detalle.id,
    imagen: detalle.producto.imagen,
    nombre: detalle.producto.nombre,
    precio: detalle.precio,
    cantidad: detalle.cantidad,
  }))
}
