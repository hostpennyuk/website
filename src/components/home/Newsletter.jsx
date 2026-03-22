import { motion } from 'framer-motion';
import { FaPaperPlane, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { useState } from 'react';
import { addSubscriberAsync, getSettings } from '../../store/content';
import { useCtaModal } from '../cta/CtaContext';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { openModal } = useCtaModal?.() ?? { openModal: () => {} };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await addSubscriberAsync(email, window.location.href);
    try {
      const { subscribeEndpoint } = getSettings();
      if (subscribeEndpoint) {
        await fetch(subscribeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, source: window.location.href }),
        });
      }
    } catch {}
    setEmail('');
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 shadow-2xl shadow-orange-500/20 relative overflow-hidden"
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl" />

            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  <span className="text-white text-sm font-semibold">Limited Spots Available</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
                  Ready to Build Your 
                  <span className="block">Sales Machine?</span>
                </h2>

                <p className="text-white/90 text-lg">
                  Book a free 30-minute consultation. We will review your idea and give you an honest assessment - no sales pitch, just value.
                </p>

                <div className="space-y-3">
                  {['Free project scoping', 'Honest timeline estimate', 'No obligation'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-white">
                      <FaCheckCircle className="text-white/90" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  onClick={openModal}
                  whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  className="group w-full sm:w-auto px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-2"
                >
                  Get Free Consultation
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>

              {/* Right Content - Newsletter */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaPaperPlane className="text-white text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Get Growth Tips</h3>
                  <p className="text-white/80 text-sm">Join 2,000+ founders getting weekly insights on shipping faster and converting better.</p>
                </div>

                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Subscribing...' : 'Subscribe Free'}
                    </button>
                    <p className="text-white/60 text-xs text-center">No spam. Unsubscribe anytime.</p>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <FaCheckCircle className="text-white text-3xl mx-auto mb-2" />
                    <p className="text-white font-semibold">You are in! Check your inbox.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-8 mt-12 flex-wrap"
          >
            {[
              { value: '24h', label: 'Response Time' },
              { value: '$0', label: 'Consultation Fee' },
              { value: '100%', label: 'Confidential' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
