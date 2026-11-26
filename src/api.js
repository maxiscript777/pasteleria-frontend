import axios from 'axios'
import { borrarToken, leerToken } from './auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
})

// agrega el token a cada peticion
api.interceptors.request.use((config) => {
  const token = leerToken()

  if (token && config.url !== '/auth/login' && config.url !== '/auth/registro') {
    config.headers.Authorization = 'Bearer ' + token
  }

  return config
})

// si el token no sirve, cierra sesion
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response && error.response.status === 401 && leerToken()) {
      borrarToken()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export function mensajeError(error) {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message
  }

  return error.response ? 'Revisa los datos ingresados' : 'No se pudo conectar con el servidor'
}

export default api
