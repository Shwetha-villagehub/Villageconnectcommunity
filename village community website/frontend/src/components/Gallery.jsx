import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FALLBACK_IMAGE, resolveMediaUrl } from '../services/config.js';

const Gallery = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch(`${API_URL}/api/media`);
        const data = await response.json();
        setMediaItems(data);
      } catch (err) {
        console.error('Failed to fetch gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading digital garden...</div>;

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {mediaItems.map((item, index) => (
          <motion.div
            key={item._id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="relative group rounded-3xl overflow-hidden bg-white/5 border border-white/10"
          >
            {item.type === 'video' ? (
              <video 
                src={resolveMediaUrl(item.url)} 
                className="w-full h-auto"
                onMouseEnter={e => e.target.play()}
                onMouseLeave={e => { e.target.pause(); e.target.currentTime = 0; }}
                muted
                loop
              />
            ) : (
              <img
                src={resolveMediaUrl(item.url)}
                alt="Village life"
                className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
               <p className="text-white text-sm font-sans">{item.name || 'Community Moment'}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
