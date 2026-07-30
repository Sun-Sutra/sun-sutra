import { SectionHeading, SectionBody } from '../components/utils'
export default function RefundPolicy() {
  return (
    <div className="page-wrapper" style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
      <SectionHeading>Refund Policy</SectionHeading>
      <SectionBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <h2>Consultation Services</h2>
          <p>Our initial solar savings estimates are provided free of charge.</p>
          <h2>Installation Services</h2>
          <p>Refunds for physical installations or detailed engineering services are governed by the specific contract signed prior to the commencement of work.</p>
        </div>
      </SectionBody>
    </div>
  )
}
