import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES_PANEL = ['admin', 'profesional', 'superAdmin'];

function Navbar() {
    const {autenticado, user, logout} = useAuth();
    const navigate = useNavigate();

    const puedeGestionar = autenticado && ROLES_PANEL.includes(user.role);
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

        return (
        <nav className="navbar">
            <div className="navbar-links">
                <Link to="/">Home</Link>

                {puedeGestionar && (
                    <>
                        <Link to="/turnos">Turnos</Link>
                        <Link to="/pacientes">Pacientes</Link>
                    </>
                )}
            </div>

            <div className="navbar-links">
                {autenticado ? (
                    <>
                        <Link to="/perfil">Perfil</Link>
                        <button className="boton" onClick={handleLogout}>Cerrar sesión</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Iniciar sesión</Link>
                        <Link to="/register">Registrarse</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;