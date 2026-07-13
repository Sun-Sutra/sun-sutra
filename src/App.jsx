import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import AboutPage from './pages/AboutPage'
import SolutionPage from './pages/SolutionPage'
import MarketPage from './pages/MarketPage'
import ContactPage from './pages/ContactPage'
import AdminPage from './pages/AdminPage'
import AnalysisPage from './pages/AnalysisPage'

// ScrollToTop component to reset scroll position on page change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Layout wrapper that hides Nav/Footer on admin route
function Layout({ children }) {
  const { pathname } = useLocation()
  const isAdmin = pathname === '/admin'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {!isAdmin && <Nav />}
      <main style={{ flex: '1 0 auto' }}>
        {children}
      </main>
      {!isAdmin && <Footer />}
    </div>
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
          <Route path="/market" element={<MarketPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
        </Routes>
      </Layout>
      <Analytics />
    </Router>
  )
}
