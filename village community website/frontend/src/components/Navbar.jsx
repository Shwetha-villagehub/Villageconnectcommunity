import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'Market', href: '/market' },
    { name: 'Jobs', href: '/#jobs' },
    { name: 'Alerts', href: '/#alerts' },
    { name: 'Community', href: '/community' },
    { name: 'Payments', href: '/payment' },
    ...(user && user.role === 'admin' ? [{ name: 'Admin Panel', href: '/admin' }] : []),
    ...(user ? [{ name: 'Dashboard', href: '/dashboard' }] : []),
    ...(!user ? [{ name: 'Login', href: '/login' }] : []),
    ...(!user ? [{ name: 'Register', href: '/register' }] : []),
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-dark border-b border-white/10 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <span className="font-heading text-2xl font-bold italic text-white tracking-wider">
              VILLAGE <span className="text-brand-bright">HUB</span>
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-brand-bright px-3 py-2 rounded-md text-sm font-bold transition-colors duration-300 font-heading uppercase"
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 hover:scale-105 text-white px-6 py-2 rounded-full text-sm font-heading font-bold transition-all duration-300"
                >
                  Logout
                </button>
              ) : (
                <Link to="/register" className="bg-brand-bright hover:bg-brand-medium hover:scale-105 text-white px-6 py-2 rounded-full text-sm font-heading font-bold shadow-md transition-all duration-300 uppercase">
                  Join Network
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-brand-dark/95 backdrop-blur-2xl border-b border-white/10 px-4 pt-2 pb-6"
          >
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-brand-bright block px-3 py-4 border-b border-white/5 text-lg font-bold italic font-sans"
                >
                  {link.name}
                </Link>
              ))}
              {user && (
                <button
                  onClick={logout}
                  className="w-full text-left text-red-400 hover:text-red-500 block px-3 py-4 text-lg font-medium font-sans"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
