import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const ROLES = { ADMIN: 'Administrador', VENDEDOR: 'Vendedor', CLIENTE: 'Cliente' }

function PerfilView({ usuario }) {
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h1 className="h3 mb-3">Mi perfil</h1>
              <p><strong>Nombre:</strong> {usuario.nombre}</p>
              <p><strong>Correo:</strong> {usuario.correo}</p>
              <p><strong>Rol:</strong> {ROLES[usuario.rol]}</p>
              <Button as={Link} to="/mis-pedidos">Ver mis pedidos</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default PerfilView
