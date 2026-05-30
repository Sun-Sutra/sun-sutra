import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import './index.css'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import AboutPage from './pages/AboutPage'
import SolutionPage from './pages/SolutionPage'
import MarketPage from './pages/MarketPage'
import ContactPage from './pages/ContactPage'

// ScrollToTop component to reset scroll position on page change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
        <Nav />
        <main style={{ flex: '1 0 auto' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/solutions" element={<SolutionPage />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}
