function StatusPill({ status }) {
  const variant = status.toLowerCase() === "eligible" ? "eligible" : "applicable";
  return <span className={`status-pill status-pill--${variant}`}>{status}</span>;
}

export default function EligibilityTable({ eligibility }) {
  const { columns, rows } = eligibility;

  return (
    <section className="report-section">
      <div className="section-heading">
        <span className="section-index">04</span>
        <h2>Eligibility Assessment</h2>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="report-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) =>
                  j === row.length - 1 ? (
                    <td key={j}>
                      <StatusPill status={cell} />
                    </td>
                  ) : (
                    <td key={j}>{cell}</td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
