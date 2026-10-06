import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuoteModal from './components/QuoteModal';
import SeoManager from './components/SeoManager';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import HomePackagePage from './pages/HomePackagePage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function AppShell() {
  const { pathname } = useLocation();
  const [showPreloader, setShowPreloader] = useState(true);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    const replay = () => setShowPreloader(true);
    window.addEventListener('ausali:replay-preloader', replay);
    return () => window.removeEventListener('ausali:replay-preloader', replay);
  }, []);

  if (isAdminRoute) {
    return (
      <div className="app-wrapper admin-app-wrapper">
        <ScrollManager />
        <SeoManager />
        <main>
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      {showPreloader && (
        <Preloader onComplete={() => setShowPreloader(false)} />
      )}

      <ScrollManager />

      <SeoManager />

      <Navbar onQuote={() => setQuoteModalOpen(true)} />

      <main>
        <Routes>
          <Route path="/" element={<HomePage onQuote={() => setQuoteModalOpen(true)} />} />
          <Route path="/about" element={<AboutPage onQuote={() => setQuoteModalOpen(true)} />} />
          <Route path="/home-package" element={<HomePackagePage />} />
          <Route path="/projects" element={<ProjectsPage onQuote={() => setQuoteModalOpen(true)} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer onQuote={() => setQuoteModalOpen(true)} />

      <QuoteModal open={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
