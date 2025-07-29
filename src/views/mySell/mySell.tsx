// src/views/mySell/mySell.tsx
import "../main/main.css"
import React, { useEffect, useState } from 'react';
import { SalesAside } from '../../components/asideSales/asideSale';
import { Filter } from "../../components/filter/filter";

interface Sale {
    _id: string;
    name: string;
    quantity: number;
    value: number;
    status: string;
    paymentMethod: string;
    price?: number; // caso use price
}

export const MySales: React.FC = () => {
    const API_BASE = 'https://trufapp-backend-6km2.onrender.com';

    const [sales, setSales] = useState<Sale[]>([]);
    const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [saleToDeleteIndex, setSaleToDeleteIndex] = useState<number | null>(null);

    // Carrega as vendas da API ao montar o componente
    useEffect(() => {
        const fetchSales = async () => {
            try {
                const res = await fetch(`${API_BASE}/sales`);
                const data = await res.json();
                setSales(data);
                setFilteredSales(data); // inicialmente sem filtro, exibe tudo
            } catch (error) {
                console.error('Erro ao buscar vendas:', error);
            }
        };
        fetchSales();
    }, []);

    // Função para lidar com clique para deletar
    const handleDeleteClick = (index: number) => {
        setSaleToDeleteIndex(index);
        setShowWarning(true);
    };

    // Confirma exclusão e atualiza estados e API
    const confirmDelete = async () => {
        if (saleToDeleteIndex === null) return;

        try {
            const saleToDelete = filteredSales[saleToDeleteIndex];
            await fetch(`${API_BASE}/sales/${saleToDelete._id}`, {
                method: 'DELETE',
            });

            // Atualiza lista removendo a venda deletada
            const updatedSales = sales.filter(sale => sale._id !== saleToDelete._id);
            setSales(updatedSales);

            // Atualiza a lista filtrada também, aplicando o filtro atual
            const updatedFilteredSales = filteredSales.filter((_, idx) => idx !== saleToDeleteIndex);
            setFilteredSales(updatedFilteredSales);

            setShowWarning(false);
            setSaleToDeleteIndex(null);
        } catch (error) {
            console.error('Erro ao excluir venda:', error);
        }
    };

    // Cancela exclusão
    const cancelDelete = () => {
        setShowWarning(false);
        setSaleToDeleteIndex(null);
    };

    // Exemplo simples para calcular valor total baseado no array "sales"
    const totalValue = sales.reduce((acc, sale) => acc + Number(sale.value || 0), 0);

    return (
        <>
            <SalesAside
                filteredSales={filteredSales}
                sales={sales}
                showFilterModal={showFilterModal}
                setShowFilterModal={setShowFilterModal}
                showWarning={showWarning}
                saleToDeleteIndex={saleToDeleteIndex}
                handleDeleteClick={handleDeleteClick}
                confirmDelete={confirmDelete}
                cancelDelete={cancelDelete}
                totalValue={totalValue}
            />
            {showFilterModal && (
                <Filter
                    onApplyFilter={(filters) => {
                        const filteredResult = sales.filter(sale => {
                            const statusMatch = filters.status?.length
                                ? filters.status.includes(sale.status)
                                : true;
                            const paymentMatch = filters.paymentMethods?.length
                                ? filters.paymentMethods.includes(sale.paymentMethod)
                                : true;
                            return statusMatch && paymentMatch;
                        });

                        setFilteredSales(filteredResult);
                        setShowFilterModal(false);
                    }}
                    onClose={() => setShowFilterModal(false)}
                />

            )}
        </>
    );

};
