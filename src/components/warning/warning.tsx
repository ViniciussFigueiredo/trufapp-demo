import "./warning.css"

interface WarningProps {
    name: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export function Warning(props: WarningProps) {
    const { name, onCancel, onConfirm } = props;
    console.log("Renderizando o modal!");

    return (
        <div className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="d-flex gap-2 align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#1A75FF" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                            </svg>
                            <h5 className="modal-title">Excluir Compra</h5>
                        </div>
                        <button type="button" onClick={onCancel} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>Tem certeza que deseja excluir a compra de <strong>{name}</strong></p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={onCancel} className="btn one px-4" data-bs-dismiss="modal">Não</button>
                        <button type="button" onClick={onConfirm} className="btn two px-4">Sim</button>
                    </div>
                </div>
            </div>
        </div>


    )
}