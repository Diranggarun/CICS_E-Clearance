import ApproverBoard from '../components/ApproverBoard'

export default function DepartmentDashboard() {
  return (
    <ApproverBoard
      title="Department — Clearance Approvals"
      subtitle="Approve students once the Department organization fee is settled. Verify payments under Payments."
      kind="department_org"
    />
  )
}
