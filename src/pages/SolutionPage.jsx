import BeforeAfter from '../components/BeforeAfter'
import CaseStudies from '../components/CaseStudies'
import Problem from '../components/Problem'
import Solution from '../components/Solution'
import Timeline from '../components/Timeline'
import ValueProp from '../components/ValueProp'
import WhyNow from '../components/WhyNow'
import { SectionLabel, SectionHeading, SectionBody, container } from '../components/utils'

export default function SolutionPage() {
  return (
    <div className="page-wrapper">
      <BeforeAfter />
      <Problem />
      <Solution />
      <Timeline />
      <ValueProp />
      <CaseStudies />
      <WhyNow />
    </div>
  )
}
