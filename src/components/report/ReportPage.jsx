import Header from "./Header";
import ExecutiveSummary from "./ExecutiveSummary";
import ElectricityProfile from "./ElectricityProfile";
import BillComposition from "./BillComposition";
import EligibilityTable from "./EligibilityTable";
import ProcurementComparison from "./ProcurementComparison";
import FinancialImpact from "./FinancialImpact";
import EnvironmentalImpact from "./EnvironmentalImpact";
import Recommendation from "./Recommendation";
import Disclaimer from "./Disclaimer";

// Assembles every report section into a single A4-formatted page.
// `data` must match the shape produced by buildReportData().
export default function ReportPage({ data }) {
  return (
    <div className="report-viewport">
      <article className="report-page" id="report-root">
        <Header meta={data.meta} />

        <ExecutiveSummary kpis={data.kpis} companyName={data.companyName} />

        <ElectricityProfile profile={data.electricityProfile} />

        <BillComposition billComposition={data.billComposition} />

        <EligibilityTable eligibility={data.eligibility} />

        <ProcurementComparison procurement={data.procurement} />

        <FinancialImpact financialImpact={data.financialImpact} />

        <EnvironmentalImpact environmentalImpact={data.environmentalImpact} />

        <Recommendation
          recommendation={data.recommendationDetail}
          recommendationLabel={data.recommendation}
        />

        <Disclaimer text={data.disclaimer} meta={data.meta} />
      </article>
    </div>
  );
}
