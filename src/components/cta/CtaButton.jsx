import { motion } from 'framer-motion';
import { useCtaModal } from './CtaContext';

const CtaButton = ({ label = "Let's Build Something Amazing", className = '' }) => {
  const { openModal } = useCtaModal();
  return (
    <motion.button
      onClick={openModal}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={
        `px-5 py-3 rounded-lg font-semibold text-white shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-orange-200 bg-gradient-to-r from-purple-800 via-pink-600 to-orange-500 hover:shadow-xl ${className}`
      }
    >
      {label}
    </motion.button>
  );
};

export default CtaButton;
