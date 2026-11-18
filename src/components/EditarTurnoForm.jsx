import { useState } from 'react';
import { fetchPrivado } from '../service/api';

function EditarTurnoForm({ turno, onGuardar, onCancelar }) {
    const [datos, setDatos] = useState({
        profesional: turno.profesional,
        fechaHora: '',
        motivoConsulta: turno.motivoConsulta,
        estadoTurno: turno.estadoTurno,
        primeraVez: String(turno.primeraVez)
    });


    const [error, setError] = useState('');
    const [guardando, setGuardando] = useState(false);

function handleChange(event) {

        const { name, value } = event.target;
        setDatos({ ...datos, [name]: value });
    }

    async function handleSubmit(event){
        event.preventDefault();


      if (!datos.profesional.trim()){
            setError('Completá el profesional');
            return;
        }

        if (!datos.motivoConsulta.trim()){

            setError('Completá el motivo de la consulta');
             return;
        }


        const cambios = {
            profesional: datos.profesional.trim(),
            motivoConsulta: datos.motivoConsulta.trim(),
            estadoTurno: datos.estadoTurno,
            primeraVez: datos.primeraVez === 'true'
        };

        //solo se encvia la fecha si se eligió una nueva
        if (datos.fechaHora) {
            cambios.fechaHora = new Date(datos.fechaHora).toISOString();
        }

        try {
            setGuardando(true);
            setError('');
             const res = await fetchPrivado(`/api/turnos/${turno._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cambios)
                });
            
            onGuardar(res.data);

        } catch (error) {
            setError(error.message);
        } finally {
             setGuardando(false);
        }
    }




    return (
        <div className="contenedor contenedor-formulario">

            <h2>Editar turno</h2>

            <p>Paciente: {turno.paciente?.nombreCompleto}</p>

            <form className="formulario" onSubmit={handleSubmit}>

                <label htmlFor="profesional">Profesional</label>
                <input type="text" id="profesional" name="profesional" value={datos.profesional} onChange={handleChange} />

                <label htmlFor="fechaHora">
                    Nueva fecha y hora (actual: {new Date(turno.fechaHora).toLocaleString('es-AR')})
                </label>
                <input type="datetime-local" id="fechaHora" name="fechaHora" value={datos.fechaHora} onChange={handleChange} />

                <label htmlFor="motivoConsulta">Motivo de la consulta</label>
                <input type="text" id="motivoConsulta" name="motivoConsulta" value={datos.motivoConsulta} onChange={handleChange} />

                <label htmlFor="estadoTurno">Estado</label>
                <select id="estadoTurno" name="estadoTurno" value={datos.estadoTurno} onChange={handleChange}>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="Cancelado">Cancelado</option>
                    <option value="Completado">Completado</option>
                </select>

                <label htmlFor="primeraVez">¿Primera vez?</label>
                <select id="primeraVez" name="primeraVez" value={datos.primeraVez} onChange={handleChange}>
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                </select>

                {error ? <p className="mensaje-error">{error}</p> : null}

                <button type="submit" className="boton" disabled={guardando}>
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                </button>

                <button type="button" className="boton boton-secundario" onClick={onCancelar}>
                    Cancelar
                </button>
            </form>


        </div>
    );
}

export default EditarTurnoForm;