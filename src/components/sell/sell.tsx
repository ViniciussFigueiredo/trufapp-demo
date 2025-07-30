import "./sell.css"
import Icon from "../../assets/truficon.png"

interface SellCardProps {
    name: string;
    quantity: number;
    value: number;
    status: string;
    paymentMethod: string;
    onDelete: () => void;
    onEdit: () => void;
}

export function SellCard(props: SellCardProps) {
    const { name, value, quantity, status, paymentMethod, onDelete, onEdit } = props;

    return (
        <li id={paymentMethod}
            className="sell-card w-100 d-flex justify-content-between align-items-center flex-nowrap">
            <div onClick={onEdit}
            style={{ cursor: status === 'pendente' ? 'pointer' : 'default' }} className="d-flex gap-2 flex-grow-1">
                <div className="icon d-flex justify-content-center p-1">
                    <img src={Icon} className="img-fluid" alt="Responsive image"></img>
                </div>
                <div className="buyer">
                    <strong>{name}</strong>
                    <span><small>x</small>{quantity} {status}</span>
                </div>
            </div>
            <div className="value ">
                <div className="d-flex gap-1 align-items-center">
                    <p className="mt-2"><small>R$</small> {value},00</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="red" className="bi bi-x mb-2" viewBox="0 0 16 16"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    >
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                </div>
            </div>

        </li>
    );
}