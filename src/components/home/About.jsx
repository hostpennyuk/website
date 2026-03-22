import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaStar } from 'react-icons/fa';
import { useCtaModal } from '../cta/CtaContext';

const About = () => {
  const stats = [
    { label: 'Time to MVP', value: '4-6 weeks', highlight: 'Not months' },
    { label: 'On-time Delivery', value: '95%', highlight: 'Industry avg: 45%' },
    { label: 'Client Satisfaction', value: '4.8/5', highlight: 'Based on 40+ reviews' },
  ];

  const benefits = [
    { title: 'Fast Execution', desc: 'Prototype in days, not months' },
    { title: 'Senior Engineers Only', desc: 'No juniors, no handoffs' },
    { title: 'Conversion-First', desc: 'Every feature drives revenue' },
    { title: 'Scale-Ready', desc: 'Built for 100x growth' },
  ];

  const { openModal } = useCtaModal?.() ?? { openModal: () => {} };

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-4"
          >
            Why Founders Choose Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white"
          >
            We Build Like Founders
            <span className="block">Because We Are Founders</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-xl text-white/90 leading-relaxed">
              Not another agency that charges by the hour and drags projects out. 
              We are a tight-knit team of senior engineers who ship like our reputation depends on it - because it does.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-white text-lg mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-bold">{benefit.title}</h4>
                      <p className="text-white/80 text-sm">{benefit.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={openModal}
              whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
              whileTap={{ scale: 0.98 }}
              className="group mt-6 px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg shadow-xl flex items-center gap-2"
            >
              Start Your Project
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Right - Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">{stat.label}</h3>
                    <p className="text-sm text-green-600 font-medium">{stat.highlight}</p>
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex items-center justify-center gap-4"
            >
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <FaStar key={i} className="text-yellow-300 text-xl" />
                ))}
              </div>
              <span className="text-white font-semibold">Rated 4.8/5 by 40+ founders</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
