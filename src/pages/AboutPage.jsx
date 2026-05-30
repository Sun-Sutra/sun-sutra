import About from '../components/About'
import Team from '../components/Team'
import { SectionLabel, SectionHeading, SectionBody, container } from '../components/utils'

export default function AboutPage() {
  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(180deg, var(--bg-alt) 0%, var(--bg) 100%)',
        padding: '4rem 0 2rem',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center'
      }}>
        <div style={container}>
          <SectionLabel>About Sun Sutra</SectionLabel>
          <SectionHeading>Pioneering Access to Clean Power</SectionHeading>
          <SectionBody style={{ margin: '0 auto' }}>
            We bridge the gap between renewable energy generators and MSMEs in Maharashtra, simplifying procurement and reducing operational hurdles.
          </SectionBody>
        </div>
      </div>

      <About />
      <Team />
    </div>
  )
}
