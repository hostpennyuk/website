import { motion } from 'framer-motion';
import { FaBolt, FaUserShield, FaBezierCurve, FaChartLine, FaCheckCircle } from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: FaBolt,
      title: 'Ship in 4-6 Weeks',
      description: 'From idea to live product faster than hiring a single developer. No agency bloat, just results.',
      highlight: 'MVP Ready',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: FaUserShield,
      title: 'Senior Team Only',
      description: '10+ engineers with 8+ years average experience. No juniors learning on your dime.',
      highlight: '8+ Years Avg',
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: FaBezierCurve,
      title: 'Conversion-First Design',
      description: 'Every pixel optimized to turn visitors into customers. A/B tested patterns that actually work.',
      highlight: '3x Conv Rate',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: FaChartLine,
      title: 'Built to Scale',
      description: "Architecture that handles 10x growth without rewrites. You won't outgrow what we build.",
      highlight: 'Scale Ready',
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-purple-950">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-semibold mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            Everything You Need to
            <span className="block text-gradient">Launch & Scale</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Stop wasting time with agencies that overpromise. Get a dedicated team that ships.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <div className="relative h-full bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden">
                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-6">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}
                    >
                      <feature.icon className="text-white text-xl" />
                    </motion.div>
                    
                    {/* Highlight Badge */}
                    <span className={`px-3 py-1 bg-gradient-to-r ${feature.color} bg-opacity-10 rounded-full text-xs font-bold text-white`}>
                      {feature.highlight}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed flex-grow">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-6 flex-wrap justify-center">
            {['No upfront costs', 'Weekly demos', 'Cancel anytime'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-300">
                <FaCheckCircle className="text-green-400" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
