import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StickyBottomButton from './components/StickyBottomButton';
import { CtaModalProvider } from './components/cta/CtaContext';
import CtaModal from './components/cta/CtaModal';
import Home from './pages/Home';
import Home2 from './pages/Home2';
import Home3 from './pages/Home3';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import StartupEvents from './pages/StartupEvents';
import Admin from './pages/Admin';

function App() {
  const Layout = ({ children }) => {
    const { pathname } = useLocation();
    const isAdmin = pathname.startsWith('/admin');
    return (
      <div className="flex flex-col min-h-screen">
        {!isAdmin && <Navbar />}
        <main className="flex-grow pb-16 lg:pb-0">{children}</main>
        {!isAdmin && <Footer />}
        {!isAdmin && <StickyBottomButton />}
        <CtaModal />
      </div>
    );
  };

  return (
    <Router>
      <CtaModalProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home2" element={<Home2 />} />
            <Route path="/home3" element={<Home3 />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/startup-events" element={<StartupEvents />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </CtaModalProvider>
    </Router>
  );
}

export default App;
