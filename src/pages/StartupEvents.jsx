import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { useCtaModal } from '../components/cta/CtaContext';

const StartupEvents = () => {
  const { openModal } = useCtaModal?.() ?? { openModal: () => {} };

  return (
    <div className="pt-24">
      <SEO 
        title="Startup Events & Partnerships | HostPenny"
        description="Partner with us for accelerators, VCs, hackathons, and founder communities. From idea to launch — we build platforms that grow."
      />
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-pink-700 to-orange-500 text-white relative overflow-hidden">
        <div className="container-custom relative z-10 text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="uppercase tracking-widest text-white/80 font-semibold mb-3">Startup Events & Partnerships</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl md:text-6xl font-heading font-bold mb-4">Built for startups. Ready for scale.</motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-lg md:text-xl max-w-3xl mx-auto">We co-create with accelerators, VCs, hackathons, and founder communities to turn promising ideas into platforms that grow.</motion.p>
        </div>
      </section>

      {/* Partnerships Grid */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Accelerators', text: 'Demo day-ready product builds, technical mentorship, and investor-grade UX.' },
              { title: 'VC Portfolios', text: 'Standardized discovery, rapid MVPs, and scale-up engineering pods.' },
              { title: 'Hackathons', text: 'Weekend-to-MVP kits, design sprints, and live shipping support.' },
              { title: 'Universities', text: 'Founder programs, product studios, and student-led venture builds.' },
              { title: 'Communities', text: 'Workshops, AMAs, and scholarships for underrepresented founders.' },
              { title: 'Corporate Innovation', text: 'Spin-outs, POCs, and internal tools that ship fast and stick.' },
            ].map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-gray-600">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 40%, #ff4d4f 100%)' }}>
        <div className="container-custom text-center text-white">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Host a build sprint. Sponsor an MVP. Let’s move.</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">From idea to launch — we build platforms that grow. Partner with us to give your founders unfair advantage.</p>
          <button onClick={openModal} className="inline-block px-8 py-4 bg-white text-purple-900 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">Propose a Partnership</button>
        </div>
      </section>
    </div>
  );
};

export default StartupEvents;
