import ApproverBoard from '../components/ApproverBoard'

// The Admin role owns the first stage of the 9-stage clearance pipeline.
export default function AdminClearanceApprovals() {
  return (
    <ApproverBoard
      title="Admin — Clearance Approvals"
      subtitle="First stage of the clearance pipeline. Approve to start the student's clearance flow."
      kind="admin"
    />
  )
}
