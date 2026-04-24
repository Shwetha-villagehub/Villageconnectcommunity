import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star } from 'lucide-react';
import { FALLBACK_IMAGE } from '../services/config.js';
import { marketplaceCategories, marketplaceProducts } from '../data/marketplaceData.js';

const Marketplace = () => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [products] = useState(marketplaceProducts);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Grains', 'Handicrafts', 'Homemade items'];

  useEffect(() => {
    setLoading(false);
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      (filter === 'All' || product.category === filter) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (productName) => {
    alert(`${productName} added to cart!`);
  };

  const handleBuyNow = (productName) => {
    const confirmPurchase = window.confirm(`Would you like to proceed to checkout for ${productName}?`);
    if (confirmPurchase) {
      alert(`Order placed for ${productName}! Connecting you with the seller.`);
    }
  };

  return (
    <section id="market" className="py-24 bg-transparent text-white font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div className="max-w-xl">
            <h2 className="font-heading text-4xl md:text-5xl font-bold italic text-white mb-4">
              Village <span className="text-brand-bright">Direct</span> Marketplace
            </h2>
            <p className="text-gray-600">
              Discover authentic products crafted and grown with love by our local community members.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert('Redirecting to Seller Dashboard... (Feature coming soon)')}
            className="bg-brand-bright text-white px-8 py-4 rounded-2xl font-heading font-bold shadow-xl hover:shadow-brand-bright/40 hover:bg-brand-medium transition-all flex items-center gap-2 uppercase"
          >
            + Start Selling
          </motion.button>
        </div>

        <div className="bg-brand-dark/80 backdrop-blur-xl border border-white/10 p-4 rounded-[2rem] shadow-lg mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search local products..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-brand-bright transition-all outline-none text-white"
            />
          </div>

          <div className="flex overflow-x-auto w-full md:w-auto gap-2 pb-2 md:pb-0 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                  filter === category
                    ? 'bg-brand-bright text-white shadow-md'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-heading text-2xl font-bold italic text-white uppercase">
              Shop by <span className="text-brand-bright">Category</span>
            </h3>
            <button onClick={() => setFilter('All')} className="text-sm font-bold text-brand-bright hover:underline">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {marketplaceCategories.map((category) => (
              <motion.div
                key={category.name}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setFilter(category.name)}
                className={`cursor-pointer group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border-2 ${
                  filter === category.name ? 'border-brand-bright ring-4 ring-brand-bright/10' : 'border-transparent'
                }`}
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
                <div className="p-5 text-center bg-white">
                  <h4 className={`font-heading text-xs font-black uppercase tracking-widest ${filter === category.name ? 'text-brand-bright' : 'text-gray-700'}`}>
                    {category.name}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-natural-green border-solid"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={product.id}
                  whileHover={{ y: -10 }}
                  className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-green-100"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-md text-[#1a1a1a] text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-wider shadow-sm">
                        {product.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 bg-natural-green text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                      <Star size={12} fill="currentColor" /> {product.rating}
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-xl font-bold italic text-[#1a1a1a] mb-1 group-hover:text-brand-bright transition-colors">{product.name}</h3>
                    <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
                      By <span className="font-bold text-gray-600">{product.seller}</span>
                    </p>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-2xl font-black text-[#1a1a1a] tracking-tighter">{product.price}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAddToCart(product.name)}
                        className="flex-1 bg-emerald-100 text-emerald-800 font-bold py-3 rounded-xl hover:bg-emerald-200 transition text-sm"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleBuyNow(product.name)}
                        className="flex-1 bg-brand-bright text-white font-bold py-3 rounded-xl hover:bg-brand-medium transition text-sm shadow-md"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default Marketplace;
