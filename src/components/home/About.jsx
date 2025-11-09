import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { useCtaModal } from '../cta/CtaContext';

const About = () => {
  const stats = [
    { label: 'Time to MVP', value: '4-6w' },
    { label: 'On‑time sprints', value: '95%' },
    { label: 'Founder rating', value: '4.8/5' },
  ];

  const features = [
    'Senior team only — fast, accountable, clear',
    'Prototype in days, not months',
    'Conversion‑first UX and analytics baked in',
    'From idea to launch — built for scale',
  ];

  const { openModal } = useCtaModal?.() ?? { openModal: () => {} };

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #ff5722 0%, #ff7043 100%)' }}>
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white font-semibold mb-2 tracking-wider uppercase text-sm"
          >
            About
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white"
          >
            <span className="block">{letterSpacing('Built for startups.')}</span>
            <span className="block">{letterSpacing('Ready for scale.')}</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p className="text-lg text-white/90 leading-relaxed">
              We’re a small, senior team that ships like founders — fast, focused, and
              accountable. Our mission is simple: build software that sells for you.
            </p>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <FaCheckCircle className="text-white text-xl flex-shrink-0" />
                  <span className="text-white font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={openModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-lg font-semibold text-white shadow-lg bg-gradient-to-r from-purple-800 via-pink-600 to-orange-500 mt-6"
            >
              Start Your Project
            </motion.button>
          </motion.div>

          {/* Right Content - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-heading font-bold text-dark">{stat.label}</h3>
                  <div className="text-4xl font-bold text-gradient">{stat.value}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Helper function for letter spacing animation
const letterSpacing = (text) => {
  return text.split('').map((char, index) => (
    <motion.span
      key={index}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.05, delay: index * 0.03 }}
      className="inline-block"
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  ));
};

export default About;
