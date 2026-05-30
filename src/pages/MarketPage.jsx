import Market from '../components/Market'
import BusinessModel from '../components/BusinessModel'
import { SectionLabel, SectionHeading, SectionBody, container } from '../components/utils'

export default function MarketPage() {
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
          <SectionLabel>Market &amp; Business Model</SectionLabel>
          <SectionHeading>Capturing a Growing Opportunity</SectionHeading>
          <SectionBody style={{ margin: '0 auto' }}>
            A sustainable, volume-driven revenue model aligned with client savings and localized cluster operations.
          </SectionBody>
        </div>
      </div>

      <Market />
      <BusinessModel />
    </div>
  )
}
