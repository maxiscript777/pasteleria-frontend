import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import api from '../api'
import { precioFinal } from '../utils'

function DetalleProductoView({ onAgregar }) {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/productos/' + id).then((respuesta) => setProducto(respuesta.data)).catch(() => setProducto(null))
  }, [id])

  if (!producto) {
    return (
      <Container className="py-4">
        <h2>Producto no encontrado</h2>
        <Button as={Link} to="/productos">Volver a productos</Button>
      </Container>
    )
  }

  function agregar() {
    if (cantidad < 1 || cantidad > producto.stock) {
      setError('La cantidad debe estar entre 1 y ' + producto.stock)
      return
    }

    setError('')
    onAgregar(producto, cantidad)
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Row className="g-4">
            <Col md={6}>
              <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded" />
            </Col>

            <Col md={6}>
              <h1>{producto.nombre}</h1>
              <p>{producto.descripcion}</p>
              <p className="fs-4 fw-bold">
                {producto.oferta && (
                  <span className="text-decoration-line-through text-muted me-2">
                    ${producto.precio.toLocaleString('es-CL')}
                  </span>
                )}
                ${precioFinal(producto).toLocaleString('es-CL')}
              </p>
              <p>Stock disponible: {producto.stock}</p>
              <p><Badge bg="secondary">{producto.categoria.nombre}</Badge></p>

              {error && <Alert variant="danger">{error}</Alert>}

              <Row>
                <Col xs={6} sm={4}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="cantidad">Cantidad</Form.Label>
                    <Form.Control
                      id="cantidad"
                      type="number"
                      min="1"
                      value={cantidad}
                      onChange={(event) => setCantidad(Number(event.target.value))}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button onClick={agregar} className="me-2">Agregar al carrito</Button>
              <Button as={Link} to="/productos" variant="secondary">Volver</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default DetalleProductoView
