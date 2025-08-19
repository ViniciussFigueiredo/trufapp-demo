// backend/routes/saleRoutes.ts
import express from 'express';
import { Sale } from '../models/Sale';

const router = express.Router();

// Criar nova venda
router.post('/', async (req, res) => {
  try {
    const sale = new Sale(req.body);
    await sale.save();
    res.status(201).json(sale);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao salvar a venda' });
  }
});

// Listar todas as vendas
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar vendas' });
  }
});



export default router;
