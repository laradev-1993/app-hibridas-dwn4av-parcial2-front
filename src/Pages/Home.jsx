import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchPrivado } from '../service/api'



const ETIQUETAS_ROL = {
  usuario: 'Usuario',
  profesional: 'Profesional',
  admin: 'Secretaria',
  superAdmin: 'Super admin'
};


const ROLES_CON_TURNOS = ['admin', 'profesional', 'superAdmin'];

function Home() {
  const { autenticado, user } = useAuth();
  const [turnos, setTurnos] = useState([]);
  const [error, setError] = useState('');

  const puedeVerTurnos = autenticado && ROLES_CON_TURNOS.includes(user.role);

  useEffect(() => {
    if (!puedeVerTurnos) {
      return;
    }

    const cargarTurnos = async () => {
      try {
        const respuesta = await fetchPrivado('/api/turnos');
        setTurnos(respuesta.data);
      } catch (err) {
        setError(err.message);
      }
    };

    cargarTurnos();
  }, [puedeVerTurnos]);

  if (autenticado) {

        const hoy = new Date();
        
        const fechaTexto = hoy.toLocaleDateString('es-AR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        });

      const puedeGestionar = user.role === 'admin' || user.role === 'superAdmin';

      const turnosHoy = turnos
        .filter((turno) => new Date(turno.fechaHora).toDateString() === hoy.toDateString()) //ordenado de más temprano a más tarde
        .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora)
      );

        const primeraVez = turnosHoy.filter((turno) => turno.primeraVez).length;
        const recurrentes = turnosHoy.length - primeraVez;

    return (
      <div className="contenedor">
        <div className="dashboard-cabecera">

          <h1 className="dashboard-fecha">{fechaTexto}</h1>

          <div className="tarjeta dashboard-saludo">

            <h2>Hola, {user.nombre}</h2>

            <p className="dashboard-rol">{ETIQUETAS_ROL[user.role]}</p>

            {puedeVerTurnos ? (
              <p>
                Tenés <strong>{turnosHoy.length}</strong>{' '}
                {turnosHoy.length === 1 ? 'turno' : 'turnos'} para hoy.
              </p>
            ) : (
              <p>Todavía no tenés acceso a turnos ni pacientes.</p>
            )}
          </div>

          {puedeVerTurnos ? (
            <div className="tarjeta dashboard-tipos">

              <h3>Tipo de pacientes</h3>

              <div className="dashboard-tipos-numeros">
                <div>
                  <span>Primera vez</span>
                  <strong>{primeraVez}</strong>
                </div>
                <div>
                  <span>Recurrentes</span>
                  <strong>{recurrentes}</strong>
                </div>
              </div>
            </div>
          ) : null}
        </div>

          {puedeVerTurnos ? (
  <section>
    <div className="dashboard-tabla-encabezado">
      <h2>Turnos de hoy</h2>

      {puedeGestionar ? (
        <Link className="boton" to="/turnos/nuevo">Crear turno</Link>
      ) : null}
    </div>

    {turnosHoy.length === 0 ? (
              <p>No hay turnos para hoy.</p>
            ) : (
              <div className="tabla-contenedor">
                <table className="tabla-turnos">
                  <thead>
                    <tr>
                      <th>Paciente</th>
                      <th>Edad</th>
                      <th>Hora</th>
                      <th>Profesional</th>
                      <th>Motivo</th>
                      <th>Estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {turnosHoy.map((turno) => (
                      <tr key={turno._id}>
                        <td>{turno.paciente?.nombreCompleto}</td>
                        <td>{turno.paciente?.edad}</td>
                        <td>
                          {new Date(turno.fechaHora).toLocaleTimeString('es-AR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}

                        </td>
                        <td>{turno.profesional}</td> 
                        <td>{turno.motivoConsulta}</td>
                        <td>{turno.estadoTurno}</td>
                      </tr>
                    ))}
                    
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : null}

        {error ? <p className="mensaje-error">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="contenedor portada">
      <h1>API de Turnos</h1>

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
    </div>
  )
}

export default Home