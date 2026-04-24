import React from 'react';
import { motion } from 'framer-motion';
import { FALLBACK_IMAGE } from '../services/config.js';
import { marketplaceProducts } from '../data/marketplaceData.js';

const MarketSection = () => {
  const scrollToMarket = () => {
    const marketElement = document.getElementById('market-grid');
    if (marketElement) {
      marketElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="market"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#eef8e8_0%,#d8ead1_45%,#c4dfbb_100%)] py-24"
    >
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-20 left-0 h-72 w-72 rounded-full bg-[#ffffff] blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-[#b7d6a6] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#f6edd2] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-[#9fb58a] bg-white/70 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-[#5f7650] shadow-sm backdrop-blur">
              Village Organic Market
            </span>
            <h2 className="mt-5 font-heading text-4xl font-bold text-[#213224] md:text-5xl">
              Fresh village goods, artisan-made essentials, and real organic flavor.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#4c5f49] md:text-lg">
              Explore a curated collection of local produce and handmade goods presented with a clean, earthy, mobile-friendly marketplace layout.
            </p>
          </div>

          <button
            onClick={scrollToMarket}
            className="inline-flex items-center justify-center rounded-full bg-[#49673d] px-8 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-[#49673d]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#395330]"
          >
            Explore Collection
          </button>
        </div>
        <div id="market-grid" className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {marketplaceProducts.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              whileHover={{ y: -8 }}
              className="group overflow-hidden rounded-[28px] border border-[#d7e5cf] bg-white/90 shadow-[0_18px_45px_rgba(92,122,81,0.14)] backdrop-blur-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#dce9d3]">
                <img
                  src={product.image}
                  alt={product.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute right-4 top-4 rounded-full bg-white/92 px-4 py-2 text-sm font-bold text-[#2c4327] shadow-md">
                  {product.marketSectionPrice}
                </div>
              </div>

              <div className="flex h-full flex-col p-6">
                <h3 className="font-heading text-xl font-bold text-[#253827]">{product.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-[#60725b]">{product.description}</p>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#78906b]">
                    Organic Choice
                  </span>
                  <button
                    type="button"
                    className="rounded-full bg-[#edf5e7] px-4 py-2 text-sm font-bold text-[#32512f] transition duration-300 hover:bg-[#49673d] hover:text-white"
                  >
                    {product.cta}
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketSection;
