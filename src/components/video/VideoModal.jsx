import { AnimatePresence, motion } from 'framer-motion';
import { incMetric } from '../../store/content';

const VideoModal = ({ open, onClose, youtubeId, startSeconds = 0 }) => {
  const url = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&start=${startSeconds}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Glow layers */}
          <div className="pointer-events-none absolute w-[75vw] max-w-4xl aspect-video">
            <div className="absolute -inset-2 rounded-2xl blur-2xl opacity-60" style={{background: 'linear-gradient(135deg, rgba(76,29,149,0.7), rgba(255,87,34,0.7))'}} />
            <div className="absolute -inset-6 rounded-3xl blur-3xl opacity-40" style={{background: 'radial-gradient(60% 60% at 20% 20%, rgba(76,29,149,0.7), transparent), radial-gradient(60% 60% at 80% 80%, rgba(255,87,34,0.7), transparent)'}} />
          </div>

          {/* Modal content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="relative w-[90vw] max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(76,29,149,0.5),0_0_40px_rgba(255,87,34,0.5)] ring-1 ring-white/10"
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src={url}
              title="HostPenny Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => incMetric('video_open')}
            />
            <button
              onClick={onClose}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs px-2 py-1 rounded"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;
