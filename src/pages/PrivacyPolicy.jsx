import { SectionHeading, SectionBody } from '../components/utils'
export default function PrivacyPolicy() {
  return (
    <div className="page-wrapper" style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
      <SectionHeading>Privacy Policy</SectionHeading>
      <SectionBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us.</p>
          <h2>2. How We Use Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, such as calculating your solar savings.</p>
          <h2>3. Information Sharing</h2>
          <p>We do not share your personal information with third parties except as described in this privacy policy.</p>
          <h2>4. Analytics</h2>
          <p>We use third-party analytics services (such as PostHog) to help understand your usage of our services. These tools use cookies and other tracking technologies to collect information about your use of our services.</p>
        </div>
      </SectionBody>
    </div>
  )
}
