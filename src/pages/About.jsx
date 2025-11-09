import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { FaCheckCircle, FaUsers, FaRocket, FaAward, FaHeart } from 'react-icons/fa';

const About = () => {
  const values = [
    {
      icon: FaUsers,
      title: 'Senior-only team',
      description: 'Small, elite, and accountable. We ship like founders because we are builders first.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: FaRocket,
      title: 'Momentum over meetings',
      description: 'Weekly demos, clear sprints, predictable delivery. Less talk, more ship.',
      color: 'from-purple-800 to-purple-900',
    },
    {
      icon: FaAward,
      title: 'Quality that converts',
      description: 'Design that earns trust. Engineering that never lets you down.',
      color: 'from-purple-700 to-purple-800',
    },
    {
      icon: FaHeart,
      title: 'Care as a feature',
      description: 'We treat your product like our own. Clarity, honesty, and real partnership.',
      color: 'from-purple-900 to-violet-900',
    },
  ];

  const achievements = [
    '40+ products shipped',
    '10+ senior engineers',
    '4.8/5 founder rating',
    'MVPs in 4–6 weeks',
    '24h average response time',
    'Built for startups, ready for scale',
  ];

  return (
    <div className="pt-24">
      <SEO 
        title="About — Your startup’s secret weapon | HostPenny"
        description="We’re a team of elite engineers and designers who turn ideas into living, selling platforms. Built for startups, ready for scale."
      />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(255,87,34,0.2) 0%, transparent 70%)' }}
          />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-primary font-semibold mb-4 tracking-wider uppercase"
            >
              About HostPenny
            </motion.p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-dark mb-6">
              Your startup’s
              <span className="block text-gradient">secret weapon</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We’re a product studio for founders who can’t afford to miss. We move fast, think clearly,
              and build software that turns visitors into customers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-heading font-bold text-dark mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We’ve built with founders under pressure—tight timelines, investor milestones, and users who won’t wait.
                That’s where we thrive. Strategy short, shipping long.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                From MVP to scale, we combine conversion‑first UX with rock‑solid engineering so your product sells itself.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Less bloat. More momentum. That’s the promise.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=600&fit=crop"
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-2xl">
                <div className="text-center text-white">
                  <div className="text-5xl font-bold">4.8</div>
                  <div className="text-lg">Founder rating</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <value.icon className="text-white text-2xl" />
                </motion.div>
                <h3 className="text-xl font-heading font-bold text-dark mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <FaCheckCircle className="text-primary text-2xl flex-shrink-0" />
                  <span className="text-lg font-semibold text-dark">{achievement}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-heading font-bold text-dark mb-6">
                Our Edge
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We understand startups—the hunger, the pressure, the obsession with speed. That’s why we built a
                senior‑only team that ships outcomes, not excuses.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From idea to launch, we build platforms that grow. Software that sells for you.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
