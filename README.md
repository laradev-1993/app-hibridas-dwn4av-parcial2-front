# API de Turnos - Frontend

## Datos del proyecto
- Nombre y Apellido: Lara Esteva
- Materia: Aplicaciones Híbridas
- Docente: Jonathan Emanuel Cruz
- Comisión: DWN4AV

## Descripción
Aplicación web en React para la gestión de turnos médicos. Consume la API REST del proyecto (repositorio del backend: https://github.com/laradev-1993/app-hibridas-dwn4av-parcial1-). Permite registrarse, iniciar sesión, ver y gestionar turnos y consultar pacientes, con vistas y acciones según el rol del usuario.

## Tecnologías
- React (componentes funcionales y hooks) con Vite y JavaScript
- React Router (`react-router-dom`) para las rutas
- React Context para el estado de sesión
- `jwt-decode` para leer los datos del token en la interfaz

## Requisitos previos
- Node.js instalado
- El backend del proyecto en funcionamiento (ver su README)

## Instalación y puesta en marcha
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/laradev-1993/app-hibridas-dwn4av-parcial2-front.git
   cd app-hibridas-dwn4av-parcial2-front
   ```
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Crear el archivo `.env` en la raíz, tomando como modelo `.env.example`:
   ```
   VITE_API_URL=http://127.0.0.1:3000
   ```
   Debe apuntar a la dirección donde corre el backend.
4. Iniciar el backend (en su propia terminal) y luego el frontend:
   ```bash
   npm run dev
   ```
5. Abrir `http://localhost:5173` en el navegador.

El archivo `.env` real no se incluye en el repositorio: se entrega por separado.

## Páginas y permisos
| Ruta | Página | Acceso |
|---|---|---|
| `/` | Home | Público (muestra una vista distinta si hay sesión) |
| `/login` | Iniciar sesión | Público |
| `/register` | Crear cuenta | Público |
| `/perfil` | Perfil | Usuario con sesión |
| `/turnos` | Listado de turnos | `admin`, `profesional` y `superAdmin` |
| `/turnos/nuevo` | Crear turno | `admin` y `superAdmin` |
| `/pacientes` | Listado de pacientes | `admin`, `profesional` y `superAdmin` |
| `/acceso-denegado` | Error 403 | Se muestra al entrar a una ruta sin permiso |
| cualquier otra | Error 404 | Público |

Las rutas privadas están protegidas con los componentes `ProtectedRoute` (exige sesión) y `RoleRoute` (exige un rol permitido). La protección en el frontend es solo visual: los permisos reales los valida el backend en cada petición.

## Funcionalidades
- Registro e inicio de sesión, con redirección a la página que se quería visitar.
- Sesión guardada en `sessionStorage`; el Navbar muestra enlaces distintos según el rol.
- **Turnos:** listado ordenado por fecha, creación (con búsqueda de paciente por nombre o alta de un paciente nuevo en el mismo formulario), cambio de estado y eliminación con confirmación. El rol `profesional` solo puede ver los turnos.
- **Pacientes:** listado de pacientes.
- Validaciones en los formularios antes de enviar los datos al backend, con mensajes de error.

## Roles
Los usuarios que se registran quedan con el rol `usuario`. Para probar las vistas privadas, el rol (`profesional`, `admin` o `superAdmin`) se asigna editando el campo `role` del usuario en MongoDB Atlas, y después hay que volver a iniciar sesión. Más detalles en el README del backend.

## Estructura del proyecto
```
src/
  components/   Navbar, ProtectedRoute, RoleRoute, ModalConfirmacion
  context/      AuthContext (estado de sesión y hook useAuth)
  pages/        Home, Login, Register, Perfil, Turnos, NuevoTurno,
                Pacientes, AccesoDenegado, NotFound
  service/      api.js (funciones que llaman a la API)
  App.jsx       Definición de rutas
  main.jsx      Punto de entrada (BrowserRouter y AuthProvider)
```