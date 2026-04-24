import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = () => {
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1508873535684-257a3a991d1d?auto=format&fit=crop&q=80&w=1200",
      title: "Community Harvest Festival",
      date: "October 2023"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1200",
      title: "Sustainable Farming Workshop",
      date: "November 2023"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&q=80&w=1200",
      title: "New Solar Grid Installation",
      date: "December 2023"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1590059536060-639893382761?auto=format&fit=crop&q=80&w=1200",
      title: "Sustainable Irrigation Project",
      date: "January 2024"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const paginate = useCallback((newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [paginate]);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 py-16 overflow-hidden">
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="font-heading text-3xl font-bold text-dark-slate">
          Village <span className="text-brand-bright">Highlights</span>
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => paginate(-1)}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-dark-slate/10 hover:bg-natural-green hover:text-white transition-all duration-300"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => paginate(1)}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-dark-slate/10 hover:bg-natural-green hover:text-white transition-all duration-300"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="relative h-[300px] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl bg-dark-slate">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <img
              src={slides[currentIndex].image}
              alt={slides[currentIndex].title}
              className="w-full h-full object-cover pointer-events-none"
            />
            {/* Caption Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 bg-gradient-to-t from-black/80 to-transparent">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-brand-bright text-sm font-bold uppercase tracking-widest mb-2">{slides[currentIndex].date}</p>
                <h3 className="text-white text-2xl md:text-4xl font-heading font-bold">{slides[currentIndex].title}</h3>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center space-x-3 mt-8">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => { setDirection(index > currentIndex ? 1 : -1); setCurrentIndex(index); }}
            className={`h-2 transition-all duration-300 rounded-full ${index === currentIndex ? 'w-8 bg-brand-bright' : 'w-2 bg-gray-400/30 hover:bg-gray-400/50'}`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Carousel;