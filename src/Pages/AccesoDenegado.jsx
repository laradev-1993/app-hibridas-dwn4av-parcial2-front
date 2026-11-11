
import { Link } from 'react-router-dom';

function AccesoDenegado() {
    return (
        <div>
            <h1>Error 403</h1>
            <p>No tenés permisos para ver esta página.</p>
            <Link to="/">Volver al inicio</Link>
        </div>
    );
}

export default AccesoDenegado;