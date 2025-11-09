import { motion } from 'framer-motion';
import { useCtaModal } from './cta/CtaContext';
import { getFeatureFlags, getSettings } from '../store/content';

const StickyBottomButton = () => {
  const { openModal } = useCtaModal();
  const flags = getFeatureFlags();
  const settings = getSettings();
  if (!flags.enableStickyCta) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <motion.button
        onClick={openModal}
        className="w-full py-4 text-white font-bold text-lg shadow-2xl"
        style={{ background: 'linear-gradient(to right, #ff5722 0%, #4c1d95 50%, #ff5722 100%)' }}
        whileTap={{ scale: 0.98 }}
      >
        {settings.stickyCtaLabel}
      </motion.button>
    </div>
  );
};

export default StickyBottomButton;
