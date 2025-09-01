import React, { useState } from "react";
import "../../views/main/main.css";
import { SellCard } from "../sell/sell";
import { Warning } from "../warning/warning";
import { ModalMonth } from "../modalMonth/modalMonth";

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
  handleCloseMonth: () => void;

  totalValue: number;
  searchText: string;
  setSearchText: (val: string) => void;
}


interface SellCardProps {
  _id?: string;
  date?: string;
  name: string;
  quantity: number;
  value: number;
  status: string;
  paymentMethod: string;
}

// 👉 Pega a data a partir do ObjectId do Mongo se a venda não tiver "date"
const objectIdToDate = (id?: string) => {
  if (!id) return null;
  try {
    const ts = parseInt(id.substring(0, 8), 16) * 1000; // segundos -> ms
    const utcDate = new Date(ts); // UTC

    // 🔹 Ajusta para o fuso horário de Brasília (UTC-3)
    const localDate = new Date(utcDate.getTime() - 3 * 60 * 60 * 1000);

    return localDate;
  } catch {
    return null;
  }
};

const now = new Date();

// verifica se hoje é dia 1
const isFirstDay = now.getDate() === 1;

// se for dia 1, pega mês anterior, senão pega mês atual
const targetDate = isFirstDay
  ? new Date(now.getFullYear(), now.getMonth() - 1, 1)
  : now;

const Month = targetDate.toLocaleString("default", { month: "long" });


// 🔹 Gera chave yyyy-mm-dd SEM NUNCA usar "agora" como fallback
const getDateKeyFromSale = (sale: SellCardProps) => {
  const base =
    (sale.date ? new Date(sale.date) : objectIdToDate(sale._id)) || null;

  if (!base) return "NO_DATE";

  // normaliza para meia-noite LOCAL
  const local = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  const y = local.getFullYear();
  const m = String(local.getMonth() + 1).padStart(2, "0");
  const d = String(local.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// 🔹 Agrupa por chave de data real e devolve já ORDENADO (mais recente primeiro)
const groupSalesByDate = (items: SellCardProps[]) => {
  const groups: Record<string, SellCardProps[]> = {};
  for (const s of items) {
    const key = getDateKeyFromSale(s);
    (groups[key] ||= []).push(s);
  }

  const keys = Object.keys(groups).sort((a, b) => {
    if (a === "NO_DATE") return 1;
    if (b === "NO_DATE") return -1;
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return keys.map((k) => [k, groups[k]] as const);
};

// 🔹 Rótulo "Hoje" / "Ontem" / data e trata "NO_DATE"
const renderDateLabel = (key: string) => {
  if (key === "NO_DATE") return "SEM DATA";

  const [year, month, day] = key.split("-").map(Number);
  const saleDate = new Date(year, month - 1, day); // meia-noite LOCAL

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (saleDate.getTime() === today.getTime()) return "Hoje";
  if (saleDate.getTime() === yesterday.getTime()) return "Ontem";

  return saleDate
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    .toUpperCase();
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
  handleCloseMonth,

}) => {
  const [showCloseMonthModal, setShowCloseMonthModal] = useState(false);


  return (
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

        <div className="filter d-flex align-content-center justify-content-between px-4 pb-3">
          <input
            className="filter-text w-75 px-2"
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

        <ul className="w-100 d-flex flex-column">
          {groupSalesByDate(filteredSales).map(([key, salesGroup]) => (
            <li key={key}>
              <div className="date-separator mb-2 px-3 py-1 fw-bold">
                {renderDateLabel(key)}
              </div>

              {salesGroup.map((sale) => (
                <SellCard
                  key={sale._id}
                  {...sale}
                  onDelete={() =>
                    handleDeleteClick(sales.findIndex((s) => s._id === sale._id))
                  }
                  onEdit={() => handleEditSale(sale)}
                />
              ))}
            </li>
          ))}
        </ul>

        <div className="close-month d-flex w-100 pt-2 px-4 justify-content-center">
          <button
            type="button"
            className="d-flex justify-content-center w-100 gap-1 align-items-center mt-4 py-2"
            onClick={() => setShowCloseMonthModal(true)}
          >
            Fechar o mês
          </button>
        </div>

        {showWarning && saleToDeleteIndex !== null && (
          <Warning
            name={sales[saleToDeleteIndex].name}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}

        {showCloseMonthModal && (

          <ModalMonth
            onConfirm={handleCloseMonth}
            onCancel={() => setShowCloseMonthModal(false)}
            Salemonth={Month[0].toUpperCase() + Month.slice(1)}
          />
        )}
      </aside>
    </section>
  );
}
