import React from "react";
import "../../views/main/main.css";
import { SellCard } from "../sell/sell";
import { Warning } from "../warning/warning";

interface Props {
  filteredSales: any[];
  sales: any[];
  showFilterModal: boolean;
  setShowFilterModal: (val: boolean) => void;
  showWarning: boolean;
  saleToDeleteIndex: number | null;
  handleDeleteClick: (index: number) => void;
  confirmDelete: () => void;
  cancelDelete: () => void;
  handleEditSale: (sale: any) => void;
  totalValue: number;
  searchText: string;
  setSearchText: (val: string) => void;
}

// 🔹 Função para formatar datas (igual Main)
const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const saleDate = new Date(date);
  saleDate.setHours(0, 0, 0, 0);

  if (saleDate.getTime() === today.getTime()) return "Hoje";
  if (saleDate.getTime() === yesterday.getTime()) return "Ontem";

  return saleDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  }).toUpperCase();
};

// 🔹 Agrupar vendas por data
const groupSalesByDate = (sales: any[]) => {
  const sorted = [...sales].sort(
    (a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
  );

  return sorted.reduce((acc: { [key: string]: any[] }, sale) => {
    const dateKey = formatDate(sale.date || new Date().toISOString());
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(sale);
    return acc;
  }, {});
};

export const SalesAside: React.FC<Props> = ({
  filteredSales,
  sales,
  setShowFilterModal,
  showWarning,
  saleToDeleteIndex,
  handleDeleteClick,
  confirmDelete,
  cancelDelete,
  handleEditSale,
  totalValue,
  searchText,
  setSearchText,
}) => (
  <section className="main d-flex justify-content-around gap-5 gap-lg-0 pt-5 p-lg-5">
    <aside className="sales-list w-100">
      <header className="px-3">
        <div className="d-flex justify-content-between align-items-center">
          <p>
            Minhas vendas - <span>{sales.length} vendas</span>
          </p>
          <h2>
            <small>R$</small>
            {totalValue.toFixed(2).replace(".", ",")}
          </h2>
        </div>
      </header>

      {/* 🔹 Campo de pesquisa + botão filtro */}
      <div className="filter d-flex align-content-center justify-content-between px-4 pb-3">
        <input
          className="filter-text px-2"
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Pesquisar cliente..."
        />
        <button
          type="button"
          onClick={() => setShowFilterModal(true)}
          className="d-flex gap-1 align-items-center p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#1A75FF" className="bi bi-filter-left" viewBox="0 0 16 16">
            <path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
          </svg>
        </button>
      </div>

      {/* 🔹 Lista de vendas agrupadas por data */}
      <ul className="w-100 d-flex flex-column">
        {Object.entries(groupSalesByDate(filteredSales)).map(([date, salesGroup]) => (
          <div key={date}>
            <div className="date-separator mb-2 px-3 py-1 fw-bold">
              {date}
            </div>
            {salesGroup.map((sale, index) => (
              <SellCard
                key={sale._id || index}
                {...sale}
                onDelete={() => handleDeleteClick(index)}
                onEdit={() => handleEditSale(sale)}
              />
            ))}
          </div>
        ))}
      </ul>


      {showWarning && saleToDeleteIndex !== null && (
        <Warning
          name={sales[saleToDeleteIndex].name}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </aside>
  </section>
);
