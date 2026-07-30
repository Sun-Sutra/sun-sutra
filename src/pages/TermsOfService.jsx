import { SectionHeading, SectionBody } from '../components/utils'
export default function TermsOfService() {
  return (
    <div className="page-wrapper" style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
      <SectionHeading>Terms of Service</SectionHeading>
      <SectionBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using Sun Sutra's services, you accept and agree to be bound by the terms and provision of this agreement.</p>
          <h2>2. Use of Service</h2>
          <p>Our savings estimator provides an estimate based on the data provided. Actual savings may vary.</p>
          <h2>3. Disclaimer of Warranties</h2>
          <p>The service is provided on an "as is" and "as available" basis without any warranties of any kind.</p>
        </div>
      </SectionBody>
    </div>
  )
}
