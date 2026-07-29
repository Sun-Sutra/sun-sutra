import { useEffect, useRef } from 'react'

export function useParallax(speed = 0.2) {
  const ref = useRef(null)
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.parentElement.getBoundingClientRect()
      const windowHeight = window.innerHeight
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const offset = (rect.top - windowHeight / 2) * speed
        ref.current.style.transform = `translateY(${offset}px)`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])
  return ref
}

export function useFadeIn() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = 1
    el.style.transform = 'none'
  }, [])
  return ref
}

export function SectionLabel({ children }) {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:8,
      fontSize:13, fontWeight:600, letterSpacing:'0.05em',
      textTransform:'uppercase', color:'var(--secondary)', marginBottom:'1.5rem',
      fontFamily: 'var(--ff-body)'
    }}>
      <span style={{width:24,height:1,background:'var(--secondary)',display:'inline-block'}}/>
      {children}
    </span>
  )
}

export function SectionHeading({ children, style }) {
  return (
    <h2 style={{
      fontFamily:'var(--ff-display)', fontSize:'clamp(2.2rem, 4.5vw, 3.5rem)',
      fontWeight:600, lineHeight:1.1, letterSpacing:'-0.02em', marginBottom:'1.5rem',
      color: 'var(--foreground)',
      ...style,
    }}>{children}</h2>
  )
}

export function SectionBody({ children, style }) {
  return (
    <p style={{
      fontSize:'clamp(1rem, 2vw, 1.125rem)', color:'var(--muted-foreground)',
      maxWidth:600, lineHeight:1.8, fontFamily: 'var(--ff-body)', ...style,
    }}>{children}</p>
  )
}

export const sectionPad = { padding:'clamp(40px, 6vw, 80px) 0', position:'relative', zIndex:1 }
export const container = { maxWidth:1280, margin:'0 auto', padding:'0 clamp(1rem, 5vw, 2rem)' }

// Reusable organic card styling to ensure consistency across components
export const organicCardStyle = {
  background: 'var(--surface)',
  border: '1px solid rgba(222, 216, 207, 0.5)', /* var(--border) with 50% opacity */
  borderRadius: '2rem', /* rounded-[2rem] */
  boxShadow: 'var(--shadow-soft)',
  padding: '2.5rem',
  transition: 'transform 0.4s ease, box-shadow 0.4s ease',
  position: 'relative',
  overflow: 'hidden'
}
