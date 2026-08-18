import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState, lazy, Suspense } from 'react'
import { Analytics } from '@vercel/analytics/react'
import './index.css'

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Nav from './components/Nav'
import Footer from './components/Footer'
import SEO from './components/SEO'
import GlobalNetworkMonitor from './components/GlobalNetworkMonitor'

// ── Eagerly loaded (critical path) ──
import Home from './pages/Home'

// ── Lazy loaded (code-split into separate chunks) ──
const AboutPage = lazy(() => import('./pages/AboutPage'))
const SolutionPage = lazy(() => import('./pages/SolutionPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignUpPage = lazy(() => import('./pages/SignUpPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))

// ── Loading Fallback ──
function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', color: 'var(--muted-foreground)',
      fontFamily: 'var(--ff-body)', fontSize: '0.95rem',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40, border: '3px solid var(--border)',
          borderTopColor: 'var(--primary)', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem',
        }} />
        Loading...
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

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
      case '/login': return { title: 'Login', description: 'Login to your Sun Sutra account.', url: '/login' };
      case '/signup': return { title: 'Sign Up', description: 'Create a new Sun Sutra account.', url: '/signup' };
      case '/profile': return { title: 'Profile', description: 'Manage your Sun Sutra profile.', url: '/profile' };
      case '/privacy': return { title: 'Privacy Policy', description: 'Privacy Policy of Sun Sutra.', url: '/privacy' };
      case '/terms': return { title: 'Terms of Service', description: 'Terms of Service for Sun Sutra.', url: '/terms' };
      case '/cookies': return { title: 'Cookie Policy', description: 'Cookie Policy for Sun Sutra.', url: '/cookies' };
      case '/refund': return { title: 'Refund Policy', description: 'Refund Policy for Sun Sutra.', url: '/refund' };
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
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <PageSEO />
        <GlobalNetworkMonitor />
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/solutions" element={<SolutionPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/analysis" element={<AnalysisPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/refund" element={<RefundPolicy />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Layout>
        <Analytics />
      </Router>
    </AuthProvider>
  )
}
