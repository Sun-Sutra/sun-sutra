import Problem from '../components/Problem'
import Solution from '../components/Solution'
import ValueProp from '../components/ValueProp'
import WhyNow from '../components/WhyNow'
import { SectionLabel, SectionHeading, SectionBody, container } from '../components/utils'

export default function SolutionPage() {
  return (
    <div style={{ paddingTop: '30px' }}>

      <Problem />
      <Solution />
      <ValueProp />
      <WhyNow />
    </div>
  )
}
