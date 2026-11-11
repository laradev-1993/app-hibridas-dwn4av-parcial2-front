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



export async function fetchPrivado(endpoint, options = {}){
    const token = sessionStorage.getItem('token');
    if (!token){
        throw new Error('No existe una sesión activa');
    }

    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${token}`);

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });


    const data = await response.json().catch(() => null);

    if (response.status === 401){
        throw new Error('La sesión es inválida o expiró');
    }

    if (response.status === 403){
        throw new Error('Acceso no permitido');
    }

    if (!response.ok){
        throw new Error(data?.message || 'Error del servidor');
    }

    
    return data;
}