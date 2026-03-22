import { motion } from 'framer-motion';
import { FaMobileAlt, FaGlobe, FaGamepad, FaDesktop, FaPencilRuler, FaCode, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCtaModal } from '../cta/CtaContext';

const Services = () => {
  const services = [
    {
      icon: FaMobileAlt,
      title: 'Mobile Apps',
      description: 'iOS and Android apps that users love and investors fund. From MVP to App Store in weeks.',
      results: '25+ apps launched',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: FaGlobe,
      title: 'Web Apps & Sites',
      description: 'High-converting websites and complex web platforms built for speed and scale.',
      results: '3x avg conversion lift',
      color: 'from-purple-500 to-violet-600',
    },
    {
      icon: FaGamepad,
      title: 'Game Development',
      description: 'Engaging games and gamified experiences that drive retention and virality.',
      results: '2M+ downloads',
      color: 'from-pink-500 to-rose-600',
    },
    {
      icon: FaDesktop,
      title: 'Desktop Applications',
      description: 'Cross-platform desktop apps that feel native and work offline.',
      results: 'Electron & Tauri',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: FaPencilRuler,
      title: 'UI/UX & Product Design',
      description: 'User research, wireframes, and polished designs that convert.',
      results: 'Figma to code in days',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: FaCode,
      title: 'Custom Software',
      description: 'APIs, automations, dashboards, and integrations built for your business.',
      results: 'Any stack, any scale',
      color: 'from-indigo-500 to-purple-600',
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4"
          >
            What We Build
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-gray-900"
          >
            Software That
            <span className="block text-gradient">Sells For You</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto mt-4"
          >
            Full-stack expertise across every platform. One team, end-to-end delivery.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 relative overflow-hidden">
                {/* Hover gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg relative z-10`}
                >
                  <service.icon className="text-white text-2xl" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-heading font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors relative z-10">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4 relative z-10">
                  {service.description}
                </p>
                
                {/* Results Badge */}
                <div className="flex items-center justify-between relative z-10">
                  <span className={`text-sm font-semibold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                    {service.results}
                  </span>
                  <Link 
                    to="/services"
                    className="text-orange-500 hover:text-orange-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    Learn more <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <CtaInline />
        </motion.div>
      </div>
    </section>
  );
};

// CTA component
const CtaInline = () => {
  const { openModal } = useCtaModal?.() ?? { openModal: () => {} };
  return (
    <motion.button
      whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(255, 87, 34, 0.25)' }}
      whileTap={{ scale: 0.98 }}
      onClick={openModal}
      className="group px-8 py-4 rounded-xl font-bold text-white text-lg shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-red-500 transition-all"
    >
      <span className="flex items-center gap-2">
        Start Your Project
        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
      </span>
    </motion.button>
  );
};

export default Services;
