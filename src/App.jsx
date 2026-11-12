import { Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Perfil from './pages/Perfil';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import AccesoDenegado from './pages/AccesoDenegado';
import Turnos from './pages/Turnos';
import RoleRoute from './components/RoleRoute';
import Pacientes from './pages/Pacientes';


function App() {
    return (
      <>
      <Navbar />

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

         <Route element={<ProtectedRoute />}>
            <Route path="/perfil" element={<Perfil />} />

              <Route element={<RoleRoute rolesPermitidos={['admin', 'profesional', 'superAdmin']} />}>
                  <Route path="/turnos" element={<Turnos />} />
                   <Route path="/pacientes" element={<Pacientes />} />
              </Route>

          </Route>

       <Route path="/acceso-denegado" element={<AccesoDenegado />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
         </>
    );
}

export default App;