import { useAuth } from '../context/AuthContext.jsx'

const ETIQUETAS_ROL = {
  usuario: 'Usuario',
  profesional: 'Profesional',
  admin: 'Secretaria',
  superAdmin: 'Super administrador'
}

function Perfil() {
  const { user } = useAuth();

  return (
    <div className="contenedor">
      <div className="perfil">

        <h1>Perfil</h1>

        <div className="perfil-tarjeta">
          <div className="perfil-cabecera">
            <h2>{user.nombre}</h2>
          </div>

          <div className="perfil-datos">
            <div className="perfil-fila">
              <span className="perfil-etiqueta">Rol</span>
              <span>{ETIQUETAS_ROL[user.role]}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Perfil