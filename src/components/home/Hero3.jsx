import { motion } from 'framer-motion';
import { FaPlay, FaStar } from 'react-icons/fa';
import { useCtaModal } from '../cta/CtaContext';
import { useState } from 'react';
import VideoModal from '../video/VideoModal';

const Hero3 = () => {
  const { openModal } = useCtaModal?.() ?? { openModal: () => {} };
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%)' }}>
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
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }}
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
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Rating Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center space-x-2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg"
            >
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-sm" />
                ))}
              </div>
              <span className="text-gray-700 font-semibold">4.8 (43)</span>
              <span className="text-gray-600 text-sm">Happy Clients & Rating</span>
            </motion.div>

            {/* Main Headline - three-line lockup */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight text-white">
              <span className="block">Turn</span>
              <span className="block">visitors to</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-fuchsia-300 to-white">
                customers.
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-lg md:text-xl text-white/90 max-w-xl"
            >
              Let us turn your website into a full-time sales machine working 24/7 for you. 
              We handle the tech – you handle the money.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                onClick={openModal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-purple-900 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Build my sales machine
              </motion.button>
              
              <motion.button
                onClick={() => setVideoOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-white/30 transition-all duration-300 border border-white/30"
              >
                Watch Video
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Animated Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square">
              {/* Floating Cards Animation */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [-5, 5, -5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-0 right-0 w-64 h-64 rounded-3xl shadow-2xl p-6 flex items-center justify-center bg-white"
              >
                <div className="text-center">
                  <div className="text-6xl font-bold text-purple-900">92%</div>
                  <div className="text-purple-800 text-lg">SEO Analysis</div>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 20, 0],
                  rotate: [5, -5, 5],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute bottom-0 left-0 w-64 h-64 bg-white/95 rounded-3xl shadow-2xl p-6 flex items-center justify-center border-4 border-white/50"
              >
                <div className="text-center">
                  <div className="text-6xl font-bold text-purple-900">95%</div>
                  <div className="text-purple-800 text-lg font-semibold">Optimization</div>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full flex items-center justify-center shadow-2xl bg-white"
              >
                <div className="text-center text-purple-900">
                  <div className="text-5xl font-bold">1+</div>
                  <div className="text-sm">Projects</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} youtubeId="Z3VopNZrkrs" startSeconds={6} />
    </section>
  );
};

export default Hero3;
