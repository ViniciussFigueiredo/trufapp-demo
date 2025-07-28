
import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  value: { type: Number, required: true },
  status: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Sale = mongoose.model('Sale', saleSchema);
