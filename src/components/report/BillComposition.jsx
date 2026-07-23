const SEGMENT_COLORS = [
  "var(--rpt-color-primary)",
  "var(--rpt-color-primary-light)",
  "var(--rpt-color-accent)",
  "#7c8f83",
  "#c9d0c9",
];

export default function BillComposition({ billComposition }) {
  const { items, totalAnnualBill } = billComposition;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <section className="report-section">
      <div className="section-heading">
        <span className="section-index">03</span>
        <h2>Bill Composition</h2>
      </div>

      <div className="card bill-layout">
        <div className="donut-chart-area">
          <svg width="180" height="180" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="var(--rpt-color-border)"
              strokeWidth="14"
            />
            {items.map((item, i) => {
              const dash = (item.value / 100) * circumference;
              const circle = (
                <circle
                  key={item.label}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                  strokeWidth="14"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offsetAcc}
                  transform="rotate(-90 50 50)"
                  strokeLinecap="butt"
                />
              );
              offsetAcc += dash;
              return circle;
            })}
            <text
              x="50"
              y="47"
              textAnchor="middle"
              className="donut-total-value"
            >
              100%
            </text>
            <text
              x="50"
              y="58"
              textAnchor="middle"
              className="donut-total-label"
            >
              of bill
            </text>
          </svg>
        </div>

        <div className="bill-legend">
          <div className="stat-row" style={{ borderBottom: "1px solid var(--rpt-color-border)" }}>
            <span className="stat-label">Total Annual Bill</span>
            <span className="stat-value">{totalAnnualBill}</span>
          </div>
          {items.map((item, i) => (
            <div className="legend-row" key={item.label}>
              <span
                className="legend-swatch"
                style={{ background: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
              />
              <span className="legend-label">{item.label}</span>
              <span className="legend-value">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
