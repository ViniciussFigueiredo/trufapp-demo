import "../main/main.css";
import React, { useEffect, useState } from "react";
import { SalesAside } from "../../components/asideSales/asideSale";
import { Filter } from "../../components/filter/filter";
import { Payment } from "../../components/payment/payment";

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
  const API_BASE = "https://trufapp-backend-6km2.onrender.com";

  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [saleToDeleteIndex, setSaleToDeleteIndex] = useState<number | null>(null);

  // NOVOS ESTADOS PARA MODAL DE EDIÇÃO
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  // Carrega as vendas da API ao montar o componente
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch(`${API_BASE}/sales`);
        const data = await res.json();
        setSales(data);
        setFilteredSales(data); // inicialmente sem filtro, exibe tudo
      } catch (error) {
        console.error("Erro ao buscar vendas:", error);
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
        method: "DELETE",
      });

      // Atualiza lista removendo a venda deletada
      const updatedSales = sales.filter((sale) => sale._id !== saleToDelete._id);
      setSales(updatedSales);

      // Atualiza a lista filtrada também, aplicando o filtro atual
      const updatedFilteredSales = filteredSales.filter(
        (_, idx) => idx !== saleToDeleteIndex
      );
      setFilteredSales(updatedFilteredSales);

      setShowWarning(false);
      setSaleToDeleteIndex(null);
    } catch (error) {
      console.error("Erro ao excluir venda:", error);
    }
  };

  // Cancela exclusão
  const cancelDelete = () => {
    setShowWarning(false);
    setSaleToDeleteIndex(null);
  };

  // FUNÇÃO QUE ABRE O MODAL DE EDIÇÃO
  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setShowPayment(true);
  };

  // CONFIRMA A EDIÇÃO, ATUALIZA O BACKEND E LISTA
  const confirmPayment = async (status: string, method: string) => {
    if (!editingSale) return;

    const updatedSale = { ...editingSale, status, paymentMethod: method };

    try {
      const res = await fetch(`${API_BASE}/sales/${updatedSale._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSale),
      });
      const data = await res.json();

      setSales((prev) =>
        prev.map((sale) => (sale._id === data._id ? data : sale))
      );

      // Atualiza a lista filtrada para refletir mudança
      setFilteredSales((prev) =>
        prev.map((sale) => (sale._id === data._id ? data : sale))
      );
    } catch (error) {
      console.error("Erro ao atualizar venda:", error);
    }

    setEditingSale(null);
    setShowPayment(false);
  };

  // CANCELA EDIÇÃO
  const cancelPayment = () => {
    setEditingSale(null);
    setShowPayment(false);
  };

  // Valor total das vendas
  const totalValue = sales.reduce(
    (acc, sale) => acc + Number(sale.value || 0),
    0
  );

  // dentro do MySales
  const [searchText, setSearchText] = useState("");

  // Atualiza a lista filtrada sempre que searchText ou sales mudarem
  useEffect(() => {
    const filtered = sales.filter((sale) =>
      sale.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredSales(filtered);
  }, [searchText, sales]);

  const handleCloseMonth = async () => {
    try {
      const res = await fetch(`${API_BASE}/fechar-mes`, { method: "POST" });
      const data = await res.json();

      if (data.report) {
        alert(`✅ Mês fechado com sucesso (${data.report.month})`);

        // Remove as vendas pagas da lista
        setSales((prev) => prev.filter((sale) => sale.status !== "Pago"));
        setFilteredSales((prev) =>
          prev.filter((sale) => sale.status !== "Pago")
        );
      } else {
        alert(data.message || "Nenhuma venda paga encontrada.");
      }
    } catch (err) {
      console.error("Erro ao fechar mês:", err);
      alert("Erro ao fechar mês");
    }
  };


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
        handleEditSale={handleEditSale}
        totalValue={totalValue}
        searchText={searchText}
        setSearchText={setSearchText}
        handleCloseMonth={handleCloseMonth}
      />

      {showFilterModal && (
        <Filter
          onApplyFilter={(filters) => {
            const filteredResult = sales.filter((sale) => {
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

      {showPayment && editingSale && (
        <Payment
          sale={editingSale}
          onConfirm={confirmPayment}
          onCancel={cancelPayment}
        />
      )}


    </>
  );
};