import React, { useState, useEffect } from 'react';
import { Users, Layout, ShieldAlert, TrendingUp, Trash2, XCircle, CheckCircle2, AlertCircle, PlusCircle, Edit, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../services/config.js';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const stats = [
    { label: "Active Villagers", value: users.length.toString(), icon: <Users />, color: "bg-futuristic-blue" },
    { label: "Market Listings", value: products.length.toString(), icon: <Layout />, color: "bg-natural-green" },
    { label: "App Growth", value: "+12%", icon: <TrendingUp />, color: "bg-futuristic-purple" },
  ];

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const usersRes = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(usersRes.data);

      const productsRes = await axios.get(`${API_URL}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(productsRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(err.response?.data?.message || 'Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await axios.delete(`${API_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: 'success', text: res.data.message });
      fetchAdminData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await axios.delete(`${API_URL}/api/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: 'success', text: res.data.message });
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-dark-slate">Loading admin dashboard...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div className="flex justify-center items-center h-screen text-red-500">Access Denied: You must be an admin.</div>;
  }

  return (
    <section id="admin" className="py-24 bg-brand-dark/5 text-white font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <h2 className="font-heading text-4xl font-bold italic text-white">Control <span className="text-brand-bright">Center</span></h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/admin/applications" className="bg-futuristic-blue text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-futuristic-blue/90 transition-all shadow-lg">
              <Briefcase size={20} /> Job Apps
            </Link>
            <Link to="/upload-product" className="bg-natural-green text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-natural-green/90 transition-all shadow-lg">
              <PlusCircle size={20} /> Add Product
            </Link>
          </div>
        </div>
        
        {message.text && (
          <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />} {message.text}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-brand-dark/5 border border-white/10 p-6 rounded-3xl shadow-sm">
              <div className={`w-12 h-12 ${stat.color.replace('futuristic-blue', 'brand-bright').replace('natural-green', 'brand-bright').replace('futuristic-purple', 'brand-bright')} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                {React.cloneElement(stat.icon, { size: 24, className: "text-white" })}
              </div>
              <p className="text-gray-400 text-sm font-sans mb-1 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-bold font-heading italic text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Management */}
          <div className="bg-brand-dark/5 border border-white/10 rounded-[2.5rem] p-8 overflow-hidden shadow-sm">
            <h3 className="text-xl font-bold italic text-white mb-6 flex items-center gap-2">
              <Users size={24} className="text-brand-bright" /> Manage Users
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u._id} className="text-gray-300">
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{u.username}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{u.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{u.role}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Product Management */}
        <div className="bg-brand-dark/5 border border-white/10 rounded-[2.5rem] p-8 overflow-hidden mt-8 shadow-sm">
          <h3 className="text-xl font-bold italic text-white mb-6 flex items-center gap-2">
            <Layout size={24} className="text-brand-bright" /> Manage Products
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Seller</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                    <tr key={p._id} className="text-gray-300">
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{p.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{p.category}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">₹{p.price} - {p.sellerName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                      <button
                        onClick={() => alert('Edit functionality coming soon!')}
                          className="text-brand-bright hover:text-brand-bright/80 transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Old Activity Log - can be removed or integrated */}
        {/* <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 overflow-hidden mt-8">
          <h3 className="text-xl font-bold mb-6">Recent Activity Log</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-natural-green" />
                  <p className="text-sm text-gray-300">New marketplace listing: "Fresh Organic Eggs" by John D.</p>
                </div>
                <span className="text-xs text-gray-500 font-mono">14:0{i} PM</span>
              </div>
            ))}
          </div>
        </div> */}

      </div>
    </section>
  );
};

export default AdminDashboard;
