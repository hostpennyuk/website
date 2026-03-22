import { motion } from 'framer-motion';
import { useCtaModal } from './CtaContext';
import { FaArrowRight } from 'react-icons/fa';

const CtaFloating = () => {
  const { openModal } = useCtaModal();

  return (
    <div className="fixed right-4 bottom-24 lg:bottom-6 z-40">
      <motion.button
        onClick={openModal}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative group"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-25" />
        
        {/* Button */}
        <span className="relative flex items-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm sm:text-base rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all">
          <span className="hidden sm:inline">Get Free Quote</span>
          <span className="sm:hidden">Start Now</span>
          <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
        </span>
      </motion.button>
    </div>
  );
};

export default CtaFloating;
