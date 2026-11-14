function ModalConfirmacion({ mensaje, onConfirmar, onCancelar }) {
    return (
        <div className="modal-fondo">
            <div className="modal">
                <p>{mensaje}</p>

                <div className="modal-acciones">
                    <button type="button" className="boton boton-peligro" onClick={onConfirmar}>
                        Eliminar
                    </button>
                    <button type="button" className="boton boton-secundario" onClick={onCancelar}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalConfirmacion;