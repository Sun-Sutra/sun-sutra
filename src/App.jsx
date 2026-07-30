import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import './index.css'

import Nav from './components/Nav'
import Footer from './components/Footer'
import SEO from './components/SEO'
import Home from './pages/Home'
import AboutPage from './pages/AboutPage'
import SolutionPage from './pages/SolutionPage'
import ContactPage from './pages/ContactPage'
import AdminPage from './pages/AdminPage'
import AnalysisPage from './pages/AnalysisPage'
import NotFoundPage from './pages/NotFoundPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function PageSEO() {
  const { pathname } = useLocation();
  const getSEO = (path) => {
    switch (path) {
      case '/': return { title: 'Home', description: 'Smart Solar Savings Calculator. Get an instant estimate for your solar panel installation.', url: '/' };
      case '/about': return { title: 'About Us', description: 'Learn more about Sun Sutra and our mission to provide clean, renewable energy.', url: '/about' };
      case '/solutions': return { title: 'Our Solutions', description: 'Explore our residential and commercial solar solutions.', url: '/solutions' };
      case '/contact': return { title: 'Contact Us', description: 'Get in touch with the Sun Sutra team for inquiries and support.', url: '/contact' };
      case '/analysis': return { title: 'Solar Analysis', description: 'Detailed analysis and instant savings estimator.', url: '/analysis' };
      case '/admin': return { title: 'Admin Dashboard', description: 'Sun Sutra Administration', url: '/admin' };
      default: return { title: 'Page Not Found', description: '404 - Page not found.', url: path };
    }
  }
  
  const seoData = getSEO(pathname);
  return <SEO {...seoData} />;
}

function Layout({ children }) {
  const { pathname } = useLocation()
  const isAdmin = pathname === '/admin'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Background Elements */}
      <div className="bg-text-container">
        {/* Dynamic Floating Elements */}
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>

        <div className="bg-text-large">SUN SUTRA</div>
      </div>

      {/* Main Card */}
      {isAdmin ? (
         children 
      ) : (
        <div className={`main-app-card ${scrolled ? 'expanded' : ''}`}>
          <Nav />
          <main style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
            <div key={pathname} className="page-transition-wrapper" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
              {children}
            </div>
          </main>
          <Footer />
        </div>
      )}
    </>
  )
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <PageSEO />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/solutions" element={<SolutionPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
      <Analytics />
    </Router>
  )
}
