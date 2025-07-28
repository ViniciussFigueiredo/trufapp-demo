import { useState, useEffect } from 'react';
import './price.css';

interface PriceProps {
  onClose: () => void;
  price1: number;
  price2: number;
  onSave: (prices: { price1: number; price2: number }) => void;
}

export function Price({ price1, price2, onClose, onSave }: PriceProps) {
  const [localPrice1, setLocalPrice1] = useState(price1.toString());
  const [localPrice2, setLocalPrice2] = useState(price2.toString());

  useEffect(() => {
    setLocalPrice1(price1.toString());
    setLocalPrice2(price2.toString());
  }, [price1, price2]);

  return (
    <div className="modal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Digite os preços dos produtos</h5>
            <button onClick={onClose} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body d-flex gap-2">
            <fieldset>
              <legend>1 por</legend>
              <input
                type="text"
                value={localPrice1}
                onChange={(e) => setLocalPrice1(e.target.value)}
                placeholder="0"
              />
            </fieldset>
            <fieldset>
              <legend>2 por</legend>
              <input
                type="text"
                value={localPrice2}
                onChange={(e) => setLocalPrice2(e.target.value)}
                placeholder="0"
              />
            </fieldset>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            <button
              type="button"
              onClick={() => {
                onSave({
                  price1: Number(localPrice1),
                  price2: Number(localPrice2),
                });
                onClose();
              }}
              className="btn btn-primary"
            >
              Salvar alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
