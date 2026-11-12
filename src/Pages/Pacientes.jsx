import { useEffect, useState } from 'react';
import { fetchPrivado } from '../service/api';

function Pacientes() {
    const [pacientes, setPacientes] = useState([]);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarPacientes = async () => {
            try {
                const respuesta = await fetchPrivado('/api/pacientes');
                setPacientes(respuesta.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };

        cargarPacientes();
    }, []);


     if (cargando) {
        return <p className="contenedor">Cargando pacientes...</p>;
    }

     if (error) {
            return <p className="contenedor">{error}</p>;
     }

return (
    <div className="contenedor">
        <h1>Pacientes</h1>

        {pacientes.length === 0 ? (
            <p>No hay pacientes cargados.</p>
        ) : (
            <div className="lista-tarjetas">
                {pacientes.map((paciente) => (
                    <div className="tarjeta" key={paciente._id}>
                        <h2>{paciente.nombreCompleto}</h2>
                        <p>Edad: {paciente.edad}</p>
                        <p>Teléfono: {paciente.telefono}</p>
                        <p>Obra social: {paciente.obraSocial}</p>
                    </div>
                ))}
            </div>
        )}
    </div>
);
}

export default Pacientes;