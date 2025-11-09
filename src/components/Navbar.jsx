import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { useCtaModal } from './cta/CtaContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { openModal } = useCtaModal();
  
  // Check if we're on homepage (including home2 and home3)
  const isHomePage = location.pathname === '/' || location.pathname === '/home2' || location.pathname === '/home3';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/startup-events', label: 'Events' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/contact', label: 'Contact' },
  ];

  // For non-homepage, always show purple background
  const showPurpleBackground = !isHomePage || isScrolled;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showPurpleBackground ? 'shadow-lg py-4' : 'bg-transparent py-6'
      }`}
      style={showPurpleBackground ? { background: 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%)' } : {}}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <img 
                src="/logo.gif" 
                alt="HostPenny Logo" 
                className="h-18 md:h-21 w-auto"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-semibold transition-all duration-300 relative group ${
                  showPurpleBackground 
                    ? (location.pathname === link.path ? 'text-white' : 'text-white/90 hover:text-white')
                    : (location.pathname === link.path ? 'text-gray-900' : 'text-gray-900 hover:text-primary')
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                    showPurpleBackground ? 'bg-white' : 'bg-primary'
                  } ${
                    location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
            <motion.button
              onClick={openModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-3 rounded-lg font-semibold text-white shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-orange-200 bg-gradient-to-r from-purple-800 via-pink-600 to-orange-500 hover:shadow-xl"
            >
              Let's Build Something Amazing
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden text-3xl transition-colors ${
              showPurpleBackground 
                ? 'text-white hover:text-white/80' 
                : 'text-gray-900 hover:text-primary'
            }`}
          >
            {isMobileMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="flex flex-col space-y-4 pt-6 pb-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg font-semibold transition-colors ${
                      showPurpleBackground
                        ? (location.pathname === link.path ? 'text-white' : 'text-white/90 hover:text-white')
                        : (location.pathname === link.path ? 'text-gray-900' : 'text-gray-700 hover:text-primary')
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button onClick={() => { openModal(); setIsMobileMenuOpen(false); }} className="w-full px-5 py-3 rounded-lg font-semibold text-white shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-orange-200 bg-gradient-to-r from-purple-800 via-pink-600 to-orange-500 hover:shadow-xl">
                  Let's Build Something Amazing
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
