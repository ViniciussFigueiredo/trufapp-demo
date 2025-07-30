import './payment.css'
import { useState } from 'react'

interface SellCardProps {
    _id?: string;
    name: string;
    quantity: number;
    value: number;
    status: string;
    paymentMethod: string;
}

interface PaymentProps {
    sale: SellCardProps;
    onConfirm: (status: string, method: string) => void;
    onCancel: () => void;
}

export function Payment(props: PaymentProps) {
    const { onConfirm, onCancel, sale } = props;

    const [method, setMethod] = useState('');
    const [isPaid, setIsPaid] = useState(false);

    const handleSubmit = () => {
        if (!method) {
            alert('Escolha uma forma de pagamento');
            return;
        }
        onConfirm(isPaid ? 'Pago' : 'Pendente', method);
    };


    return (
        <div className="modal" >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Forma de pagamento</h5>
                        <button type="button" onClick={onCancel} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body d-flex align-items-center gap-3">
                        <button type="button" className={`d-flex align-items-center gap-2 ${method === 'Dinheiro' ? 'selected' : ''}`} onClick={() => setMethod('Dinheiro')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#1A75FF" className="bi bi-cash" viewBox="0 0 16 16">
                                <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                                <path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2z" />
                            </svg>
                            Dinheiro
                        </button>
                        <button type="button" className={`d-flex align-items-center gap-2 ${method === 'Pix' ? 'selected' : ''}`} onClick={() => setMethod('Pix')}>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0,0,256,256">
                                <g fill="#1a75ff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none"><g transform="scale(5.12,5.12)"><path d="M25,0.03906c-2.16,0 -4.20047,0.84109 -5.73047,2.37109l-9.58984,9.58984h3.25c1.6,0 3.11023,0.61977 4.24023,1.75977l6.76953,6.76953c0.58,0.58 1.54109,0.58023 2.12109,-0.00977l6.76953,-6.75976c1.13,-1.14 2.64023,-1.75977 4.24023,-1.75977h3.25l-9.58984,-9.58984c-1.53,-1.53 -3.57047,-2.37109 -5.73047,-2.37109zM7.67969,14l-5.26953,5.26953c-3.16,3.16 -3.16,8.30094 0,11.46094l5.26953,5.26953h5.25c1.07,0 2.07008,-0.41992 2.83008,-1.16992l6.76953,-6.76953c1.36,-1.36 3.58141,-1.36 4.94141,0l6.76953,6.76953c0.76,0.75 1.76008,1.16992 2.83008,1.16992h5.25l5.26953,-5.26953c3.16,-3.16 3.16,-8.30094 0,-11.46094l-5.26953,-5.26953h-5.25c-1.07,0 -2.07008,0.41992 -2.83008,1.16992l-6.76953,6.76953c-0.68,0.68 -1.5707,1.02148 -2.4707,1.02148c-0.9,0 -1.7907,-0.34148 -2.4707,-1.02148l-6.76953,-6.76953c-0.76,-0.75 -1.76008,-1.16992 -2.83008,-1.16992zM25,29.03711c-0.385,0.00125 -0.77055,0.14836 -1.06055,0.44336l-6.76953,6.75977c-1.13,1.14 -2.64024,1.75977 -4.24023,1.75977h-3.25l9.58984,9.58984c1.53,1.53 3.57047,2.37109 5.73047,2.37109c2.16,0 4.20047,-0.84109 5.73047,-2.37109l9.58984,-9.58984h-3.25c-1.6,0 -3.11023,-0.61977 -4.24023,-1.75977l-6.76953,-6.76953c-0.29,-0.29 -0.67555,-0.43484 -1.06055,-0.43359z"></path></g></g>
                            </svg>
                            Pix
                        </button>
                        <button type="button" className={`d-flex align-items-center gap-2 ${method === 'Cartão' ? 'selected' : ''}`} onClick={() => setMethod('Cartão')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#1A75FF" className="bi bi-credit-card" viewBox="0 0 16 16">
                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z" />
                                <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                            </svg>
                            Cartão
                        </button>
                    </div>
                    <div className="modal-footer d-flex align-items-center justify-content-between">
                        <label className='pt-2'>
                            <input type="checkbox" checked={isPaid} onChange={() => setIsPaid(prev => !prev)} /> {"Pagamento confirmado"}
                        </label>

                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
                            <button className="btn btn-blue" onClick={handleSubmit}>Confirmar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}