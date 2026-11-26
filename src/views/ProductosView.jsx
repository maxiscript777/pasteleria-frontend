import { useEffect, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import ListaProductos from '../components/ListaProductos'
import api from '../api'

function ProductosView({ onAgregar }) {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')

  useEffect(() => {
    api.get('/productos').then((respuesta) => setProductos(respuesta.data))
  }, [])

  const categorias = []
  productos.forEach((producto) => {
    if (!categorias.includes(producto.categoria.nombre)) {
      categorias.push(producto.categoria.nombre)
    }
  })

  const filtrados = productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (categoria === '' || producto.categoria.nombre === categoria)
  )

  return (
    <Container className="py-4">
      <h1 className="mb-4">Productos</h1>

      <Row className="g-3 mb-4">
        <Col md={7}>
          <Form.Control
            placeholder="Buscar producto"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </Col>
        <Col md={5}>
          <Form.Select
            aria-label="Filtrar por categoria"
            value={categoria}
            onChange={(event) => setCategoria(event.target.value)}
          >
            <option value="">Todas las categorias</option>
            {categorias.map((nombre) => (
              <option key={nombre} value={nombre}>{nombre}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <ListaProductos productos={filtrados} onAgregar={onAgregar} />
    </Container>
  )
}

export default ProductosView
