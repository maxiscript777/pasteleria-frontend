import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api'
import { borrarToken, guardarToken, usuarioDelToken } from '../auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // al recargar, lee el token guardado
  const [usuario, setUsuario] = useState(usuarioDelToken)

  function iniciar(token) {
    guardarToken(token)
    const datos = usuarioDelToken()
    setUsuario(datos)
    return datos
  }

  function salir() {
    borrarToken()
    setUsuario(null)
  }

  // renueva el token cada 10 min
  useEffect(() => {
    if (!usuario) {
      return
    }

    const timer = setInterval(() => {
      api.post('/auth/refresh').then((respuesta) => iniciar(respuesta.data.accessToken)).catch(salir)
    }, 10 * 60 * 1000)

    return () => clearInterval(timer)
  }, [usuario?.correo])

  return <AuthContext.Provider value={{ usuario, iniciar, salir }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
