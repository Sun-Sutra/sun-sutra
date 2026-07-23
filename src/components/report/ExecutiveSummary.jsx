export default function ExecutiveSummary({ kpis, companyName }) {
  return (
    <section className="report-section">
      <div className="section-heading">
        <span className="section-index">01</span>
        <h2>Executive Summary</h2>
      </div>

      <p className="section-subtext">
        This assessment evaluates {companyName}'s electricity procurement profile and
        recommends a renewable energy sourcing strategy based on consumption patterns,
        regulatory eligibility, and long-term financial impact.
      </p>

      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <div className="kpi-card" key={kpi.label}>
            <span className="kpi-label">{kpi.label}</span>
            <span className="kpi-value">{kpi.value}</span>
            <span className="kpi-unit">{kpi.unit}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
