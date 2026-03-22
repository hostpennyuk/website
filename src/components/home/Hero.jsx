import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCtaModal } from '../cta/CtaContext';
import VideoModal from '../video/VideoModal';
import { getFeatureFlags, getSettings, incMetric } from '../../store/content';
import { FaStar, FaCheckCircle, FaArrowRight, FaPlay } from 'react-icons/fa';

const Hero = () => {
  const letterSpacing = (text) => {
    return text.split('').map((char, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.025 }}
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

  // Trust badges
  const trustBadges = [
    '40+ Projects Shipped',
    '4.8/5 Founder Rating',
    '95% On-Time Delivery'
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 -left-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(255, 87, 34, 0.35) 0%, transparent 70%)' }}
        />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Urgency Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-xl border border-orange-500/30 px-4 py-2 rounded-full"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm font-semibold text-white/90">3 spots left for {new Date().toLocaleString('default', { month: 'long' })}</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-heading font-extrabold leading-[1.05] tracking-tight">
              <span className="block text-white">{letterSpacing('Your App.')}</span>
              <span className="block text-white">{letterSpacing('Your Vision.')}</span>
              <span className="block bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">{letterSpacing('Shipped Fast.')}</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-lg sm:text-xl text-gray-300 max-w-xl leading-relaxed"
            >
              We build <span className="text-white font-semibold">conversion-focused apps and websites</span> that turn visitors into paying customers — delivered in weeks, not months.
            </motion.p>

            {/* Trust Points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap gap-4"
            >
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-300">
                  <FaCheckCircle className="text-green-400 text-sm" />
                  <span className="text-sm font-medium">{badge}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <motion.button
                onClick={openModal}
                whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(255, 87, 34, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/25 overflow-hidden transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Free Consultation
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>

              {flags.enableVideoModal && (
                <motion.button
                  onClick={() => setVideoOpen(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-xl text-white rounded-xl font-semibold text-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <FaPlay className="text-sm ml-0.5" />
                  </div>
                  See How It Works
                </motion.button>
              )}
            </motion.div>

            {/* Social Proof Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="flex items-center gap-6 pt-4"
            >
              {/* Client Avatars */}
              <div className="flex -space-x-3">
                {['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
                  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
                ].map((src, i) => (
                  <img 
                    key={i}
                    src={src}
                    alt="Client"
                    className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover"
                  />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  +36
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                  <span className="text-white font-bold ml-1">4.8</span>
                </div>
                <span className="text-gray-400 text-sm">Trusted by 40+ founders</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Stats Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            {/* Main Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm font-medium">Project Progress</span>
                  <span className="text-green-400 text-sm font-semibold">On Track</span>
                </div>
                
                <div className="space-y-4">
                  {['Discovery & Planning', 'Design & Prototype', 'Development', 'Launch'].map((phase, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white font-medium">{phase}</span>
                        <span className="text-gray-400">{i < 3 ? '100%' : '75%'}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: i < 3 ? '100%' : '75%' }}
                          transition={{ duration: 1, delay: 1.5 + i * 0.2 }}
                          className={`h-full rounded-full ${i < 3 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-orange-400 to-orange-500'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">4-6</div>
                    <div className="text-xs text-gray-400">Weeks to MVP</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">24h</div>
                    <div className="text-xs text-gray-400">Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">10+</div>
                    <div className="text-xs text-gray-400">Senior Devs</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -top-4 -right-4 bg-gradient-to-br from-green-400 to-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-green-500/30"
            >
              ✓ 95% On-Time
            </motion.div>

            {/* Floating Tech Stack */}
            <motion.div
              animate={{ y: [0, 8, 0], x: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['⚛️', '🔷', '🟢', '🔶'].map((emoji, i) => (
                    <span key={i} className="text-lg">{emoji}</span>
                  ))}
                </div>
                <span className="text-white text-sm font-medium">Modern Tech Stack</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <VideoModal open={videoOpen} onClose={() => { setVideoOpen(false); }} youtubeId={settings.video?.youtubeId || 'Z3VopNZrkrs'} startSeconds={settings.video?.startSeconds ?? 6} />
      {videoOpen && incMetric('video_open')}
    </section>
  );
};

export default Hero;
