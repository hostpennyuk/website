import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCtaModal } from '../cta/CtaContext';
import VideoModal from '../video/VideoModal';
import { getFeatureFlags, getSettings, incMetric } from '../../store/content';

const Hero = () => {
  const letterSpacing = (text) => {
    return text.split('').map((char, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: index * 0.03 }}
        className="inline-block"
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ));
  };

  const { openModal } = useCtaModal?.() ?? { openModal: () => {} };
  const flags = getFeatureFlags();
  const settings = getSettings();
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #1e40af 0%, rgba(255,255,255,0.4) 50%, rgba(255,87,34,0.4) 100%)' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(255,87,34,0.2) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)' }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */
          }
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Top microcopy (no icons) */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center bg-white/80 backdrop-blur-md px-3 py-2 rounded-full shadow-lg text-xs sm:text-sm text-gray-700 font-semibold"
            >
              {settings.heroMicrocopy}
            </motion.div>

            {/* Main Headline with fixed line breaks (no word splitting) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-extrabold md:font-bold leading-[1.1] tracking-tight text-gray-900">
              <span className="block whitespace-nowrap">{letterSpacing(settings.hero?.[0] || 'Turn')}</span>
              <span className="block whitespace-nowrap">{letterSpacing(settings.hero?.[1] || 'visitors to')}</span>
              <span className="block whitespace-nowrap text-gradient">{letterSpacing(settings.hero?.[2] || 'customers')}</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-base sm:text-lg md:text-xl text-gray-700 max-w-xl font-semibold sm:font-medium"
            >
              Let us turn your website into a full-time sales machine working 24/7 for you. 
              We handle the tech – you handle the money.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <motion.button
                onClick={openModal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-4 py-3 sm:px-6 md:px-8 sm:py-4 text-sm sm:text-base md:text-lg"
              >
                {settings.primaryCtaLabel}
              </motion.button>

              {flags.enableVideoModal && (
              <motion.button
                onClick={() => setVideoOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-3 sm:px-6 md:px-8 sm:py-4 bg-white/80 backdrop-blur-md text-primary rounded-lg font-semibold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Watch Video
              </motion.button>
              )}
            </motion.div>
          </motion.div>

          {/* Right Content - Landing Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <motion.img
              src="/landing-design.png"
              alt="Automated growth machine illustration"
              className="w-full max-w-xl drop-shadow-2xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </div>
      <VideoModal open={videoOpen} onClose={() => { setVideoOpen(false); }} youtubeId={settings.video?.youtubeId || 'Z3VopNZrkrs'} startSeconds={settings.video?.startSeconds ?? 6} />
      {videoOpen && incMetric('video_open')}
    </section>
  );
};

export default Hero;
