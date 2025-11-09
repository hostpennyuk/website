import { motion } from 'framer-motion';
import { useCtaModal } from '../components/cta/CtaContext';
import SEO from '../components/SEO';
import { FaMobileAlt, FaGlobe, FaPencilRuler, FaCode, FaDesktop, FaServer, FaShoppingCart, FaGamepad } from 'react-icons/fa';

const Services = () => {
  const services = [
    {
      icon: FaMobileAlt,
      title: 'Mobile Apps',
      description: 'iOS and Android apps built with React Native or Flutter. App Store and Play Store ready.',
      features: ['React Native / Flutter', 'Offline‑ready & push', 'Store submission & ASO', 'Analytics & events'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FaGlobe,
      title: 'Websites',
      description: 'High-converting marketing sites with blazing performance, SEO baked in, and world-class UX.',
      features: ['Next.js/Remix', 'Core Web Vitals A‑scores', 'SEO & schema', 'CMS & localization'],
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: FaPencilRuler,
      title: 'UI/UX Design',
      description: 'Research, wireframes, prototypes, and design systems that turn clicks into customers.',
      features: ['User research', 'Wireframes & prototypes', 'Usability tests', 'Design system tokens'],
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: FaCode,
      title: 'Web Apps',
      description: 'SaaS dashboards, marketplaces, real-time apps—secure, fast, and built for scale.',
      features: ['React / TypeScript', 'Realtime & queues', 'Multi‑tenant SaaS', 'CI/CD & observability'],
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: FaDesktop,
      title: 'Desktop Apps',
      description: 'Cross‑platform apps using Electron or Tauri with native-feel performance.',
      features: ['Electron / Tauri', 'Auto‑updates', 'Secure storage', 'Native integrations'],
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: FaServer,
      title: 'APIs & Backends',
      description: 'Robust Node.js/NestJS/Go services, authentication, payments, analytics and more.',
      features: ['Node.js / NestJS / Go', 'Auth & RBAC', 'Stripe & payments', 'Monitoring & tracing'],
      color: 'from-slate-500 to-neutral-600',
    },
    {
      icon: FaShoppingCart,
      title: 'eCommerce',
      description: 'Headless storefronts, Shopify, Stripe—everything you need to sell at scale.',
      features: ['Headless + Shopify', 'Subscriptions', 'Checkout optimization', 'Analytics & attribution'],
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: FaGamepad,
      title: 'Games',
      description: 'Casual web and mobile games that engage users and grow retention.',
      features: ['Phaser / Unity', 'Ads & IAP', 'Leaderboards', 'Live ops basics'],
      color: 'from-teal-500 to-green-500',
    },
  ];

  const { openModal } = useCtaModal();

  return (
    <div className="pt-24">
      <SEO 
  title="Services — What we build for you | HostPenny"
  description="Mobile apps, websites, UI/UX, web apps, desktop apps, APIs & backends, eCommerce, and games. Built fast by senior engineers."
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
              Our Services
            </motion.p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-dark mb-6">
              From idea to launch
              <span className="block text-gradient">we build platforms that grow</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Mobile apps, websites, UI/UX, web apps, desktop apps, APIs & backends, eCommerce, and games — engineered for startups with speed and scale.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 relative overflow-hidden">
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
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

                  {/* Features List */}
                  <ul className="space-y-2 relative z-10">
                    {service.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + idx * 0.05 }}
                        className="flex items-center space-x-2 text-gray-700"
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color}`} />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #ff5722 0%, #ff7043 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Let's discuss how our services can help you achieve your digital marketing goals.
            </p>
            <motion.button
              onClick={openModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 text-white bg-gradient-to-r from-purple-800 via-pink-600 to-orange-500"
            >
              Let's Build Something Amazing
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
