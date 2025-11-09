import { motion } from 'framer-motion';
import { FaBolt, FaUserShield, FaBezierCurve, FaChartLine } from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: FaBolt,
      title: 'Speed to MVP',
      description: 'Ship a clickable prototype in days and an MVP in weeks—so you can test, pitch, and sell sooner.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: FaUserShield,
      title: 'Senior‑only Team',
      description: '10+ elite engineers who build like founders: fast, reliable, and accountable from day one.',
      color: 'from-purple-800 to-purple-900',
    },
    {
      icon: FaBezierCurve,
      title: 'Conversion‑first UX',
      description: 'Design that earns trust and drives action. Analytics, copy, and micro‑interactions baked in.',
      color: 'from-purple-700 to-purple-800',
    },
    {
      icon: FaChartLine,
      title: 'Ready for Scale',
      description: 'Clean architecture and performance by default, so you don’t rebuild when growth hits.',
      color: 'from-purple-900 to-violet-900',
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%)' }}>
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-white/20">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <feature.icon className="text-white text-2xl" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-heading font-bold text-dark mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
