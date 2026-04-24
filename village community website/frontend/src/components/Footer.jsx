import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter, 
  MessageCircle, 
  X,
  CreditCard,
  Smartphone,
  Library,
  CheckCircle2
} from 'lucide-react';

const Footer = () => {
  const [modalType, setModalType] = useState(null); // 'terms' | 'privacy' | null

  const legalContent = {
    terms: {
      title: "Terms {'&'} Conditions",
      items: [
        "Users must provide accurate and truthful information at all times.",
        "The Village Hub platform is strictly for community use and local welfare.",
        "No misuse, illegal activity, or harassment of community members is permitted.",
        "Administrators reserve the right to remove any content that violates community standards."
      ]
    },
    privacy: {
      title: "Privacy Policy",
      items: [
        "Your personal data is सुरक्षित (secure) and protected by encryption.",
        "We never share your information with third parties without your explicit consent.",
        "Data is only used to improve local connectivity and support village commerce."
      ]
    }
  };

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "#", color: "hover:text-blue-500" },
    { icon: <Instagram size={20} />, href: "#", color: "hover:text-pink-500" },
    { icon: <Twitter size={20} />, href: "#", color: "hover:text-sky-400" },
    { icon: <Youtube size={20} />, href: "#", color: "hover:text-red-500" },
    { icon: <MessageCircle size={20} />, href: "https://wa.me/919876543210", color: "hover:text-green-500" },
  ];

  return (
    <footer className="relative bg-brand-dark text-white border-t border-white/10 pt-24 pb-12 overflow-hidden font-sans">
      {/* Ambient background glows for a futuristic feel */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-bright/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-bright/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Column 1: Platform */}
          <div>
            <div className="mb-6">
              <h2 className="font-heading text-2xl font-bold italic text-white">
                VILLAGE <span className="text-brand-bright">HUB</span>
              </h2>
            </div>
            <h3 className="font-heading text-sm uppercase tracking-widest font-bold mb-6 text-brand-bright">Platform</h3>
            <ul className="space-y-4 text-gray-300 font-bold font-sans">
              <li>
                <a href="#" className="hover:text-brand-bright hover:underline transition-colors">Our Vision</a>
                <p className="text-gray-400 text-sm mt-1">Empowering rural communities through digital connectivity and local opportunities.</p>
              </li>
              <li>
                <a href="#" className="hover:text-brand-bright hover:underline transition-colors">Digital Garden</a>
                <p className="text-gray-400 text-sm mt-1">A space to share knowledge, farming tips, and community ideas.</p>
              </li>
              <li>
                <a href="#" className="hover:text-brand-bright hover:underline transition-colors">Bio-Logistics</a>
                <p className="text-gray-400 text-sm mt-1">Efficient transport and delivery system for local goods and services.</p>
              </li>
            </ul>
          </div>

          {/* Column 2: Community */}
          <div>
            <h3 className="font-heading text-sm uppercase tracking-widest font-bold mb-6 text-brand-bright">Community</h3>
            <ul className="space-y-4 text-gray-300 font-bold font-sans">
              <li>
                <a href="#" className="hover:text-brand-bright hover:underline transition-colors">Discord</a>
                <p className="text-gray-400 text-sm mt-1">Join our community discussions and stay connected with villagers.</p>
              </li>
              <li>
                <a href="#" className="hover:text-brand-bright hover:underline transition-colors">Archives</a>
                <p className="text-gray-400 text-sm mt-1">Explore past updates, events, and important announcements.</p>
              </li>
              <li>
                <a href="#" className="hover:text-brand-bright hover:underline transition-colors">Network Map</a>
                <p className="text-gray-400 text-sm mt-1">View connections between farmers, sellers, and local services.</p>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div>
            <h3 className="font-heading text-sm uppercase tracking-widest font-bold mb-6 text-brand-bright">Follow Us</h3>
            <p className="text-gray-400 text-sm mb-6">Stay updated with our latest village events and harvesting seasons.</p>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  className={`p-3 bg-white/5 rounded-2xl border border-white/10 text-gray-300 transition-colors ${social.color}`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 4: Payments */}
          <div>
            <h3 className="font-heading text-sm uppercase tracking-widest font-bold mb-6 text-brand-bright">Payment Methods</h3>
            <p className="text-gray-400 text-sm mb-6">Secure transactions via Indian gateways.</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 border border-white/10 p-2 rounded-xl flex items-center gap-2 group hover:border-brand-bright transition-colors cursor-pointer">
                <Smartphone size={16} className="text-brand-bright" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">UPI / GPay</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-2 rounded-xl flex items-center gap-2 group hover:border-brand-bright transition-colors cursor-pointer">
                <CreditCard size={16} className="text-brand-bright" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Card</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-2 rounded-xl flex items-center gap-2 group hover:border-brand-bright transition-colors cursor-pointer">
                <Library size={16} className="text-brand-bright" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">NetBanking</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-2 rounded-xl flex items-center gap-2 group hover:border-brand-bright transition-colors cursor-pointer">
                <Smartphone size={16} className="text-brand-bright" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Paytm</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2 items-center opacity-50">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Google_Pay_%28GPay%29_Logo.svg" className="h-4 grayscale invert" alt="GPay" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/PhonePe_Logo.svg" className="h-4 grayscale invert" alt="PhonePe" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Visa_logo_2014.svg" className="h-2 grayscale invert" alt="Visa" />
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex space-x-8 text-sm text-gray-400 font-sans">
            <p>© {new Date().getFullYear()} Village Hub. Community Driven.</p>
          </div>
          
          <div className="flex space-x-6">
            {['Privacy', 'Terms'].map((item) => (
              <button 
                key={item}
                onClick={() => setModalType(item.toLowerCase())}
                className="text-xs text-gray-400 hover:text-brand-bright font-bold uppercase tracking-tighter transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legal Modals */}
      <AnimatePresence>
        {modalType && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-brand-dark border border-white/10 p-8 rounded-[2.5rem] max-w-lg w-full relative shadow-2xl"
            >
              <button 
                onClick={() => setModalType(null)}
                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors"
              >
                <X size={24} />
              </button>
              
              <h2 className="font-heading text-2xl font-bold italic text-white mb-6">
                {legalContent[modalType].title}
              </h2>
              
              <div className="space-y-4">
                {legalContent[modalType].items.map((text, i) => (
                  <div key={i} className="flex gap-3 text-gray-300">
                    <CheckCircle2 size={18} className="text-brand-bright flex-shrink-0 mt-1" />
                    <p className="text-sm font-medium leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;