import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Perfil from './pages/Perfil';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';



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
            </Route>

        <Route path="*" element={<NotFound />} />
        </Routes>
         </>
    );
}

export default App;