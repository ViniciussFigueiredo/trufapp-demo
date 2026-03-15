import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { Sale } from './models/Sale.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URL || '')
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => console.error('Erro ao conectar MongoDB:', err));

// --- Schema e Modelo de Relatórios Mensais ---
const mensalSchema = new mongoose.Schema({
  month: String,
  quantity: Number,
  total: Number,
  date: { type: Date, default: Date.now }
});

const Mensal = mongoose.model('Mensal', mensalSchema);

// --- Schema e Modelo de Preços ---
const priceSchema = new mongoose.Schema({
  price1: { type: Number, default: 0 },
  price2: { type: Number, default: 0 },
});

const Price = mongoose.model('Price', priceSchema);

// --- Rotas ---

// Vendas
app.get('/sales', async (_, res) => {
  const sales = await Sale.find();
  res.json(sales);
});

app.post('/sales', async (req, res) => {
  const sale = new Sale(req.body);
  await sale.save();
  res.status(201).json(sale);
});

app.put('/sales/:id', async (req, res) => {
  const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(sale);
});

app.delete('/sales/:id', async (req, res) => {
  await Sale.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Relatório mensal
app.post('/fechar-mes', async (_, res) => {
  try {
    const result = await fecharMensal();
    res.json(result);
  } catch (err) {
    console.error("❌ Erro ao fechar mês:", err);
    res.status(500).json({ error: "Erro ao fechar mês" });
  }
});

app.post('/mensal', async (req, res) => {
  const { total, date, quantity, month } = req.body;
  const report = new Mensal({ total, date, quantity, month });
  await report.save();
  res.status(201).json(report);
});

app.get('/mensal', async (_, res) => {
  const reports = await Mensal.find().sort({ date: -1 });

  const formatted = reports.map(r => ({
    month: r.month,     // sempre pega do banco
    quantity: r.quantity,
    total: r.total,
  }));

  res.json(formatted);
});


// Preços
app.get('/prices', async (_, res) => {
  let prices = await Price.findOne();
  if (!prices) {
    prices = new Price();
    await prices.save();
  }
  res.json(prices);
});

app.put('/prices/:id', async (req, res) => {
  const updatedPrice = await Price.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedPrice);
});

app.get('/test-mensal', async (_, res) => {
  try {
    const result = await fecharMensal(); // agora a função retorna algo
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao executar fechamento mensal" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

// --- CRON: Executa todo dia 1º às 00:00 ---
cron.schedule('0 0 1 * *', async () => {
  try {
    console.log("⏳ Rodando rotina mensal...");

    const paidSales = await Sale.find({ status: 'Pago' });

    if (paidSales.length === 0) {
      console.log("ℹ️ Nenhuma venda paga encontrada.");
      return;
    }

    const total = paidSales.reduce((acc, sale) => acc + sale.value, 0);
    const quantity = paidSales.reduce((acc, sale) => acc + sale.quantity, 0);
    const monthName = new Date().toLocaleString('pt-BR', { month: 'long' });

    // Salva diretamente no Mongo (sem http.request)
    const report = new Mensal({
      total,
      quantity,
      month: monthName,
      date: new Date()
    });
    await report.save();

    // Remove vendas já consolidadas
    await Sale.deleteMany({ status: 'Pago' });

    console.log(`✅ Consolidado mensal (${monthName}) criado e vendas pagas removidas.`);
  } catch (error) {
    console.error('❌ Erro na rotina mensal:', error);
  }
}, {
  timezone: "America/Sao_Paulo"
});

// --- Função que consolida relatório mensal ---
async function fecharMensal() {
  try {
    const paidSales = await Sale.find({ status: 'Pago' });

    if (paidSales.length === 0) {
      console.log("ℹ️ Nenhuma venda paga encontrada.");
      return { message: "Nenhuma venda paga encontrada." };
    }

    const total = paidSales.reduce((acc, sale) => acc + sale.value, 0);
    const quantity = paidSales.reduce((acc, sale) => acc + sale.quantity, 0);
    const monthName = new Date().toLocaleString('pt-BR', { month: 'long' });

    const report = new Mensal({
      total,
      quantity,
      month: monthName,
      date: new Date(),
    });

    await report.save();
    await Sale.deleteMany({ status: "Pago" });

    console.log(`✅ Consolidado mensal criado (${monthName}).`);
    return { message: `Consolidado mensal criado (${monthName})`, report };
  } catch (error) {
    console.error("❌ Erro no fechamento mensal:", error);
    return { error: "Erro no fechamento mensal" };
  }
}