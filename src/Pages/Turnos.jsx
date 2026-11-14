import { useEffect, useState } from 'react';
import { fetchPrivado } from '../service/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ModalConfirmacion from '../components/ModalConfirmacion';

function Turnos() {
    const [turnos, setTurnos] = useState([]);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(true);

    const {user} = useAuth();
    const puedeGestionar = user.role === 'admin' || user.role === 'superAdmin';
    const [errorEstado, setErrorEstado] = useState('');

    //eliminar
    const [idAEliminar, setIdAEliminar] = useState(null);

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



    if (cargando) {
        return <p className="contenedor">Cargando turnos...</p>;
    }

    if (error) {
        return <p className="contenedor">{error}</p>;
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
                <div className="lista-turnos">
                    {turnosOrdenados.map((turno) => {
                        const fecha = new Date(turno.fechaHora);
                        const hora = fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
                        const dia = fecha.toLocaleDateString('es-AR');

                        return (
                            <div className="turno-item" key={turno._id}>
                                <div className="turno-hora">
                                    <strong>{hora}</strong>
                                    <span>{dia}</span>
                                </div>

                                <div className="turno-info">
                                    <h2>{turno.paciente?.nombreCompleto}</h2>
                                    <p><strong>{turno.profesional}</strong></p>
                                    <p>{turno.motivoConsulta}</p>
                                    <p>¿Primera vez?: {turno.primeraVez ? 'Sí' : 'No'}</p>
                                </div>

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

                                {puedeGestionar ? (
                                    <button
                                        type="button"
                                        className="boton boton-eliminar"
                                        onClick={() => setIdAEliminar(turno._id)}
                                    >
                                        Eliminar
                                    </button>
                                ) : null}
                            </div>
                        );
                    })}
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