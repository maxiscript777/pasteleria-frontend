import { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ListaProductos from '../components/ListaProductos'
import api from '../api'

function HomeView({ onAgregar }) {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    api.get('/productos').then((respuesta) => setProductos(respuesta.data))
    api.get('/categorias').then((respuesta) => setCategorias(respuesta.data))
  }, [])

  return (
    <Container className="py-4">
      <Row className="align-items-center g-4 mb-5">
        <Col md={6}>
          <h1>50 años de dulzura y tradicion</h1>
          <p className="lead">
            Tortas y postres para cada ocasion, hechos como siempre
            en Chile.
          </p>
          <Button as={Link} to="/productos" size="lg" className="me-2">Ver catalogo</Button>
          <Button as={Link} to="/ofertas" size="lg" variant="outline-primary">Ver ofertas</Button>
        </Col>
        <Col md={6}>
          <img src="/img/torta_circ_vainilla.jpg" alt="Torta de vainilla" className="detail-image rounded shadow" />
        </Col>
      </Row>

      <h2 className="mb-3">Ofertas destacadas</h2>
      <ListaProductos productos={productos.filter((producto) => producto.oferta)} onAgregar={onAgregar} />

      <h2 className="mt-5 mb-3">Categorias</h2>
      <Row className="g-3">
        {categorias.map((categoria) => (
          <Col key={categoria.id} xs={6} md={4} lg>
            <Card
              as={Link}
              to={`/categorias/${categoria.id}`}
              className="h-100 text-center text-decoration-none shadow-sm"
            >
              <Card.Body>{categoria.nombre}</Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default HomeView
