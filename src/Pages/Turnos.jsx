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
        return <p>Cargando turnos...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }


    return (
        <div>
            <h1>Turnos</h1>

            {turnos.length === 0 ? (
                <p>No hay turnos cargados.</p>
            ) : (
                turnos.map((turno) => (
                    <div key={turno._id}>
                        <h2>{turno.paciente?.nombreCompleto}</h2>
                        <p>Profesional: {turno.profesional}</p>
                        <p>Fecha: {new Date(turno.fechaHora).toLocaleString('es-AR')}</p>
                        <p>Motivo: {turno.motivoConsulta}</p>
                        <p>Estado: {turno.estadoTurno}</p>
                        <p>¿Primera vez?: {turno.primeraVez ? 'Sí' : 'No'}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default Turnos;