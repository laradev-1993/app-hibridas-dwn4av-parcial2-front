const API_URL = import.meta.env.VITE_API_URL;

// ----- Iniciar sesión--------
export async function iniciarSesion(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'No se pudo iniciar sesión');
  }

  return data;
}


//--- Registroe de usuarios--

export async function registrarUsuario(nombre, email, password) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({nombre, email, password})
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'No se pudo realizar el registro');
  }

  return data;
}