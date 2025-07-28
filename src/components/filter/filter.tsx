import { useState } from "react";
import "./filter.css"

interface FilterProps {
    onClose: () => void;
    onApplyFilter: (filters: {
        status: string[],
        paymentMethods: string[]
    }) => void;
}

export function Filter({ onClose, onApplyFilter }: FilterProps) {
    const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
    const [selectedMethods, setSelectedMethods] = useState<string[]>([]);

    const toggleItem = (item: string, list: string[], setList: (value: string[]) => void) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const handleFilter = () => {
        onApplyFilter({
            status: selectedStatus.includes("Todos") ? [] : selectedStatus,
            paymentMethods: selectedMethods.includes("Todos") ? [] : selectedMethods
        });
        onClose();
    };

    return (
        <div className="modal" >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Filtrar vendas</h5>
                        <button type="button" onClick={onClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>Status da compra</p>
                        <div className="d-flex gap-3">
                            {["Pago", "Pendente"].map(status => (
                                <label className='pt-2' key={status}>
                                    <input
                                        type="checkbox"
                                        checked={selectedStatus.includes(status)}
                                        onChange={() => toggleItem(status, selectedStatus, setSelectedStatus)}
                                    /> {status}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="modal-body">
                        <p>Metodo de pagamento</p>
                        <div className="d-flex gap-3">
                           {["Dinheiro", "Pix", "Cartão", "Todos"].map(method => (
                                <label className='pt-2' key={method}>
                                    <input
                                        type="checkbox"
                                        checked={selectedMethods.includes(method)}
                                        onChange={() => toggleItem(method, selectedMethods, setSelectedMethods)}
                                    /> {method}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" onClick={handleFilter} className="btn btn-primary">Filtrar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}