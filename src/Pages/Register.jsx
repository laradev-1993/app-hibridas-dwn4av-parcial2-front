import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registrarUsuario } from '../service/api.js'

function Register() {
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  // Estado del formulario de registro
  const [user, setUser] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  async function handleSubmitRegister(event) {
    event.preventDefault();
    setError('');

    if (user.password !== user.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setCargando(true);

    try {
      await registrarUsuario(user.nombre, user.email, user.password);
      setUser({ nombre: '', email: '', password: '', confirmPassword: '' });
      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  }

  return (
   
    <div className="contenedor-formulario">
      <h1>Crear cuenta</h1>

        <form className="formulario" onSubmit={handleSubmitRegister}>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={user.nombre}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
            />

            <label htmlFor="confirmPassword">Repetir contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              required
            />

            <button className="boton" type="submit" disabled={cargando}>
              {cargando ? 'Registrando...' : 'Registrarme'}
            </button>
        </form>

      <p className="mensaje-error">{error}</p>
    </div>
    
  )
}

export default Register