import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  sellerName: { type: String, required: true },
  category: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);
