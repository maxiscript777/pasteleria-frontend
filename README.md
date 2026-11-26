# Pasteleria 1000 Sabores - Frontend

Autor: Maximiliano Alexander Amestica Piña (trabajo individual)

React + React Bootstrap. Habla con el backend por axios. En el navegador solo se guarda el token (localStorage).

## Como correrlo

Primero deja corriendo el backend (puerto 8080). Luego:

```
npm install
npm run dev
```

Abre http://localhost:5173

Si el backend esta en otra direccion, crea un archivo `.env` con:

```
VITE_API_URL=http://IP_DEL_BACKEND:8080/api/v1
```

## Archivos importantes

- `src/api.js`: axios, agrega el token a cada peticion
- `src/auth.js`: guarda y lee el token
- `src/context/AuthContext.jsx`: sesion del usuario, se mantiene al recargar y renueva el token
- `src/components/RutaProtegida.jsx`: bloquea pantallas segun el rol
- `src/App.jsx`: todas las rutas
