import Contact from '../components/Contact'
import { SectionLabel, SectionHeading, SectionBody, container } from '../components/utils'

export default function ContactPage() {
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
          <SectionLabel>Partner With Us</SectionLabel>
          <SectionHeading>Get Your Customized Savings Analysis</SectionHeading>
          <SectionBody style={{ margin: '0 auto' }}>
            Submit your power requirements below, and our team will prepare a structured feasibility and cost savings report.
          </SectionBody>
        </div>
      </div>

      <Contact />
    </div>
  )
}
