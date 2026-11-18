import { useEffect, useState } from 'react';
import { fetchPrivado } from '../service/api';


function Pacientes() {
    const [pacientes, setPacientes] = useState([]);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('');


    useEffect(() => {
        const cargarPacientes = async () => {
            try {
                const respuesta = await fetchPrivado(
                    `/api/pacientes?nombreCompleto=${encodeURIComponent(filtro)}`
                );
                setPacientes(respuesta.data);
                setError('');
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };

        cargarPacientes();
    }, [filtro]);


    function handleBuscar(event) {
        event.preventDefault();
        setFiltro(busqueda.trim());
    }


     if (cargando) {
            return <p className="contenedor">Cargando pacientes...</p>;
      }

return (
        <div className="contenedor">
            <div className="encabezado-pagina">
                
                <h1>Pacientes</h1>

                <form className="busqueda" onSubmit={handleBuscar}>
                    <input
                        type="text"
                        id="busqueda"
                        name="busqueda"
                        placeholder="Buscar por nombre"
                        aria-label="Buscar paciente por nombre"
                        value={busqueda}
                        onChange={(event) => setBusqueda(event.target.value)}
                    />
                    <button type="submit" className="boton">Buscar</button>
                </form>
            </div>

            {error ? <p className="mensaje-error">{error}</p> : null}

            {pacientes.length === 0 ? (
                <p>
                    {filtro
                        ? 'No se encontraron pacientes con ese nombre.'
                        : 'No hay pacientes cargados.'}
                </p>
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