import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Package, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { API_URL } from '../services/config.js';

const ProductUploadForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Vegetables',
    sellerName: '',
    image: null,
    imageUrl: '',
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();

  const categories = ['Vegetables', 'Fruits', 'Dairy products', 'Grains', 'Handicrafts', 'Homemade items'];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFormData({ ...formData, image: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');
    setError('');

    if (!formData.image && !formData.imageUrl.trim()) {
      setError('Please upload an image or paste an image URL.');
      setUploading(false);
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'image' && !value) return;
      data.append(key, value);
    });

    try {
      const res = await axios.post(`${API_URL}/api/products`, data, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setMessage(res.data.message || 'Product listed successfully!');
      setTimeout(() => navigate('/#market'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="py-24 bg-[#e6f7e6] min-h-screen flex justify-center items-center font-sans">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-2xl border border-gray-100">
        <h2 className="text-3xl font-bold italic text-[#1a1a1a] mb-8 flex items-center gap-3">
          <Package className="text-natural-green" /> List New Product
        </h2>
        {message && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl flex items-center gap-2 font-bold"><CheckCircle2 size={20} /> {message}</div>}
        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl flex items-center gap-2 font-bold"><AlertCircle size={20} /> {error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="name" placeholder="Product Name" onChange={handleChange} required className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-natural-green outline-none" />
            <input type="number" name="price" placeholder="Price (₹)" onChange={handleChange} required className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-natural-green outline-none" />
          </div>
          <select name="category" onChange={handleChange} className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-natural-green outline-none">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="text" name="sellerName" placeholder="Seller Name" onChange={handleChange} required className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-natural-green outline-none" />
          <textarea name="description" placeholder="Product Description" rows="4" onChange={handleChange} required className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-natural-green outline-none"></textarea>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Or paste a public image URL (recommended on Vercel)"
            className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-natural-green outline-none"
          />
          <div className="border-2 border-dashed border-gray-200 p-8 rounded-2xl text-center cursor-pointer hover:border-natural-green transition-colors relative">
            <input type="file" name="image" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <Upload className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">{formData.image ? formData.image.name : 'Click or drag to upload product image'}</p>
          </div>
          <p className="text-sm text-gray-500">On Vercel, image URLs are more reliable than local file uploads because serverless storage is temporary.</p>
          <button type="submit" disabled={uploading} className="w-full bg-natural-green text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-50">
            {uploading ? 'Processing...' : 'Add to Marketplace'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductUploadForm;
