import { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import CampoForm from '../../components/CampoForm'
import api, { mensajeError } from '../../api'
import { validarUsuario } from '../../data/validaciones'

function AdminUsuarioForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [datos, setDatos] = useState({ nombre: '', apellidos: '', correo: '', clave: '', rol: 'CLIENTE' })
  const [errores, setErrores] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      api.get('/usuarios/' + id).then((respuesta) => setDatos({ ...respuesta.data, clave: '' }))
    }
  }, [id])

  function cambiar(event) {
    setDatos({ ...datos, [event.target.name]: event.target.value })
  }

  function guardar(event) {
    event.preventDefault()
    const nuevosErrores = validarUsuario(datos, !!id)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    const peticion = id ? api.put('/usuarios/' + id, datos) : api.post('/usuarios', datos)

    peticion.then(() => navigate('/admin/usuarios')).catch((error) => setError(mensajeError(error)))
  }

  return (
    <Card>
      <Card.Body>
        <h1 className="h3 mb-3">{id ? 'Editar usuario' : 'Nuevo usuario'}</h1>

        {error && <Alert variant="danger">{error}</Alert>}

        <form onSubmit={guardar} noValidate>
          <Row>
            <Col md={6}>
              <CampoForm id="nombre" etiqueta="Nombre" valor={datos.nombre} onChange={cambiar} error={errores.nombre} />
            </Col>
            <Col md={6}>
              <CampoForm id="apellidos" etiqueta="Apellidos" valor={datos.apellidos} onChange={cambiar} error={errores.apellidos} />
            </Col>
          </Row>

          <CampoForm id="correo" etiqueta="Correo" tipo="email" valor={datos.correo} onChange={cambiar} error={errores.correo} />
          <CampoForm
            id="clave"
            etiqueta={id ? 'Contraseña (vacia = no cambiar)' : 'Contraseña'}
            tipo="password"
            valor={datos.clave}
            onChange={cambiar}
            error={errores.clave}
          />

          <Form.Group className="mb-3" controlId="rol">
            <Form.Label>Rol</Form.Label>
            <Form.Select name="rol" value={datos.rol} onChange={cambiar}>
              <option value="ADMIN">Administrador</option>
              <option value="VENDEDOR">Vendedor</option>
              <option value="CLIENTE">Cliente</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit">Guardar</Button>
            <Button variant="secondary" onClick={() => navigate('/admin/usuarios')}>Cancelar</Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  )
}

export default AdminUsuarioForm
