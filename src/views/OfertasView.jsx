import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import ListaProductos from '../components/ListaProductos'
import api from '../api'

function OfertasView({ onAgregar }) {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    api.get('/productos').then((respuesta) => setProductos(respuesta.data))
  }, [])

  return (
    <Container className="py-4">
      <h1 className="mb-4">Ofertas</h1>
      <ListaProductos productos={productos.filter((producto) => producto.oferta)} onAgregar={onAgregar} />
    </Container>
  )
}

export default OfertasView
