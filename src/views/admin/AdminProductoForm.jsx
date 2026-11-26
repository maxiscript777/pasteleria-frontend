import { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import CampoForm from '../../components/CampoForm'
import api, { mensajeError } from '../../api'
import { validarProducto } from '../../data/validaciones'

function AdminProductoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [categorias, setCategorias] = useState([])
  const [datos, setDatos] = useState({
    nombre: '',
    categoriaId: '',
    precio: '',
    stock: '',
    descripcion: '',
    imagen: '/img/mousse_choc.jpg',
    oferta: false,
    precioOferta: '',
  })
  const [errores, setErrores] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/categorias').then((respuesta) => setCategorias(respuesta.data))

    if (id) {
      api.get('/productos/' + id).then((respuesta) => {
        const producto = respuesta.data
        setDatos({ ...producto, categoriaId: producto.categoria.id })
      })
    }
  }, [id])

  function cambiar(event) {
    const valor = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setDatos({ ...datos, [event.target.name]: valor })
  }

  function guardar(event) {
    event.preventDefault()
    const nuevosErrores = validarProducto(datos)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    const producto = {
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      imagen: datos.imagen,
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      oferta: datos.oferta,
      precioOferta: datos.oferta ? Number(datos.precioOferta) : 0,
      categoria: { id: Number(datos.categoriaId) },
    }

    const peticion = id ? api.put('/productos/' + id, producto) : api.post('/productos', producto)

    peticion.then(() => navigate('/admin/productos')).catch((error) => setError(mensajeError(error)))
  }

  return (
    <Card>
      <Card.Body>
        <h1 className="h3 mb-3">{id ? 'Editar producto' : 'Nuevo producto'}</h1>

        {error && <Alert variant="danger">{error}</Alert>}

        <form onSubmit={guardar} noValidate>
          <CampoForm id="nombre" etiqueta="Nombre" valor={datos.nombre} onChange={cambiar} error={errores.nombre} />

          <Form.Group className="mb-3" controlId="categoriaId">
            <Form.Label>Categoria</Form.Label>
            <Form.Select name="categoriaId" value={datos.categoriaId} onChange={cambiar} isInvalid={!!errores.categoriaId}>
              <option value="">Selecciona una categoria</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errores.categoriaId}</Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <CampoForm id="precio" etiqueta="Precio" tipo="number" valor={datos.precio} onChange={cambiar} error={errores.precio} />
            </Col>
            <Col md={6}>
              <CampoForm id="stock" etiqueta="Stock" tipo="number" valor={datos.stock} onChange={cambiar} error={errores.stock} />
            </Col>
          </Row>

          <CampoForm id="descripcion" etiqueta="Descripcion" as="textarea" filas={3} valor={datos.descripcion} onChange={cambiar} />
          <CampoForm id="imagen" etiqueta="Imagen (ruta)" valor={datos.imagen} onChange={cambiar} />

          <Form.Check
            type="checkbox"
            id="oferta"
            name="oferta"
            label="Producto en oferta"
            checked={datos.oferta}
            onChange={cambiar}
            className="mb-3"
          />

          {datos.oferta && (
            <CampoForm id="precioOferta" etiqueta="Precio de oferta" tipo="number" valor={datos.precioOferta} onChange={cambiar} error={errores.precioOferta} />
          )}

          <div className="d-flex gap-2">
            <Button type="submit">Guardar</Button>
            <Button variant="secondary" onClick={() => navigate('/admin/productos')}>Cancelar</Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  )
}

export default AdminProductoForm
