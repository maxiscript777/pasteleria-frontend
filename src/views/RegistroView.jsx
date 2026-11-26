import { useState } from 'react'
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import CampoForm from '../components/CampoForm'
import api, { mensajeError } from '../api'
import { validarRegistro } from '../data/validaciones'

function RegistroView() {
  const navigate = useNavigate()
  const [datos, setDatos] = useState({ nombre: '', apellidos: '', correo: '', clave: '', repetir: '' })
  const [errores, setErrores] = useState({})
  const [error, setError] = useState('')

  function cambiar(event) {
    setDatos({ ...datos, [event.target.name]: event.target.value })
  }

  function enviar(event) {
    event.preventDefault()
    const nuevosErrores = validarRegistro(datos)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    api
      .post('/auth/registro', {
        nombre: datos.nombre,
        apellidos: datos.apellidos,
        correo: datos.correo,
        clave: datos.clave,
      })
      .then(() => navigate('/login'))
      .catch((error) => setError(mensajeError(error)))
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <h1 className="h3 mb-3">Crear cuenta</h1>

              {error && <Alert variant="danger">{error}</Alert>}

              <form onSubmit={enviar} noValidate>
                <CampoForm id="nombre" etiqueta="Nombre" valor={datos.nombre} onChange={cambiar} error={errores.nombre} autoComplete="given-name" />
                <CampoForm id="apellidos" etiqueta="Apellidos" valor={datos.apellidos} onChange={cambiar} error={errores.apellidos} autoComplete="family-name" />
                <CampoForm id="correo" etiqueta="Correo" tipo="email" valor={datos.correo} onChange={cambiar} error={errores.correo} autoComplete="email" />
                <CampoForm id="clave" etiqueta="Contraseña" tipo="password" valor={datos.clave} onChange={cambiar} error={errores.clave} autoComplete="new-password" />
                <CampoForm id="repetir" etiqueta="Repetir contraseña" tipo="password" valor={datos.repetir} onChange={cambiar} error={errores.repetir} autoComplete="new-password" />
                <Button type="submit" className="w-100">Registrarme</Button>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default RegistroView
