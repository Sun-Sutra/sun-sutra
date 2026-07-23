export default function EnvironmentalImpact({ environmentalImpact }) {
  const stats = [
    ["🌿", environmentalImpact.annualCO2Reduction, "Annual CO₂ Reduction"],
    ["🌍", environmentalImpact.lifetimeCO2Reduction, "Lifetime CO₂ Reduction"],
    ["🌳", environmentalImpact.equivalentTrees, "Trees Equivalent"],
    ["🚗", environmentalImpact.equivalentCars, "Cars Off the Road"],
    ["⚡", environmentalImpact.renewableEnergyShare, "Renewable Share"],
  ];

  return (
    <section className="report-section">
      <div className="section-heading">
        <span className="section-index">07</span>
        <h2>Environmental Impact</h2>
      </div>

      <div className="eco-grid">
        {stats.map(([icon, value, label]) => (
          <div className="eco-stat" key={label}>
            <div className="eco-icon" aria-hidden="true">
              {icon}
            </div>
            <div className="eco-value">{value}</div>
            <div className="eco-label">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
