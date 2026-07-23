export default function Header({ meta }) {
  return (
    <header className="report-header">
      <div className="report-header__brand">
        <div className="report-header__logo" aria-hidden="true">
          AE
        </div>
        <div className="report-header__title">
          <div className="report-header__org">{meta.preparedBy}</div>
          <h1>{meta.reportTitle}</h1>
          <p className="subtitle">{meta.reportSubtitle}</p>
        </div>
      </div>

      <div className="report-header__meta">
        <span className="client-name">{meta.clientName}</span>
        <span>
          Report Date: <strong>{meta.reportDate}</strong>
        </span>
        <span>
          Report ID: <strong>{meta.reportId}</strong>
        </span>
      </div>
    </header>
  );
}
