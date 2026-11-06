import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Home() {
  const { autenticado, user } = useAuth();

  return (
    <>
      <h1>API de Turnos</h1>

      {
        autenticado ?
          <section>
            <h2>Hola, {user.nombre}</h2>
            <p>Rol: {user.role}</p>
          </section>
          :
          <section>
            <p>
              Sistema de gestión de turnos médicos: para registrar pacientes,
              agendar turnos y llevar el control de cada consulta.
            </p>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Crear cuenta</Link>
          </section>
      }
    </>
  )
}

export default Home