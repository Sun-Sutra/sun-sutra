import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import './index.css'

import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import AboutPage from './pages/AboutPage'
import SolutionPage from './pages/SolutionPage'
import ContactPage from './pages/ContactPage'
import AdminPage from './pages/AdminPage'
import AnalysisPage from './pages/AnalysisPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
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
            {children}
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
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/solutions" element={<SolutionPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
        </Routes>
      </Layout>
      <Analytics />
    </Router>
  )
}
