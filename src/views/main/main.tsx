import "./main.css"
import { SellCard } from "../../components/sell/sell"
import React, { useEffect, useState } from 'react';
import { Warning } from "../../components/warning/warning";
import { Payment } from "../../components/payment/payment";
import { Price } from "../../components/priceProduct/price";
import { Filter } from "../../components/filter/filter";


export const Main: React.FC = () => {


    interface SellCardProps {
        _id?: string;
        name: string;
        quantity: number;
        value: number;
        status: string;
        paymentMethod: string;
    }

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const res = await fetch('http://localhost:3001/sales');
                const data = await res.json();
                setSales(data);
            } catch (err) {
                console.error('Erro ao buscar vendas:', err);
            }
        };

        fetchSales();
    }, []);

    // ESTADOS GERAIS
    const [sales, setSales] = useState<SellCardProps[]>([]);
    const [pendingSale, setPendingSale] = useState<SellCardProps | null>(null);
    const [priceId, setPriceId] = useState<string | null>(null);

    const [priceValues, setPriceValues] = useState<{ price1: number; price2: number }>(() => {
        const saved = localStorage.getItem('priceValues');
        return saved ? JSON.parse(saved) : { price1: 0, price2: 0 };
    });

    /*const handleSavePrices = (prices: { price1: number; price2: number }) => {
        setPriceValues(prices);
        localStorage.setItem('priceValues', JSON.stringify(prices));
    };*/

    const [filters, setFilters] = useState({
        status: [] as string[],
        paymentMethods: [] as string[],
    });

    const [formData, setFormData] = useState({
        name: "",
        quantity: "",
        value: "",
        status: ""
    });



    const [saleToDeleteIndex, setSaleToDeleteIndex] = useState<number | null>(null);
    const [showWarning, setShowWarning] = useState(false);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showPayment, setShowPayment] = useState(false);



    // FUNÇÕES DE FORMULÁRIO
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const numericValue = Number(formData.quantity);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (
            formData.name.trim() === "" ||
            formData.quantity.trim() === ""
        ) {
            alert("Preencha todos os dados antes de adicionar uma venda.");
            return;
        }

        const result = !isNaN(numericValue)
            ? Math.floor(numericValue / 2) * priceValues.price2 + (numericValue % 2) * priceValues.price1
            : 0;

        const newSale = {
            name: formData.name,
            quantity: numericValue,
            value: result,
            status: '',
            price1: priceValues.price1,
            price2: priceValues.price2,
            paymentMethod: ''
        };

        setPendingSale(newSale);
        setShowPayment(true);
    };



    // FUNÇÕES DE PAGAMENTO
    const confirmPayment = async (status: string, method: string) => {
        if (!pendingSale) return;

        const completedSale = {
            ...pendingSale,
            status,
            paymentMethod: method,
        };

        try {
            const res = await fetch('http://localhost:3001/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(completedSale)
            });

            const savedSale = await res.json();
            setSales(prev => [...prev, savedSale]);
        } catch (err) {
            console.error('Erro ao salvar venda:', err);
        }

        setPendingSale(null);
        setFormData({ name: '', quantity: '', value: '', status: '' });
        setShowPayment(false);
    };




    // FUNÇÕES DE EXCLUSÃO
    const handleDeleteClick = (index: number) => {
        setSaleToDeleteIndex(index);
        setShowWarning(true);
    };

    const confirmDelete = async () => {
        if (saleToDeleteIndex !== null) {
            const saleToDelete = sales[saleToDeleteIndex];

            try {
                await fetch(`http://localhost:3001/sales/${saleToDelete._id}`, {
                    method: 'DELETE'
                });

                setSales(prev => prev.filter((_, index) => index !== saleToDeleteIndex));
            } catch (err) {
                console.error('Erro ao excluir venda:', err);
            }

            setSaleToDeleteIndex(null);
            setShowWarning(false);
        }
    };

    const cancelDelete = () => {
        setSaleToDeleteIndex(null);
        setShowWarning(false);
    };


    // FUNÇÕES DE FILTRO
    const filteredSales = sales.filter(sale => {
        const matchStatus = filters.status.length === 0 || filters.status.includes(sale.status);
        const matchMethod = filters.paymentMethods.length === 0 || filters.paymentMethods.includes(sale.paymentMethod);
        return matchStatus && matchMethod;
    });


    // VALOR TOTAL
    const totalValue = sales.reduce((total, sale) => total + sale.value, 0);

    function cancelPayment(): void {
        setPendingSale(null);
        setShowPayment(false);
    }

    const fetchPrices = async () => {
        try {
            const res = await fetch("http://localhost:3001/prices");
            const data = await res.json();
            setPriceValues({ price1: data.price1, price2: data.price2 });
            setPriceId(data._id);
        } catch (err) {
            console.error("Erro ao buscar preços:", err);
        }
    };

    fetchPrices();

    return (
        <section className="main d-flex justify-content-around gap-5 gap-lg-0 pt-5 p-lg-5">

            <div className="sales-information mb-lg-5 mb-xxl-0">
                <form className="p-5">
                    <div className="d-flex align-items-center justify-content-between">
                        <h1>Informações da venda</h1>
                        <button type="button" onClick={() => setShowPriceModal(true)} className="btn mb-2 d-flex align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
                                <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
                                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
                            </svg>
                        </button>
                    </div>
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
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            id="quantity"
                            onChange={handleChange}
                            min="1"
                            placeholder="0"
                        />
                    </fieldset>
                    <button onClick={handleSubmit} type="submit" className="button-form w-100 mt-4 py-2"
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
                <div className="filter d-flex align-content-center justify-content-end px-4 pb-2">
                    <button type="button" onClick={() => setShowFilterModal(true)} className="d-flex gap-1 align-items-center p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#1A75FF" className="bi bi-filter-left" viewBox="0 0 16 16">
                            <path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
                        </svg>
                        Filtrar
                    </button>
                </div>
                <ul className="w-100 d-flex flex-column">
                    {filteredSales.map((sale, index) => (
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

            {showPriceModal && (
                <Price
                    price1={priceValues.price1}
                    price2={priceValues.price2}
                    onClose={() => setShowPriceModal(false)}
                    onSave={async (newPrices) => {
                        setPriceValues(newPrices);

                        if (priceId) {
                            try {
                                const res = await fetch(`http://localhost:3001/prices/${priceId}`, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(newPrices),
                                });

                                const updated = await res.json();
                                setPriceValues({ price1: updated.price1, price2: updated.price2 });
                            } catch (err) {
                                console.error("Erro ao atualizar preços:", err);
                            }
                        }

                        setShowPriceModal(false);
                    }}
                />
            )}

            {showFilterModal && <Filter onApplyFilter={(selectedFilters) => setFilters(selectedFilters)} onClose={() => setShowFilterModal(false)} />}
        </section>
    )
}