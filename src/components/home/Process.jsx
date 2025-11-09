import { motion } from 'framer-motion';
import { FaLightbulb, FaDraftingCompass, FaCode, FaRocket } from 'react-icons/fa';
import { useCtaModal } from '../cta/CtaContext';

const Process = () => {
  const steps = [
    {
      number: '01',
      icon: FaLightbulb,
      title: 'Discover',
      description: 'A 45‑minute workshop to align goals, define success, and pick the shortest path to value.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=250&fit=crop',
      color: 'from-orange-500 to-orange-600',
    },
    {
      number: '02',
      icon: FaDraftingCompass,
      title: 'Prototype',
      description: 'Clickable in days. Validate flows, copy, and conversion paths before we write a line of code.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=250&fit=crop',
      color: 'from-purple-800 to-purple-900',
    },
    {
      number: '03',
      icon: FaCode,
      title: 'Build',
      description: 'Weekly sprints. Senior engineers only. Transparent demos, predictable delivery.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=250&fit=crop',
      color: 'from-purple-700 to-purple-800',
    },
    {
      number: '04',
      icon: FaRocket,
      title: 'Launch',
      description: 'Go live with confidence—monitoring, analytics, and iteration plan included.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=250&fit=crop',
      color: 'from-purple-900 to-violet-900',
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
    <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%)' }}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white font-semibold mb-2 tracking-wider uppercase text-sm"
          >
            Process
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white"
          >
            <span className="block">{letterSpacing('From idea to')}</span>
            <span className="block">{letterSpacing('launch — fast')}</span>
          </motion.h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              {/* Step Number Background */}
              <div className="absolute -top-6 -right-6 text-[120px] font-bold text-white/20 opacity-50 z-0 group-hover:text-orange-500/30 transition-colors duration-300">
                {step.number}
              </div>

              <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${step.color} opacity-60`} />
                  
                  {/* Step Number Badge */}
                  <div className="absolute bottom-4 left-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-2xl">{step.number}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="inline-block mb-4"
                  >
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md`}>
                      <step.icon className="text-white text-2xl" />
                    </div>
                  </motion.div>

                  <h3 className="text-xl font-heading font-bold text-dark mb-3 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Link */}
                  <CallToActionLink />
                </div>
              </div>

              {/* Connection Line (not on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary z-0" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;

// Inline CTA link that opens the global modal
const CallToActionLink = () => {
  const { openModal } = useCtaModal?.() ?? { openModal: () => {} };
  return (
    <button
      onClick={openModal}
      className="inline-flex items-center text-primary font-semibold hover:gap-2 transition-all duration-300"
    >
      Start your project
      <motion.span
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        →
      </motion.span>
    </button>
  );
};
