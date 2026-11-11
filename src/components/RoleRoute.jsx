import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RoleRoute({ rolesPermitidos }){
    const { autenticado, user } = useAuth();

   // verificar la Autenticación --> quién es
    if (!autenticado){
        return <Navigate to="/login" replace />;
    }


 // Verificar la autorización --> qué puede hacer   
    if (!rolesPermitidos.includes(user?.role)){
        return <Navigate to="/acceso-denegado" replace />;
    }

    return <Outlet />;
}

export default RoleRoute;