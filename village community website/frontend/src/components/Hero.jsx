import { motion } from 'framer-motion';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden text-white">
      {/* Background Image with subtle animation */}
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1590059536060-639893382761?auto=format&fit=crop&q=80&w=1920"
          alt="Lush village farm"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay: Natural to Futuristic */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/80 via-brand-medium/50 to-brand-bright/60" />
      </motion.div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <motion.h1
          variants={itemVariants}
          className="font-heading text-4xl md:text-6xl lg:text-7xl font-extrabold italic leading-tight mb-4 drop-shadow-lg"
        >
          Empowering the <span className="text-brand-bright">Village Heart</span>
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="font-sans text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90"
        >
          Connecting our community with sustainable innovation and shared wisdom, bridging tradition with tomorrow.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          {/* Glassmorphism Button 1 */}
          <motion.button
            onClick={() => scrollToSection('market')}
            whileHover={{ scale: 1.05 }}
            className="bg-brand-bright text-white px-8 py-3 rounded-full font-heading font-bold shadow-lg transition-all duration-300 hover:bg-brand-medium cursor-pointer uppercase"
          >
            Explore Marketplace
          </motion.button>
          {/* Glassmorphism Button 2 */}
          <motion.button
            onClick={() => scrollToSection('jobs')}
            whileHover={{ scale: 1.05 }}
            className="bg-transparent border-2 border-brand-bright text-brand-bright px-8 py-3 rounded-full font-heading font-bold shadow-lg transition-all duration-300 hover:bg-brand-bright hover:text-white cursor-pointer uppercase"
          >
            View Job Board
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;