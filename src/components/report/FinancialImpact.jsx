export default function FinancialImpact({ financialImpact }) {
  const { savingsCards, yearlyProjection, npv, irr, paybackPeriod, tenureYears } =
    financialImpact;

  const maxSavings = Math.max(...yearlyProjection.map((p) => p.savings));

  return (
    <section className="report-section">
      <div className="section-heading">
        <span className="section-index">06</span>
        <h2>Financial Impact</h2>
      </div>

      <div className="financial-grid">
        <div className="card">
          <span className="stat-label">
            Projected Annual Savings — {tenureYears} Year Tenure (₹ Lakh)
          </span>
          <div className="line-chart-area">
            {yearlyProjection.map((p) => (
              <div
                key={p.year}
                className="bar"
                style={{
                  height: `${(p.savings / maxSavings) * 100}%`,
                  flex: 1,
                  position: "relative",
                }}
              >
                <span className="bar-label">{p.year}</span>
              </div>
            ))}
          </div>

          <div className="financial-stats">
            <div className="financial-stat">
              <div className="value">{npv}</div>
              <div className="label">NPV</div>
            </div>
            <div className="financial-stat">
              <div className="value">{irr}</div>
              <div className="label">IRR</div>
            </div>
            <div className="financial-stat">
              <div className="value">{paybackPeriod}</div>
              <div className="label">Payback</div>
            </div>
          </div>
        </div>

        <div className="savings-cards">
          {savingsCards.map((sc) => (
            <div className="savings-card" key={sc.label}>
              <span className="savings-label">{sc.label}</span>
              <span className="savings-value">{sc.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
