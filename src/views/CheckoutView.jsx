import { useState } from 'react'
import { Alert, Badge, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import CampoForm from '../components/CampoForm'
import TablaItems from '../components/TablaItems'
import api, { mensajeError } from '../api'
import REGIONES from '../data/regiones'
import { validarEnvio } from '../data/validaciones'
import { calcularTotal } from '../utils'

function CheckoutView({ carrito, onVaciar }) {
  const navigate = useNavigate()
  const [datos, setDatos] = useState({ calle: '', region: '', comuna: '', codigo: '' })
  const [errores, setErrores] = useState({})
  const [error, setError] = useState('')
  const comunas = datos.region === '' ? [] : REGIONES[datos.region]

  function cambiar(event) {
    setDatos({ ...datos, [event.target.name]: event.target.value })
  }

  function cambiarRegion(event) {
    setDatos({ ...datos, region: event.target.value, comuna: '' })
  }

  function pagar(event) {
    event.preventDefault()
    const nuevosErrores = validarEnvio(datos)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    // el backend calcula el total y crea la boleta
    api
      .post('/boletas', {
        direccion: datos.calle + ', ' + datos.comuna + ', ' + datos.region,
        codigo: datos.codigo,
        items: carrito.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
      })
      .then((respuesta) => {
        onVaciar()
        navigate('/boleta/' + respuesta.data.id)
      })
      .catch((error) => setError(mensajeError(error)))
  }

  if (carrito.length === 0) {
    return (
      <Container className="py-4">
        <h1>Comprar</h1>
        <p>No tienes productos en el carrito.</p>
        <Button as={Link} to="/productos">Ver productos</Button>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h1 className="h3">Confirmar compra</h1>
            <Badge bg="primary" className="fs-6">Total: ${calcularTotal(carrito).toLocaleString('es-CL')}</Badge>
          </div>

          <TablaItems items={carrito} />

          {error && <Alert variant="danger">{error}</Alert>}

          <form onSubmit={pagar} noValidate>
            <h2 className="h5 mt-4">Direccion de entrega</h2>
            <CampoForm id="calle" etiqueta="Calle" valor={datos.calle} onChange={cambiar} error={errores.calle} autoComplete="street-address" />
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="region">
                  <Form.Label>Region</Form.Label>
                  <Form.Select name="region" value={datos.region} onChange={cambiarRegion} isInvalid={!!errores.region}>
                    <option value="">Selecciona una region</option>
                    {Object.keys(REGIONES).map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errores.region}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="comuna">
                  <Form.Label>Comuna</Form.Label>
                  <Form.Select name="comuna" value={datos.comuna} onChange={cambiar} isInvalid={!!errores.comuna}>
                    <option value="">Selecciona una comuna</option>
                    {comunas.map((comuna) => (
                      <option key={comuna} value={comuna}>{comuna}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <CampoForm id="codigo" etiqueta="Codigo de descuento (opcional)" valor={datos.codigo} onChange={cambiar} placeholder="Ej: FELICES50" />
            <p className="small text-secondary">Con el codigo FELICES50 tienes 10% de descuento. Se aplica al confirmar.</p>

            <div className="text-end">
              <Button type="submit" variant="success">Confirmar compra</Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default CheckoutView
