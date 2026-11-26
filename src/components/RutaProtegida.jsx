import { Navigate, Outlet } from 'react-router-dom'

// solo pasan los roles indicados
function RutaProtegida({ usuario, roles, children }) {
  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (!roles.includes(usuario.rol)) {
    return <Navigate to="/" replace />
  }

  return children || <Outlet />
}

export default RutaProtegida
