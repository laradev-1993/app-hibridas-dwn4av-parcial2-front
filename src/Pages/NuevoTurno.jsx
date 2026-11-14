import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPrivado } from '../service/api';



function NuevoTurno() {
    const [turno, setTurno] = useState({
        profesional: '',
        fechaHora: '',
        motivoConsulta: '',
        estadoTurno: 'Pendiente',
        primeraVez: 'false'
    });



    // Estados paciente
    const [busqueda, setBusqueda] = useState('');
    const [resultados, setResultados] = useState([]);
    const [buscado, setBuscado] = useState(false);
    const [errorBusqueda, setErrorBusqueda] = useState('');
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
    const [modoNuevo, setModoNuevo] = useState(false);
    const navigate = useNavigate();
     const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);



    const [pacienteNuevo, setPacienteNuevo] = useState({
        nombreCompleto: '',
        edad: '',
        telefono: '',
        obraSocial: ''
       });

    function handleChange(event){
        const {name, value} = event.target;
        setTurno({ ...turno, [name]: value});
    }

    function handleChangePacienteNuevo(event){
        const { name, value } = event.target;
        setPacienteNuevo({ ...pacienteNuevo, [name]: value });
    }

    async function handleBuscar() {
        //  console.log('buscando:', busqueda);
        setErrorBusqueda('');

        //para que no aparezca la lista de pacientes buscados
          if (!busqueda.trim()) {
            setErrorBusqueda('Escribí un nombre para buscar');
            return;
         }


        try {
            const respuesta = await fetchPrivado(
                `/api/pacientes?nombreCompleto=${encodeURIComponent(busqueda)}`
            );
            setResultados(respuesta.data);
            setBuscado(true);
        } catch (err) {
            setErrorBusqueda(err.message);
        }
    }

    function handleTeclaBusqueda(event){
        if (event.key === 'Enter') {
            event.preventDefault();
            handleBuscar();
        }
    }

        function handleSeleccionar(paciente){
            setPacienteSeleccionado(paciente);
            setModoNuevo(false);

            setResultados([]);
            setBuscado(false);
            setBusqueda('');
        }

    function handleActivarNuevo(){
        setModoNuevo(true);
        setPacienteSeleccionado(null);

        setResultados([]);
        setBuscado(false);
    }

    function handleVolverABuscar(){
        setModoNuevo(false);
    }


    //validación
    function validar(){

        if (modoNuevo){
                    if (
                        !pacienteNuevo.nombreCompleto.trim() ||
                        !pacienteNuevo.telefono.trim() ||
                        !pacienteNuevo.obraSocial.trim() ||
                        pacienteNuevo.edad === ''
                    ) {
                        return 'Completá todos los datos del paciente nuevo';
                    }
                    if (Number(pacienteNuevo.edad) < 0) {
                        return 'La edad no puede ser negativa';
                    }

        } else if (!pacienteSeleccionado) {
            return 'Seleccioná un paciente o cargá uno nuevo';
        
        }

        if (!turno.profesional.trim()) {
            return 'Ingresá el profesional';
        }
        
        if (!turno.fechaHora) {
            return 'Elegí la fecha y la hora';
        }
        if (!turno.motivoConsulta.trim()) {
                return 'Ingresá el motivo de consulta';
        }

        return '';
    }


        async function handleSubmit(event) {
            event.preventDefault();
            setError('');

            const mensajeError = validar();
            if (mensajeError) {
                setError(mensajeError);
                return;
            }

            const datos = {
                ...turno,
                fechaHora: new Date(turno.fechaHora).toISOString(), //para q quede en mi zpna horaria
                primeraVez: turno.primeraVez === 'true',
                paciente: modoNuevo ? { ...pacienteNuevo, edad: Number(pacienteNuevo.edad) } : pacienteSeleccionado._id
            };

            setCargando(true);

            try {
                await fetchPrivado('/api/turnos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
                navigate('/turnos');
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        }

    return (
        <div className="contenedor-formulario">

            <h1>Crear turno</h1>

            <form className="formulario" onSubmit={handleSubmit}>

                 <h2>Paciente</h2>

                <div className="bloque-paciente">


                   {pacienteSeleccionado ? (

                        <p>
                            Seleccionado: <strong>{pacienteSeleccionado.nombreCompleto}</strong>
                        </p>
                        
                    ) : null}

                    {!modoNuevo ? (
                        <>
                            <label htmlFor="busqueda">Buscar por nombre</label>
                            <input
                                type="text"
                                id="busqueda"
                                value={busqueda}
                                onChange={(event) => setBusqueda(event.target.value)}
                                onKeyDown={handleTeclaBusqueda}
                            />
                            <button type="button" className="boton" onClick={handleBuscar}>
                                Buscar
                            </button>

                            {errorBusqueda ? <p className="mensaje-error">{errorBusqueda}</p> : null}

                         {buscado && resultados.length === 0 ? (

                            <p>No se encontraron pacientes con ese nombre.</p>

                          ) : null}


                            {resultados.map((paciente) => (
                                <div className="resultado-paciente" key={paciente._id}>
                                    <span>{paciente.nombreCompleto} · {paciente.obraSocial}</span>
                                    <button
                                        type="button"
                                        className="boton"
                                        onClick={() => handleSeleccionar(paciente)}
                                    >
                                        Seleccionar
                                    </button>
                                </div>
                            ))}

                            <button type="button" className="boton" onClick={handleActivarNuevo}>
                                Paciente nuevo
                            </button>
                        </>
                    ) : null}

                    {modoNuevo ? (
                        <>
                            <label htmlFor="nombreCompleto">Nombre completo</label>
                            <input
                                type="text"
                                id="nombreCompleto"
                                name="nombreCompleto"
                                value={pacienteNuevo.nombreCompleto}
                                onChange={handleChangePacienteNuevo}
                            />

                            <label htmlFor="edad">Edad</label>
                            <input
                                type="number"
                                id="edad"
                                name="edad"
                                value={pacienteNuevo.edad}
                                onChange={handleChangePacienteNuevo}
                            />

                            <label htmlFor="telefono">Teléfono</label>
                            <input
                                type="text"
                                id="telefono"
                                name="telefono"
                                value={pacienteNuevo.telefono}
                                onChange={handleChangePacienteNuevo}
                            />

                            <label htmlFor="obraSocial">Obra social</label>
                            <input
                                type="text"
                                id="obraSocial"
                                name="obraSocial"
                                value={pacienteNuevo.obraSocial}
                                onChange={handleChangePacienteNuevo}
                            />

                            <button type="button" className="boton" onClick={handleVolverABuscar}>
                                Volver a buscar
                            </button>
                        </>
                    ) : null}

                </div>

                <label htmlFor="profesional">Profesional</label>
                <input
                    type="text"
                    id="profesional"
                    name="profesional"
                    value={turno.profesional}
                    onChange={handleChange}
                />

                <label htmlFor="fechaHora">Fecha y hora</label>
                <input
                    type="datetime-local"
                    id="fechaHora"
                    name="fechaHora"
                    value={turno.fechaHora}
                    onChange={handleChange}
                />

                <label htmlFor="motivoConsulta">Motivo de consulta</label>
                <input
                    type="text"
                    id="motivoConsulta"
                    name="motivoConsulta"
                    value={turno.motivoConsulta}
                    onChange={handleChange}
                />

                <label htmlFor="estadoTurno">Estado</label>
                <select
                    id="estadoTurno"
                    name="estadoTurno"
                    value={turno.estadoTurno}
                    onChange={handleChange}
                >

                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="Cancelado">Cancelado</option>
                    <option value="Completado">Completado</option>
                </select>

                <label htmlFor="primeraVez">¿Primera vez?</label>
                    <select
                        id="primeraVez"
                        name="primeraVez"
                        value={turno.primeraVez}
                        onChange={handleChange}
                    >

                        <option value="false">No</option>
                        <option value="true">Sí</option>
                    </select>

                {error ? <p className="mensaje-error">{error}</p> : null}

                <button className="boton" type="submit" disabled={cargando}>
                    {cargando ? 'Guardando...' : 'Guardar turno'}
                </button>

            </form>
        </div>
    );
}

export default NuevoTurno;