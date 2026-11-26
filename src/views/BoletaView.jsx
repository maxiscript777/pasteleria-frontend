import { useEffect, useState } from 'react'
import { Alert, Button, Card, Container } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import TablaItems from '../components/TablaItems'
import api, { mensajeError } from '../api'
import { fechaCorta, itemsDeBoleta } from '../utils'

function BoletaView({ volver }) {
  const { id } = useParams()
  const [boleta, setBoleta] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/boletas/' + id).then((respuesta) => setBoleta(respuesta.data)).catch((error) => setError(mensajeError(error)))
  }, [id])

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
        <Button as={Link} to={volver}>Volver</Button>
      </Container>
    )
  }

  if (!boleta) {
    return <Container className="py-4">Cargando...</Container>
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h1 className="h3">Boleta nro #{boleta.id}</h1>
          <p className="text-muted">Fecha: {fechaCorta(boleta.fecha)}</p>
          <p><strong>Cliente:</strong> {boleta.usuario.nombre} {boleta.usuario.apellidos} ({boleta.usuario.correo})</p>
          <p><strong>Direccion:</strong> {boleta.direccion}</p>

          <TablaItems items={itemsDeBoleta(boleta)} />

          <p className="text-end mb-1">Subtotal: ${boleta.subtotal.toLocaleString('es-CL')}</p>
          {boleta.descuento > 0 && (
            <p className="text-end text-success mb-1">Descuento: -${boleta.descuento.toLocaleString('es-CL')}</p>
          )}
          <h3 className="text-end">Total: ${boleta.total.toLocaleString('es-CL')}</h3>

          <div className="d-flex gap-2 mt-3">
            <Button variant="secondary" as={Link} to={volver}>Volver</Button>
            <Button variant="danger" onClick={() => window.print()}>Imprimir boleta</Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default BoletaView
