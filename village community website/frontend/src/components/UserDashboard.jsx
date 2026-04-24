import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShoppingBag, Briefcase, User, TrendingUp, Home } from 'lucide-react';
import { API_BASE_URL } from '../services/config.js';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch orders
      const ordersResponse = await fetch(`${API_BASE_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      }

      // Fetch jobs
      const jobsResponse = await fetch(`${API_BASE_URL}/jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    { icon: ShoppingBag, label: 'Total Orders', value: orders.length, color: 'from-blue-400 to-blue-600' },
    { icon: Briefcase, label: 'Job Applications', value: jobs.length, color: 'from-green-400 to-green-600' },
    { icon: TrendingUp, label: 'Account Balance', value: '$0.00', color: 'from-purple-400 to-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] via-[#c8e6d7] to-[#a8dcc4] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0f3d2e] to-[#38b48b] mb-2 font-heading">
              Welcome, {user?.username}! 👋
            </h1>
            <p className="text-gray-600 font-medium text-lg">Here's your Village Hub dashboard</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold font-heading flex items-center gap-2 transition"
          >
            <LogOut size={20} />
            Logout
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 border border-green-100 hover:shadow-2xl transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-medium mb-1 font-heading">{stat.label}</p>
                  <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0f3d2e] to-[#38b48b]">
                    {stat.value}
                  </p>
                </div>
                <div className={`bg-gradient-to-r ${stat.color} p-4 rounded-xl`}>
                  <stat.icon className="text-white" size={32} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-4 border-b border-green-200 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Home },
              { id: 'orders', label: 'My Orders', icon: ShoppingBag },
              { id: 'applications', label: 'Job Applications', icon: Briefcase },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-bold font-heading uppercase text-sm transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-green-500'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8 border border-green-100">
                <h3 className="text-2xl font-bold text-[#0f3d2e] mb-4 font-heading">Profile Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Name:</span>
                    <span className="font-bold text-gray-800">{user?.username}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Email:</span>
                    <span className="font-bold text-gray-800">{user?.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600 font-medium">Account Type:</span>
                    <span className={`font-bold px-3 py-1 rounded-full text-white ${
                      user?.role === 'admin' ? 'bg-purple-600' : 'bg-green-600'
                    }`}>
                      {user?.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8 border border-green-100">
                <h3 className="text-2xl font-bold text-[#0f3d2e] mb-4 font-heading">Quick Actions</h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/market')}
                    className="w-full bg-gradient-to-r from-[#0f3d2e] to-[#38b48b] text-white py-3 rounded-xl font-bold font-heading uppercase transition hover:shadow-lg"
                  >
                    🛍️ Browse Marketplace
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/#jobs')}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-bold font-heading uppercase transition hover:shadow-lg"
                  >
                    💼 View Job Listings
                  </motion.button>
                  {user?.role === 'admin' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/admin')}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 rounded-xl font-bold font-heading uppercase transition hover:shadow-lg"
                    >
                      👑 Admin Panel
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8 border border-green-100">
              <h3 className="text-2xl font-bold text-[#0f3d2e] mb-6 font-heading">Your Orders</h3>
              {loading ? (
                <p className="text-gray-600 text-center py-8">Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-4">No orders yet</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate('/market')}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-bold transition"
                  >
                    Start Shopping
                  </motion.button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-green-200">
                        <th className="text-left py-4 font-heading text-gray-700">Order ID</th>
                        <th className="text-left py-4 font-heading text-gray-700">Date</th>
                        <th className="text-left py-4 font-heading text-gray-700">Total</th>
                        <th className="text-left py-4 font-heading text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-b border-gray-200 hover:bg-green-50 transition">
                          <td className="py-4 font-medium">{order._id}</td>
                          <td className="py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 font-bold text-green-600">${order.total}</td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-white font-bold text-sm ${
                              order.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8 border border-green-100">
              <h3 className="text-2xl font-bold text-[#0f3d2e] mb-6 font-heading">Job Applications</h3>
              {loading ? (
                <p className="text-gray-600 text-center py-8">Loading applications...</p>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-4">No job applications yet</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate('/#jobs')}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-bold transition"
                  >
                    View Jobs
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job._id} className="border border-green-200 rounded-xl p-4 hover:shadow-lg transition">
                      <h4 className="font-bold text-lg text-[#0f3d2e] font-heading">{job.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{job.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-green-600 font-bold">{job.salary}</span>
                        <span className={`px-3 py-1 rounded-full text-white font-bold text-sm ${
                          job.status === 'applied' ? 'bg-green-600' : 'bg-gray-400'
                        }`}>
                          {job.status === 'applied' ? 'Applied' : 'Available'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;
