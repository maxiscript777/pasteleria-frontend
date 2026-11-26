import { useEffect, useState } from 'react'
import { Alert, Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api, { mensajeError } from '../../api'

const STOCK_CRITICO = 5

function AdminProductos({ usuario }) {
  const esAdmin = usuario.rol === 'ADMIN'
  const [productos, setProductos] = useState([])
  const [error, setError] = useState('')

  function cargar() {
    api.get('/productos').then((respuesta) => setProductos(respuesta.data))
  }

  useEffect(cargar, [])

  function borrar(id) {
    if (window.confirm('¿Eliminar este producto?')) {
      api
        .delete('/productos/' + id)
        .then(() => {
          setError('')
          cargar()
        })
        .catch((error) => setError(mensajeError(error)))
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Productos</h1>
        {esAdmin && <Button as={Link} to="/admin/productos/nuevo">Nuevo producto</Button>}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table responsive bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoria</th>
            <th>Precio</th>
            <th>Stock</th>
            {esAdmin && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id} className={producto.stock <= STOCK_CRITICO ? 'table-danger' : ''}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>{producto.categoria.nombre}</td>
              <td>${producto.precio.toLocaleString('es-CL')}</td>
              <td>{producto.stock}</td>
              {esAdmin && (
                <td>
                  <div className="d-flex gap-2">
                    <Button as={Link} to={`/admin/productos/${producto.id}/editar`} size="sm">Editar</Button>
                    <Button size="sm" variant="danger" onClick={() => borrar(producto.id)}>Eliminar</Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default AdminProductos
