// el token se guarda en localStorage
export function guardarToken(token) {
  localStorage.setItem('token', token)
}

export function leerToken() {
  return localStorage.getItem('token')
}

export function borrarToken() {
  localStorage.removeItem('token')
}

// saca correo, nombre y rol del token
export function usuarioDelToken() {
  const token = leerToken()

  if (!token) {
    return null
  }

  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const datos = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))))

    if (datos.exp * 1000 < Date.now()) {
      borrarToken()
      return null
    }

    return { correo: datos.sub, nombre: datos.nombre, rol: datos.rol }
  } catch {
    borrarToken()
    return null
  }
}
