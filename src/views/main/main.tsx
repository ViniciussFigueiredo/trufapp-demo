import "./main.css"
import { SellCard } from "../../components/sell/sell"
import React, { useState } from 'react';
import { Warning } from "../../components/warning/warning";
import { Payment } from "../../components/payment/payment";


export const Main: React.FC = () => {

    interface SellCardProps {
        name: string;
        quantity: number;
        status: string;
        value: number;
        paymentMethod: string;
    }

    const [pendingSale, setPendingSale] = useState<SellCardProps | null>(null);
    const [showPayment, setShowPayment] = useState(false);

    const [sales, setSales] = useState<SellCardProps[]>([]);
    const [showWarning, setShowWarning] = useState(false);

    const [saleToDeleteIndex, setSaleToDeleteIndex] = useState<number | null>(null);

    const handleDeleteClick = (index: number) => {
        setSaleToDeleteIndex(index);
        setShowWarning(true);
    };

    const confirmDelete = () => {
        if (saleToDeleteIndex !== null) {
            setSales((prevSales) => prevSales.filter((_, index) => index !== saleToDeleteIndex));
            setSaleToDeleteIndex(null);
            setShowWarning(false);
        }
    };

    const cancelDelete = () => {
        setSaleToDeleteIndex(null);
        setShowWarning(false);
    };

    const [formData, setFormData] = useState({
        name: "",
        quantity: "",
        value: "",
        status: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const numericValue = Number(formData.quantity)

    const totalValue = sales.reduce((total, sale) => total + sale.value, 0)

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (
            formData.name.trim() === "" ||
            formData.quantity.trim() === ""
        ) {
            alert("Preencha todos os dados antes de adicionar uma venda.");
            return;
        };

        const result = !isNaN(numericValue)
            ? numericValue % 2 === 0
                ? numericValue * 3
                : numericValue * 3 + 1
            : 0;
        const newSale = {
            name: formData.name,
            quantity: numericValue,
            value: result,
            status: '',
            paymentMethod: ''
        };
        setPendingSale(newSale);
        setShowPayment(true);
    }

    const confirmPayment = (status: string, method: string) => {
        if (!pendingSale) return;

        const completedSale = {
            ...pendingSale,
            status,
            paymentMethod: method,
        };

        setSales(prev => [...prev, completedSale]);
        setPendingSale(null);
        setFormData({ name: '', quantity: '', value: '', status: '' });
        setShowPayment(false);
    };

    const cancelPayment = () => {
        setPendingSale(null);
        setShowPayment(false);
    };


    return (
        <section className="main d-flex justify-content-around gap-5 gap-lg-0 pt-5 p-lg-5">

            <div className="sales-information mb-lg-5 mb-xxl-0">
                <form className="p-5">
                    <h1>Informações da venda</h1>
                    <p>Informe os dados da venda para solicitar o calculo. A venda será
                        calculada e movida para a lista de pedidos.</p>
                    <fieldset className="">
                        <legend>Nome do cliente</legend>
                        <input className="w-100 p-2" value={formData.name} type="text" id="expense" name="name" onChange={handleChange} />
                    </fieldset>
                    <fieldset className="pt-2">
                        <legend>Quantidade de trufas</legend>
                        <input
                            className="w-100 p-2"
                            type="text"
                            name="quantity"
                            value={formData.quantity}
                            id="quantity"
                            onChange={handleChange}
                            placeholder="0"
                        />
                    </fieldset>
                    <button onClick={handleSubmit} type="submit" className="w-100 mt-4 py-2"
                    >Adicionar venda</button>
                </form>
                {showPayment && pendingSale && (
                    <Payment onConfirm={confirmPayment} onCancel={cancelPayment} />
                )}
            </div>
            <aside className="sales-list w-100">
                <header className="px-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <p>
                            Minhas vendas -
                            <span> {sales.length} vendas</span>
                        </p>
                        <h2><small>R$</small>{totalValue.toFixed(2).replace(".", ",")}</h2>
                    </div>

                </header>
                <ul className="w-100 d-flex flex-column">
                    {sales.map((sale, index) => (
                        <SellCard key={index}
                            {...sale}
                            onDelete={() => handleDeleteClick(index)}
                        />
                    ))}
                </ul>
            </aside>
            {showWarning && saleToDeleteIndex !== null && (
                <Warning
                    name={sales[saleToDeleteIndex].name}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </section>
    )
}