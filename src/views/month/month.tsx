import { useEffect, useState } from "react";
import { SelesMonth } from "../../components/salesMonth/salesMonth";
import "../main/main.css";
import axios from "axios";

interface MonthData {
  month: string;
  quantity: number;
  total: number;
}

export function Month() {
  const [months, setMonths] = useState<MonthData[]>([]);

  useEffect(() => {
    async function fetchMensal() {
      const res = await axios.get("https://trufapp-backend-6km2.onrender.com/mensal");
      setMonths(res.data);
    }

    fetchMensal();
  }, []);

  return (
    <section className="main d-flex justify-content-around gap-5 gap-lg-0 pt-5 p-lg-5">
      <aside className="sales-list d-none d-lg-block w-100">
        <header className="px-3">
          <div className="d-flex justify-content-between align-items-center">
            <p>Minhas vendas mensais</p>
          </div>
        </header>
        <ul className="w-100 d-flex flex-column">
          {months.map((item, index) => (
            <SelesMonth
              key={index}
              month={item.month}
              quantity={item.quantity}
              total={item.total}
            />
          ))}
        </ul>
      </aside>
    </section>
  );
}
