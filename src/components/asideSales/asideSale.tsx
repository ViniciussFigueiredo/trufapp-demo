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
  handleEditSale: (sale: any) => void; // NOVA PROPS PARA ABRIR MODAL
  totalValue: number;
}

export const SalesAside: React.FC<Props> = ({
  filteredSales,
  sales,
  setShowFilterModal,
  showWarning,
  saleToDeleteIndex,
  handleDeleteClick,
  confirmDelete,
  cancelDelete,
  handleEditSale, // RECEBE FUNÇÃO DE EDIÇÃO
  totalValue,
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
      <div className="filter d-flex align-content-center justify-content-end px-4 pb-2">
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
          Filtrar
        </button>
      </div>
      <ul className="w-100 d-flex flex-column">
        {filteredSales.map((sale, index) => (
          <SellCard
            key={index}
            {...sale}
            onDelete={() => handleDeleteClick(index)}
            onEdit={() => handleEditSale(sale)} // BOTÃO EDIT QUE ABRE MODAL
          />
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
