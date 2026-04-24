import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Hero from './Hero';
import Carousel from './Carousel';
import Marketplace from './MarketSection';
import JobBoard from './JobBoard';
import Announcements from './Announcements';
import AdminDashboard from './AdminDashboard';
import Footer from './Footer';
import Chatbot from './Chatbot';
import Register from './Register.jsx';
import Login from './Login.jsx';
import Community from './Community';
import Payment from './Payment';
import UserDashboard from './UserDashboard';
import ProductUploadForm from './ProductUploadForm.jsx';
import AdminJobApplications from './AdminJobApplications';
import PrivateRoute from './PrivateRoute.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import MarketplacePage from './Marketplace';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] via-[#c8e6d7] to-[#a8dcc4] text-gray-900 font-poppins selection:bg-green-600 selection:text-white">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Announcements />
                  <Carousel />
                  <Marketplace />
                  <JobBoard />
                </>
              } />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/market" element={<MarketplacePage />} />
              <Route path="/community" element={<Community />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
              <Route path="/upload-product" element={<PrivateRoute roles={['admin']}><ProductUploadForm /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/applications" element={<PrivateRoute roles={['admin']}><AdminJobApplications /></PrivateRoute>} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
