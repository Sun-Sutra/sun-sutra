import { SectionHeading, SectionBody } from '../components/utils'
export default function CookiePolicy() {
  return (
    <div className="page-wrapper" style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
      <SectionHeading>Cookie Policy</SectionHeading>
      <SectionBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <h2>What Are Cookies</h2>
          <p>Cookies are small pieces of text sent to your web browser by a website you visit.</p>
          <h2>How We Use Cookies</h2>
          <p>We use cookies to analyze our traffic and ensure our forms are protected against spam.</p>
        </div>
      </SectionBody>
    </div>
  )
}
