import { useAuth } from '../context/AuthContext.jsx'

function Perfil() {
  const { user } = useAuth();

  return (
    <div className="contenedor">
    <div className="tarjeta">
    <section>
      <h2>Mi perfil</h2>
      <ul>
        <li><strong>Nombre:</strong> {user.nombre}</li>
        <li><strong>Rol:</strong> {user.role}</li>
      </ul>
    </section>
    </div>
    </div>
  )
}

export default Perfil