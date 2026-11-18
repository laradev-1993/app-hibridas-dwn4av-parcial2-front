import { useEffect, useState } from 'react';
import { fetchPrivado } from '../service/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ModalConfirmacion from '../components/ModalConfirmacion';
import EditarTurnoForm from '../components/EditarTurnoForm';

function Turnos() {
    const [turnos, setTurnos] = useState([]);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(true);

    const {user} = useAuth();
    const puedeGestionar = user.role === 'admin' || user.role === 'superAdmin';
    const [errorEstado, setErrorEstado] = useState('');


    //eliminar
    const [idAEliminar, setIdAEliminar] = useState(null);

    //editar
     const [turnoEditando, setTurnoEditando] = useState(null);

    useEffect(() => {
        const cargarTurnos = async () => {
            try {
                const respuesta = await fetchPrivado('/api/turnos');
                setTurnos(respuesta.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };

        cargarTurnos();
    }, []);


async function handleCambiarEstado(id, nuevoEstado) {
    setErrorEstado('');

    try {
        await fetchPrivado(`/api/turnos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estadoTurno: nuevoEstado })
        });

        setTurnos(
            turnos.map((turno) =>
                turno._id === id ? { ...turno, estadoTurno: nuevoEstado } : turno
            )
        );
    } catch (err) {
        setErrorEstado(err.message);
    }
}
       //---- eliminar----------------------------------------
        async function handleEliminar(id) {
            setErrorEstado('');

            try {
                await fetchPrivado(`/api/turnos/${id}`, { method: 'DELETE' });
                setTurnos(turnos.filter((turno) => turno._id !== id));
            } catch (err) {
                setErrorEstado(err.message);
            } finally {
                setIdAEliminar(null);
            }
        }

        //------- editar --------------
    function handleGuardado(turnoActualizado){
       
        setTurnos(turnos.map(t =>
            t._id === turnoActualizado._id ? {...t, ...turnoActualizado, paciente: t.paciente} : t
        ));
        setTurnoEditando(null);
}


    if (cargando){
        return <p className="contenedor">Cargando turnos...</p>;
    }

    if (error){
        return <p className="contenedor">{error}</p>;
   }



if (turnoEditando){
    return (
        <EditarTurnoForm
            turno={turnoEditando}
             onGuardar={handleGuardado}
            onCancelar={() => setTurnoEditando(null)}
        />
    );
}

// ordenar los turnos de menor a mayor  
   const turnosOrdenados = [...turnos].sort(
    (a, b) => new Date(a.fechaHora) - new Date(b.fechaHora)
);




      return (
        <div className="contenedor">
            <div className="encabezado-pagina">
                <h1>Turnos</h1>

                {puedeGestionar ? (
                    <Link className="boton" to="/turnos/nuevo">Crear turno</Link>
                ) : null}
            </div>

            {errorEstado ? <p className="mensaje-error">{errorEstado}</p> : null}

            {turnos.length === 0 ? (
                <p>No hay turnos cargados.</p>
            ) : (
                <div className="tabla-contenedor">
                    <table className="tabla-turnos">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Paciente</th>
                                <th>Profesional</th>
                                <th>Motivo</th>
                                <th>¿Primera vez?</th>
                                <th>Estado</th>
                                {puedeGestionar ? <th>Acciones</th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {turnosOrdenados.map((turno) => {
                                const fecha = new Date(turno.fechaHora);
                                const hora = fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
                                const dia = fecha.toLocaleDateString('es-AR');

                                return (
                                    <tr key={turno._id}>
                                        <td>{dia}</td>
                                        <td>{hora}</td>
                                        <td>{turno.paciente?.nombreCompleto}</td>
                                        <td>{turno.profesional}</td>
                                        <td>{turno.motivoConsulta}</td>
                                        <td>{turno.primeraVez ? 'Sí' : 'No'}</td>
                                        <td>
                                            {puedeGestionar ? (
                                                <select
                                                    id={`estado-${turno._id}`}
                                                    name="estadoTurno"
                                                    aria-label="Estado del turno"
                                                    className="turno-estado"
                                                    value={turno.estadoTurno}
                                                    onChange={(event) => handleCambiarEstado(turno._id, event.target.value)}
                                                >
                                                    <option value="Pendiente">Pendiente</option>
                                                    <option value="Confirmado">Confirmado</option>
                                                    <option value="Cancelado">Cancelado</option>
                                                    <option value="Completado">Completado</option>
                                                </select>
                                            ) : (
                                                <span className="turno-estado">{turno.estadoTurno}</span>
                                            )}
                                        </td>
                                        {puedeGestionar ? (
                                            <td>
                                                <button className="boton boton-secundario" onClick={() => setTurnoEditando(turno)}>
                                                    Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="boton boton-eliminar"
                                                    onClick={() => setIdAEliminar(turno._id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        ) : null}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {idAEliminar ? (
                <ModalConfirmacion
                    mensaje="¿Estás seguro que querés borrar el turno?"
                    onConfirmar={() => handleEliminar(idAEliminar)}
                    onCancelar={() => setIdAEliminar(null)}
                />
            ) : null}
        </div>
    );
}

export default Turnos;