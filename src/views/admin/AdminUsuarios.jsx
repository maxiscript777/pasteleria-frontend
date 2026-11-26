import { useEffect, useState } from 'react'
import { Alert, Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api, { mensajeError } from '../../api'

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [error, setError] = useState('')

  function cargar() {
    api.get('/usuarios').then((respuesta) => setUsuarios(respuesta.data))
  }

  useEffect(cargar, [])

  function borrar(id) {
    if (window.confirm('¿Eliminar este usuario?')) {
      api
        .delete('/usuarios/' + id)
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
        <h1 className="h3 mb-0">Usuarios</h1>
        <Button as={Link} to="/admin/usuarios/nuevo">Nuevo usuario</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table responsive bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre} {usuario.apellidos}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.rol}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button as={Link} to={`/admin/usuarios/${usuario.id}/editar`} size="sm">Editar</Button>
                  <Button size="sm" variant="danger" onClick={() => borrar(usuario.id)}>Eliminar</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default AdminUsuarios
