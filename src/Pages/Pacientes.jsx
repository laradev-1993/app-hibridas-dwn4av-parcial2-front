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
        return <p>Cargando pacientes...</p>;
      }

    if (error) {
        return <p>{error}</p>;
    }


return (
        <div>
            <h1>Pacientes</h1>

            {pacientes.length === 0 ? (<p>No hay pacientes cargados.</p>) : (
                pacientes.map((paciente) => (
                    <div key={paciente._id}>
                        <h2>{paciente.nombreCompleto}</h2>
                        <p>Edad: {paciente.edad}</p>
                        <p>Teléfono: {paciente.telefono}</p>
                        <p>Obra social: {paciente.obraSocial}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default Pacientes;