import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

//Decide  si una ruta se puede mostrar. (Si hay sesión, deja pasar y muestra la página. Si no hay sesión, redirige a /login}
function ProtectedRoute() {
    const {autenticado} = useAuth();
    const location = useLocation();

    if (!autenticado){
        return <Navigate to="/login" replace state={{from: location }} />;
        
    }

    return <Outlet />;
}

export default ProtectedRoute;