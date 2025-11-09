import { motion } from 'framer-motion';
import { FaMobileAlt, FaGlobe, FaGamepad, FaDesktop, FaPencilRuler, FaCode } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCtaModal } from '../cta/CtaContext';

const Services = () => {
  const services = [
    {
      icon: FaMobileAlt,
      title: 'Mobile Apps',
      description: 'iOS, Android, and cross‑platform builds engineered for performance, retention, and growth.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: FaGlobe,
      title: 'Websites & Web Apps',
      description: 'High‑converting sites and web apps with speed scores, SEO structure, and A/B‑ready layouts.',
      color: 'from-purple-800 to-purple-900',
    },
    {
      icon: FaGamepad,
      title: 'Game Development',
      description: 'Engaging mobile games and gamified experiences that drive retention and re‑engagement.',
      color: 'from-purple-700 to-purple-800',
    },
    {
      icon: FaDesktop,
      title: 'Desktop Applications',
      description: 'Cross‑platform desktop apps that feel native, sync offline, and update reliably.',
      color: 'from-orange-600 to-red-600',
    },
    {
      icon: FaPencilRuler,
      title: 'UI/UX & Product Design',
      description: 'Decision‑friendly UX, investor‑ready design systems, and crisp visual language.',
      color: 'from-purple-900 to-violet-900',
    },
    {
      icon: FaCode,
      title: 'Custom Software',
      description: 'Dashboards, automations, and integrations built for ROI and reliability.',
      color: 'from-purple-700 to-purple-900',
    },
  ];

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

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-semibold mb-2 tracking-wider uppercase text-sm"
          >
            Services
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            <span className="block">{letterSpacing('Software that')}</span>
            <span className="block text-gradient">{letterSpacing('sells for you')}</span>
          </motion.h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 relative overflow-hidden">
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg relative z-10`}
                >
                  <service.icon className="text-white text-3xl" />
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-heading font-bold text-dark mb-4 group-hover:text-primary transition-colors relative z-10">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 relative z-10">
                  {service.description}
                </p>

                {/* Read More Link */}
                <Link 
                  to="/services"
                  className="inline-flex items-center text-primary font-semibold hover:gap-2 transition-all duration-300 relative z-10"
                >
                  Read more
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <CtaInline />
        </motion.div>
      </div>
    </section>
  );
};

export default Services;

// Small inline CTA component that opens the global modal
const CtaInline = () => {
  const { openModal } = useCtaModal?.() ?? { openModal: () => {} };
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={openModal}
      className="px-8 py-4 rounded-lg font-semibold text-white text-lg shadow-xl bg-gradient-to-r from-purple-800 via-pink-600 to-orange-500"
    >
      Let’s Build Something Amazing
    </motion.button>
  );
};
