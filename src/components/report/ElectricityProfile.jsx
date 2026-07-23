export default function ElectricityProfile({ profile }) {
  const maxUnits = Math.max(...profile.monthly.map((m) => m.units));

  const stats = [
    ["Connected Load", profile.connectedLoad],
    ["Contract Demand", profile.contractDemand],
    ["Voltage Level", profile.voltageLevel],
    ["Tariff Category", profile.tariffCategory],
    ["Avg. Monthly Units", profile.avgMonthlyUnits],
    ["Load Factor", profile.loadFactor],
    ["Peak Demand", profile.peakDemand],
    ["Distribution Utility", profile.distributionUtility],
  ];

  return (
    <section className="report-section">
      <div className="section-heading">
        <span className="section-index">02</span>
        <h2>Consumer Electricity Profile</h2>
      </div>

      <div className="card profile-grid">
        <div className="profile-stat-list">
          {stats.map(([label, value]) => (
            <div className="stat-row" key={label}>
              <span className="stat-label">{label}</span>
              <span className="stat-value">{value}</span>
            </div>
          ))}
        </div>

        <div>
          <span className="stat-label">Monthly Consumption (kWh)</span>
          <div className="bar-chart chart-wrapper">
            {profile.monthly.map((m) => (
              <div
                key={m.month}
                className="bar"
                style={{ height: `${(m.units / maxUnits) * 100}%` }}
              >
                <span className="bar-label">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
