import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmitLogin(event) {
    event.preventDefault();
    setCargando(true);
    setError('');

    try {
      await login(email, password);
//si venía de una ruta protegida, vuelve ahí; si no, va al perfil
      const destino = location.state?.from?.pathname || '/perfil';
      navigate(destino, { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
    <div className="contenedor-formulario">
        <h1>Iniciar sesión</h1>

        <form className="formulario" onSubmit={handleSubmitLogin}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button className="boton" type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="mensaje-error">{error}</p>
      </div>
    </>
  )
}

export default Login