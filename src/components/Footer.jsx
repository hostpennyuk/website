import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { addSubscriber, getSettings } from '../store/content';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const settings = getSettings();

  const footerLinks = {
    links: [
      { label: 'Home', path: '/' },
      { label: 'Services', path: '/services' },
      { label: 'About us', path: '/about' },
      { label: 'Portfolio', path: '/portfolio' },
      { label: 'Contact', path: '/contact' },
    ],
    support: [
      { label: 'Contact Us', path: '/contact' },
      { label: 'Submit a Ticket', path: '/contact' },
      { label: 'Visit Knowledge Base', path: '/' },
      { label: 'Support System', path: '/contact' },
      { label: 'Refund Policy', path: '/' },
      { label: 'Professional Services', path: '/services' },
    ],
  };

  const socialLinks = [
    { icon: FaFacebookF, url: settings.social.facebook || '#', label: 'Facebook' },
    { icon: FaTwitter, url: settings.social.twitter || '#', label: 'Twitter' },
    { icon: FaLinkedinIn, url: settings.social.linkedin || '#', label: 'LinkedIn' },
    { icon: FaInstagram, url: settings.social.instagram || '#', label: 'Instagram' },
  ];

  const onNewsletter = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get('email');
    if (email) addSubscriber(email.toString());
    e.currentTarget.reset();
  };

  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Image logo with purple background */}
            <div className="inline-flex items-center justify-center rounded-xl p-2 mb-4" style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%)' }}>
              <img src="/logo.gif" alt="HostPenny Logo" className="h-[3.75rem] w-auto" />
            </div>
            <p className="text-gray-300 mb-4">
              We design, build, and ship software that sells for you—websites, apps, and platforms engineered for conversion and scale.
            </p>
            <div className="space-y-2">
              <a href={`tel:${settings.footer.phone?.replace(/\s/g,'')}`} className="flex items-center text-gray-300 hover:text-primary transition-colors">
                <FaPhone className="mr-2" />
                {settings.footer.phone}
              </a>
              <a href={`mailto:${settings.footer.email}`} className="flex items-center text-gray-300 hover:text-primary transition-colors">
                <FaEnvelope className="mr-2" />
                {settings.footer.email}
              </a>
              <p className="flex items-start text-gray-300">
                <FaMapMarkerAlt className="mr-2 mt-1" />
                {settings.footer.address}
              </p>
            </div>
          </motion.div>

          {/* Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-xl font-heading font-bold mb-4">LINKS</h4>
            <ul className="space-y-2">
              {footerLinks.links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-xl font-heading font-bold mb-4">SUPPORT</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-xl font-heading font-bold mb-4">NEWSLETTER</h4>
            <p className="text-gray-300 mb-4">Get quick, actionable playbooks on building products that grow.</p>
            <form className="space-y-3" onSubmit={onNewsletter}>
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="w-full btn-primary"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm">
              © {currentYear} All rights reserved by HostPenny
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Follow us:</span>
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.url}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
