import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URL || '')
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => console.error('Erro ao conectar MongoDB:', err));

// --- Schema e Modelo de Vendas ---
const saleSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  value: Number,
  price1: Number,
  price2: Number,
  status: String,
  paymentMethod: String,
  createdAt: { type: Date, default: Date.now }
});

const Sale = mongoose.model('Sale', saleSchema);

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

// Preços
app.get('/prices', async (_, res) => {
  let prices = await Price.findOne();
  if (!prices) {
    // Cria preços padrão caso não exista
    prices = new Price();
    await prices.save();
  }
  res.json(prices);
});

app.put('/prices/:id', async (req, res) => {
  const updatedPrice = await Price.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedPrice);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
