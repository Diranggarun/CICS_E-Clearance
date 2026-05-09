import { FiSave, FiCreditCard } from "react-icons/fi";
import { officeRules } from "../config/officeConfig";

function ManageClearance() {
  const currentOfficer = {
    name: "Carlo Reyes",
    assignedOffice: "Student Council",
  };

  const rule = officeRules[currentOfficer.assignedOffice];

  const glassCard =
    "rounded-[28px] border border-[#d6e2ff] bg-white/70 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0D27F7]/60">
          Manage Clearance
        </p>
        <h1 className="mt-3 bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
          Update Student Status
        </h1>
        <p className="mt-2 text-gray-500">
          Set approval, pending status, requirements, or payment actions.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className={`${glassCard} p-6`}>
          <h2 className="text-xl font-semibold text-[#0D27F7]">
            Office Configuration
          </h2>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-[#e2ebff] bg-white/60 p-4">
              <p className="text-sm text-gray-500">Assigned Office</p>
              <p className="mt-1 text-lg font-semibold text-[#0D27F7]">
                {currentOfficer.assignedOffice}
              </p>
            </div>

            <div className="rounded-2xl border border-[#e2ebff] bg-white/60 p-4">
              <p className="text-sm text-gray-500">Payment</p>
              <p className="mt-1 text-lg font-semibold text-[#0D27F7]">
                {rule.payment ? `Required — ₱${rule.fee}` : "Not Required"}
              </p>
            </div>

            <div className="rounded-2xl border border-[#e2ebff] bg-white/60 p-4">
              <p className="text-sm text-gray-500">Default Requirements</p>
              <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
                {rule.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={`${glassCard} p-6`}>
          <h2 className="text-xl font-semibold text-[#0D27F7]">
            Clearance Form
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Student ID
              </label>
              <input
                type="text"
                placeholder="2021-0001"
                className="mt-2 w-full rounded-[12px] border border-[#dbe7ff] bg-white/70 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#0D27F7]/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Student Name
              </label>
              <input
                type="text"
                placeholder="Maria Santos"
                className="mt-2 w-full rounded-[12px] border border-[#dbe7ff] bg-white/70 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#0D27F7]/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Status
              </label>
              <select className="mt-2 w-full rounded-[12px] border border-[#dbe7ff] bg-white/70 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#0D27F7]/20">
                <option>Approved</option>
                <option>Pending</option>
                {rule.payment && <option>Pay Now</option>}
              </select>
            </div>

            {rule.payment && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Fee Amount
                </label>
                <div className="mt-2 flex items-center gap-2 rounded-[12px] border border-[#dbe7ff] bg-white/70 px-4 py-3">
                  <FiCreditCard className="text-[#0D27F7]" />
                  <input
                    type="number"
                    defaultValue={rule.fee}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-600">
              Remarks / Requirement
            </label>
            <textarea
              rows="4"
              placeholder="Add remarks or missing requirements..."
              className="mt-2 w-full resize-none rounded-[12px] border border-[#dbe7ff] bg-white/70 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#0D27F7]/20"
            />
          </div>

          <button className="mt-6 flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(13,39,247,0.2)] transition hover:opacity-90 active:scale-[0.98]">
            <FiSave />
            Save Clearance Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageClearance;