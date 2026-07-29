import navLogo from "../../assets/shared/logo_rectangle.png";

export default function Header({ meta }) {
  return (
    <header className="report-header">
      <div className="report-header__brand" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <img 
          src={navLogo} 
          alt="Sun Sutra Energy" 
          crossOrigin="anonymous"
          style={{ height: '48px', width: 'auto', objectFit: 'contain', display: 'block' }} 
        />
        <div className="report-header__title">
          <div className="report-header__org" style={{ color: '#10b981', fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em' }}>{meta.preparedBy}</div>
          <h1 style={{ fontFamily: 'var(--font-display)', color: '#1c1d20', fontSize: '20px', fontWeight: 800 }}>{meta.reportTitle}</h1>
          <p className="subtitle" style={{ fontSize: '12px', color: '#6b7280' }}>{meta.reportSubtitle}</p>
        </div>
      </div>

      <div className="report-header__meta">
        <span className="client-name" style={{ fontSize: '14px', fontWeight: 700, color: '#1c1d20' }}>{meta.clientName}</span>
        <span style={{ fontSize: '11px', color: '#6b7280' }}>
          Report Date: <strong>{meta.reportDate}</strong>
        </span>
        <span style={{ fontSize: '11px', color: '#6b7280' }}>
          Report ID: <strong>{meta.reportId}</strong>
        </span>
      </div>
    </header>
  );
}
