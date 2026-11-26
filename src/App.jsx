import { useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import NavbarTienda from './components/NavbarTienda'
import RutaProtegida from './components/RutaProtegida'
import HomeView from './views/HomeView'
import ProductosView from './views/ProductosView'
import DetalleProductoView from './views/DetalleProductoView'
import CategoriasView from './views/CategoriasView'
import OfertasView from './views/OfertasView'
import NosotrosView from './views/NosotrosView'
import BlogsView from './views/BlogsView'
import DetalleBlogView from './views/DetalleBlogView'
import ContactoView from './views/ContactoView'
import LoginView from './views/LoginView'
import RegistroView from './views/RegistroView'
import CarritoView from './views/CarritoView'
import CheckoutView from './views/CheckoutView'
import BoletaView from './views/BoletaView'
import PerfilView from './views/PerfilView'
import MisPedidosView from './views/MisPedidosView'
import AdminLayout from './views/admin/AdminLayout'
import AdminOrdenes from './views/admin/AdminOrdenes'
import AdminProductos from './views/admin/AdminProductos'
import AdminProductoForm from './views/admin/AdminProductoForm'
import AdminCategorias from './views/admin/AdminCategorias'
import AdminUsuarios from './views/admin/AdminUsuarios'
import AdminUsuarioForm from './views/admin/AdminUsuarioForm'
import { useAuth } from './context/AuthContext'
import { calcularTotal, precioFinal } from './utils'

const TODOS = ['ADMIN', 'VENDEDOR', 'CLIENTE']

function App() {
  const { usuario, iniciar, salir } = useAuth()
  // el carrito vive en memoria
  const [carrito, setCarrito] = useState([])
  const location = useLocation()
  const enAdmin = location.pathname.startsWith('/admin')

  // el vendedor solo ve su panel
  if (usuario && usuario.rol === 'VENDEDOR' && !enAdmin) {
    return <Navigate to="/admin" replace />
  }

  function agregarAlCarrito(producto, cantidad = 1) {
    const existe = carrito.some((item) => item.id === producto.id)

    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item
        )
      )
      return
    }

    setCarrito([
      ...carrito,
      {
        id: producto.id,
        nombre: producto.nombre,
        precio: precioFinal(producto),
        imagen: producto.imagen,
        cantidad: cantidad,
      },
    ])
  }

  function cambiarCantidad(id, cambio) {
    setCarrito(
      carrito
        .map((item) => (item.id === id ? { ...item, cantidad: item.cantidad + cambio } : item))
        .filter((item) => item.cantidad > 0)
    )
  }

  function eliminarDelCarrito(id) {
    setCarrito(carrito.filter((item) => item.id !== id))
  }

  function cerrarSesion() {
    salir()
    setCarrito([])
  }

  let cantidadCarrito = 0
  carrito.forEach((item) => {
    cantidadCarrito = cantidadCarrito + item.cantidad
  })

  return (
    <>
      {!enAdmin && (
        <NavbarTienda
          cantidadCarrito={cantidadCarrito}
          totalCarrito={calcularTotal(carrito)}
          usuario={usuario}
          onCerrarSesion={cerrarSesion}
        />
      )}

      <Routes>
        <Route path="/" element={<HomeView onAgregar={agregarAlCarrito} />} />
        <Route path="/productos" element={<ProductosView onAgregar={agregarAlCarrito} />} />
        <Route path="/producto/:id" element={<DetalleProductoView onAgregar={agregarAlCarrito} />} />
        <Route path="/categorias" element={<CategoriasView onAgregar={agregarAlCarrito} />} />
        <Route path="/categorias/:id" element={<CategoriasView onAgregar={agregarAlCarrito} />} />
        <Route path="/ofertas" element={<OfertasView onAgregar={agregarAlCarrito} />} />
        <Route path="/nosotros" element={<NosotrosView />} />
        <Route path="/blogs" element={<BlogsView />} />
        <Route path="/blog/:id" element={<DetalleBlogView />} />
        <Route path="/contacto" element={<ContactoView />} />
        <Route path="/login" element={<LoginView onLogin={iniciar} />} />
        <Route path="/registro" element={<RegistroView />} />
        <Route
          path="/carrito"
          element={
            <CarritoView
              carrito={carrito}
              onCambiarCantidad={cambiarCantidad}
              onEliminar={eliminarDelCarrito}
              onLimpiar={() => setCarrito([])}
            />
          }
        />

        {/* con sesion */}
        <Route element={<RutaProtegida usuario={usuario} roles={TODOS} />}>
          <Route path="/comprar" element={<CheckoutView carrito={carrito} onVaciar={() => setCarrito([])} />} />
          <Route path="/boleta/:id" element={<BoletaView volver="/mis-pedidos" />} />
          <Route path="/mis-pedidos" element={<MisPedidosView />} />
          <Route path="/perfil" element={<PerfilView usuario={usuario} />} />
        </Route>

        {/* admin y vendedor */}
        <Route element={<RutaProtegida usuario={usuario} roles={['ADMIN', 'VENDEDOR']} />}>
          <Route path="/admin" element={<AdminLayout usuario={usuario} onCerrarSesion={cerrarSesion} />}>
            <Route index element={<Navigate to="ordenes" replace />} />
            <Route path="ordenes" element={<AdminOrdenes />} />
            <Route path="ordenes/:id" element={<BoletaView volver="/admin/ordenes" />} />
            <Route path="productos" element={<AdminProductos usuario={usuario} />} />

            {/* solo admin */}
            <Route element={<RutaProtegida usuario={usuario} roles={['ADMIN']} />}>
              <Route path="productos/nuevo" element={<AdminProductoForm />} />
              <Route path="productos/:id/editar" element={<AdminProductoForm />} />
              <Route path="categorias" element={<AdminCategorias />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="usuarios/nuevo" element={<AdminUsuarioForm />} />
              <Route path="usuarios/:id/editar" element={<AdminUsuarioForm />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
