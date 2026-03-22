import { motion } from 'framer-motion';
import { FaLightbulb, FaDraftingCompass, FaCode, FaRocket, FaArrowRight } from 'react-icons/fa';
import { useCtaModal } from '../cta/CtaContext';

const Process = () => {
  const { openModal } = useCtaModal?.() ?? { openModal: () => {} };

  const steps = [
    {
      number: '01',
      icon: FaLightbulb,
      title: 'Discovery Call',
      duration: '30 min',
      description: 'Tell us your vision. We will give you an honest assessment and a rough timeline - no BS, no sales pitch.',
      color: 'from-orange-500 to-amber-500',
    },
    {
      number: '02',
      icon: FaDraftingCompass,
      title: 'Prototype',
      duration: '1-2 weeks',
      description: 'See your idea come to life in clickable form. Test flows, validate assumptions, iterate fast.',
      color: 'from-purple-500 to-violet-500',
    },
    {
      number: '03',
      icon: FaCode,
      title: 'Build',
      duration: '4-6 weeks',
      description: 'Weekly demos, transparent progress. Senior engineers only. No surprises.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      number: '04',
      icon: FaRocket,
      title: 'Launch',
      duration: 'Day 1',
      description: 'Go live with monitoring, analytics, and support. We do not disappear after launch.',
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-900 to-purple-950">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-semibold mb-4"
          >
            Our Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white"
          >
            From Idea to Launch
            <span className="block text-gradient">In Weeks, Not Months</span>
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 via-purple-500 to-emerald-500 transform -translate-y-1/2 opacity-20" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all h-full">
                  {/* Step Number */}
                  <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} bg-opacity-10 flex items-center justify-center mb-6`}>
                    <step.icon className={`text-2xl bg-gradient-to-r ${step.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', background: `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))` }} />
                    <step.icon className={`text-2xl text-white opacity-80`} />
                  </div>

                  {/* Duration Badge */}
                  <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-gray-300 mb-4">
                    {step.duration}
                  </span>

                  {/* Content */}
                  <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            onClick={openModal}
            whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(255, 87, 34, 0.25)' }}
            whileTap={{ scale: 0.98 }}
            className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/25"
          >
            <span className="flex items-center gap-2">
              Start Your Project Today
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
          <p className="text-gray-400 mt-4 text-sm">Free consultation. No obligation.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
