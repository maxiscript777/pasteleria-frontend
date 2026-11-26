import { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../../api'
import { fechaCorta } from '../../utils'

function AdminOrdenes() {
  const [ordenes, setOrdenes] = useState([])

  useEffect(() => {
    api.get('/boletas').then((respuesta) => setOrdenes(respuesta.data))
  }, [])

  return (
    <>
      <h1 className="h3 mb-3">Ordenes</h1>

      {ordenes.length === 0 && <p>Todavia no hay compras.</p>}

      {ordenes.length > 0 && (
        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>N°</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Boleta</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.id}>
                <td>#{orden.id}</td>
                <td>{fechaCorta(orden.fecha)}</td>
                <td>{orden.usuario.nombre} {orden.usuario.apellidos}</td>
                <td>${orden.total.toLocaleString('es-CL')}</td>
                <td><Button as={Link} to={`/admin/ordenes/${orden.id}`} size="sm">Ver boleta</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default AdminOrdenes
