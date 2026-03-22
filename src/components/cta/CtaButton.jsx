import { motion } from 'framer-motion';
import { useCtaModal } from './CtaContext';
import { FaArrowRight } from 'react-icons/fa';

const CtaButton = ({ label = "Get Free Consultation", className = '', showArrow = true, variant = 'primary' }) => {
  const { openModal } = useCtaModal();
  
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-red-500 text-white shadow-lg shadow-orange-500/25',
    secondary: 'bg-white/10 backdrop-blur-xl text-white border border-white/20 hover:bg-white/20',
    dark: 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg hover:from-slate-800 hover:to-slate-700'
  };
  
  return (
    <motion.button
      onClick={openModal}
      whileHover={{ scale: 1.03, boxShadow: variant === 'primary' ? '0 20px 40px rgba(255, 87, 34, 0.3)' : undefined }}
      whileTap={{ scale: 0.98 }}
      className={
        `group relative px-6 py-3.5 rounded-xl font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-200/50 ${variants[variant]} ${className}`
      }
    >
      <span className="flex items-center gap-2">
        {label}
        {showArrow && <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />}
      </span>
    </motion.button>
  );
};

export default CtaButton;
