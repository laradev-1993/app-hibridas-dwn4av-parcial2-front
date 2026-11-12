import { useEffect, useState } from 'react';
import { fetchPrivado } from '../service/api';

function Turnos() {
    const [turnos, setTurnos] = useState([]);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(true);

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
        <h1>Turnos</h1>

        {turnos.length === 0 ? ( <p>No hay turnos cargados.</p>
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

                            <span className="turno-estado">{turno.estadoTurno}</span>
                        </div>
                    );
                })}
            </div>
        )}
    </div>
);
}

export default Turnos;