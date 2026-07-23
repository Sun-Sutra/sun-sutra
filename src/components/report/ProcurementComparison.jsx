export default function ProcurementComparison({ procurement }) {
  const { columns, rows } = procurement;

  return (
    <section className="report-section">
      <div className="section-heading">
        <span className="section-index">05</span>
        <h2>Procurement Comparison</h2>
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
                {row.map((cell, j) => (
                  <td key={j} className={j === 2 ? "comparison-highlight" : undefined}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
