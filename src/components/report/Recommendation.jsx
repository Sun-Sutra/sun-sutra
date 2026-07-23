export default function Recommendation({ recommendation, recommendationLabel }) {
  return (
    <section className="report-section">
      <div className="section-heading">
        <span className="section-index">08</span>
        <h2>Final Recommendation</h2>
      </div>

      <div className="recommendation-card">
        <span className="recommendation-tag">{recommendationLabel}</span>
        <h3>{recommendation.headline}</h3>
        <ul className="recommendation-list">
          {recommendation.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
