import { createContext, useState, useContext } from 'react'
import { jwtDecode } from 'jwt-decode'
import { iniciarSesion } from '../service/api.js'

const AuthContext = createContext(null);

function obtenerSesion(token) {
  if (!token) {
    return {token: null, user: null};
  }

  try {

    // Decodificar el JWT.
    const payload = jwtDecode(token);

    
     // para verificar que tenga expiración y que no haya vencido

    if (!payload.exp || payload.exp * 1000 <= Date.now()) {
      return { token: null, user: null };
    }

    const user = {
      id: payload.id,
      nombre: payload.nombre,
      role: payload.role
    }

    return { token, user };

  } catch (error) {
    console.error(error);
    return { token: null, user: null };
  }
}

function restaurarSesion() {
  const token = sessionStorage.getItem('token');
  const sesion = obtenerSesion(token);

  if (!sesion.token) {
    sessionStorage.removeItem('token');
  }

  return sesion;
}

export function AuthProvider({children}) {
  // sesion = { token: null, user: null }
  const [sesion, setSesion] = useState(restaurarSesion);

  async function login(email, password) {
    const respuesta = await iniciarSesion(email, password);
    const token = respuesta.data.token;

    if (!token) {
      throw new Error('No se recibió el token de la API');
    }

    const nuevaSesion = obtenerSesion(token);

    if (!nuevaSesion.token) {
      throw new Error('El token es inválido o está vencido');
    }

    sessionStorage.setItem('token', nuevaSesion.token);
    setSesion(nuevaSesion);
  }

  function logout() {
    sessionStorage.removeItem('token');
    setSesion({ token: null, user: null });
  }

  return (
    <AuthContext.Provider value={{
      token: sesion.token,
      user: sesion.user,
      autenticado: Boolean(sesion.token && sesion.user),
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
}