export default function Disclaimer({ text, meta }) {
  return (
    <footer className="report-section">
      <div className="disclaimer-block">
        <h4>Disclaimer</h4>
        <p>{text}</p>
      </div>

      <div className="report-footer">
        <span>{meta.reportId}</span>
        <span>
          Prepared by {meta.preparedBy} · {meta.reportDate}
        </span>
      </div>
    </footer>
  );
}
