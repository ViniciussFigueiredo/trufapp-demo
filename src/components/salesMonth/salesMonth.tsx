import "../sell/sell.css"
import Icon from "../../assets/truficon.png"

interface SelesMonthProps {
    month: string;
    quantity: number;
    total: number;
}


export function SelesMonth(props: SelesMonthProps) {
    const { month, total, quantity,} = props

    return (
        <li
            className="sell-card w-100 d-flex justify-content-between align-items-center flex-nowrap">
            <div className="d-flex gap-2 flex-grow-1">
                <div className="icon d-flex justify-content-center p-1">
                    <img src={Icon} className="img-fluid" alt="Responsive image"></img>
                </div>
                <div className="buyer">
                    <strong>{month}</strong>
                    <span><small>x</small>{quantity}</span>
                </div>
            </div>
            <div className="value ">
                <div className="d-flex gap-1 align-items-center">
                    <p className="mt-2"><small>R$</small> {total},00</p>
                </div>
            </div>
        </li>
    );
}