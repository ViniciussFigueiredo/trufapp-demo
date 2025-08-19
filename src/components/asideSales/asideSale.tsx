import React, { useState, useEffect } from "react";
import "../../views/main/main.css";
import { SellCard } from "../sell/sell";
import { Warning } from "../warning/warning";

interface Props {
  sales: any[]; // lista completa de vendas
  showFilterModal: boolean;
  setShowFilterModal: (val: boolean) => void;
  showWarning: boolean;
  saleToDeleteIndex: number | null;
  handleDeleteClick: (index: number) => void;
  confirmDelete: () => void;
  cancelDelete: () => void;
  handleEditSale: (sale: any) => void;
  totalValue: number;
}

export const SalesAside: React.FC<Props> = ({
  sales,
  setShowFilterModal,
  showWarning,
  saleToDeleteIndex,
  handleDeleteClick,
  confirmDelete,
  cancelDelete,
  handleEditSale,
  totalValue,
}) => {
  const [searchText, setSearchText] = useState("");
  const [filteredSales, setFilteredSales] = useState(sales);

  // FILTRO DE TEXTO
  useEffect(() => {
    const lowerSearch = searchText.toLowerCase();
    setFilteredSales(
      sales.filter((sale) =>
        sale.name ? sale.name.toLowerCase().includes(lowerSearch) : false
      )
    );
  }, [searchText, sales]);

  // FORMATAÇÃO DE DATA
  const formatDate = (dateString: string) => {
    const date = new Date(dateString || new Date().toISOString());
    if (isNaN(date.getTime())) return "Data inválida";

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Hoje";
    if (date.toDateString() === yesterday.toDateString()) return "Ontem";

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    }).toUpperCase();
  };

  // AGRUPAMENTO POR DATA
  const groupSalesByDate = (salesList: any[]) => {
    return salesList.reduce((groups: { [key: string]: any[] }, sale) => {
      const dateKey = formatDate(sale.date);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(sale);
      return groups;
    }, {});
  };

  const groupedSales = groupSalesByDate(filteredSales);

  return (
    <section className="main d-flex justify-content-around gap-5 gap-lg-0 pt-5 p-lg-5">
      <aside className="sales-list w-100">
        {/* FILTRO DE TEXTO E BOTÃO DE FILTRO */}
        <div className="filter d-flex align-content-center mb-2 justify-content-between px-4 pb-2">
          <input
            type="text"
            placeholder="Pesquisar cliente..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="filter-text px-2"
          />
          <button
            type="button"
            onClick={() => setShowFilterModal(true)}
            className="d-flex gap-1 align-items-center p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#1A75FF"
              className="bi bi-filter-left"
              viewBox="0 0 16 16"
            >
              <path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
            </svg>
          </button>
        </div>

        {/* LISTA DE VENDAS AGRUPADAS */}
        <ul className="w-100 d-flex flex-column">
          {Object.entries(groupedSales).map(([date, salesGroup]) => (
            <React.Fragment key={date}>
              <div className="date-separator mb-2 px-3 py-1 fw-bold">{date}</div>
              {salesGroup.map((sale) => {
                const realIndex = sales.findIndex((s) => s._id === sale._id);
                return (
                  <SellCard
                    key={sale._id}
                    {...sale}
                    onDelete={() => handleDeleteClick(realIndex)}
                    onEdit={() => handleEditSale(sale)}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </ul>

        {/* WARNING DE EXCLUSÃO */}
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
};
