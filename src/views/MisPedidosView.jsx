import { useEffect, useState } from 'react'
import { Button, Container, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../api'
import { fechaCorta } from '../utils'

function MisPedidosView() {
  const [boletas, setBoletas] = useState([])

  useEffect(() => {
    api.get('/boletas/mias').then((respuesta) => setBoletas(respuesta.data))
  }, [])

  return (
    <Container className="py-4">
      <h1 className="mb-3">Mis pedidos</h1>

      {boletas.length === 0 && <p>Todavia no has hecho compras.</p>}

      {boletas.length > 0 && (
        <Table responsive bordered>
          <thead>
            <tr>
              <th>N°</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Boleta</th>
            </tr>
          </thead>
          <tbody>
            {boletas.map((boleta) => (
              <tr key={boleta.id}>
                <td>#{boleta.id}</td>
                <td>{fechaCorta(boleta.fecha)}</td>
                <td>${boleta.total.toLocaleString('es-CL')}</td>
                <td><Button as={Link} to={`/boleta/${boleta.id}`} size="sm">Ver boleta</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  )
}

export default MisPedidosView
