import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Home() {
  const { autenticado, user } = useAuth();

  return (
    <div className={autenticado ? 'contenedor' : 'contenedor portada'}>
      <h1>API de Turnos</h1>

      {
        autenticado ?
          <section className="tarjeta">
            <h2>Hola, {user.nombre}</h2>
            <p>Rol: {user.role}</p>
          </section>
          :
          <section>
            <p>
              Sistema de gestión de turnos médicos: para registrar pacientes,
              agendar turnos y llevar el control de cada consulta.
            </p>
            <div className="acciones">
              <Link className="boton" to="/login">Iniciar sesión</Link>
              <Link className="boton" to="/register">Crear cuenta</Link>
            </div>
          </section>
      }
    </div>
  )
}

export default Home