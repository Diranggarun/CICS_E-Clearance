import { useState } from "react";
import { FiSave } from "react-icons/fi";
import { isPaymentOffice } from "../config/officeConfig";
import { currentOfficer } from "../config/officeConfig";

function OfficerRequirement() {
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const appleCard =
    "rounded-[28px] border border-[#d6e2ff] bg-white/70 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl transition-all duration-200 hover:border-[#c3d4ff] hover:shadow-[0_8px_30px_rgba(13,39,247,0.08)]";

  const inputClass =
    "mt-2 w-full rounded-[12px] border border-[#dbe7ff] bg-white/70 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#0D27F7]/20";

  return (
    <div className="space-y-8 font-inter">
      <div>
        <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
          Requirements
        </h1>
        <p className="mt-2 text-base font-medium text-gray-500 md:text-lg">
          Create and manage clearance requirements for your office.
        </p>
      </div>

      <div className={`${appleCard} p-6`}>
        <h2 className="text-xl font-semibold text-[#0D27F7]">
          Requirement Setup
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Add payment details or office requirements.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-500">
              Requirement Name
            </label>
            <input
              className={inputClass}
             placeholder={`e.g. ${currentOfficer.assignedOffice} Requirement`}
            />
          </div>

          {isPaymentOffice && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Amount (PHP)
                </label>
                <input className={inputClass} type="number" placeholder="100" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Applies To
                </label>
                <select className={inputClass}>
                  <option>All Students</option>
                  <option>BSIT</option>
                  <option>BSCS</option>
                  <option>BSIS</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">
                  Payment Method
                </label>

                <div className="mt-2 grid gap-3 md:grid-cols-3">
                  {["Cash", "QR Code", "Both"].map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`rounded-2xl border px-4 py-4 text-sm font-semibold transition ${
                        paymentMethod === method
                          ? "border-[#0D27F7] bg-[#0D27F7] text-white shadow-[0_8px_24px_rgba(13,39,247,0.18)]"
                          : "border-[#e2ebff] bg-white/60 text-gray-500 hover:border-[#0D27F7] hover:bg-blue-50 hover:text-[#0D27F7]"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                <p className="mt-2 text-xs font-medium text-gray-500">
                  Selected payment method:{" "}
                  <span className="text-[#0D27F7]">{paymentMethod}</span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Account Details
                </label>
                <input
                  className={inputClass}
                  placeholder="GCash name / account number"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-sm font-medium text-gray-500">
              Deadline
            </label>
            <input className={inputClass} type="date" />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-500">
              Instruction
            </label>
            <textarea
              rows="4"
              className={`${inputClass} resize-none`}
              placeholder="Add instructions for students..."
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="flex items-center gap-2 rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98]">
            <FiSave />
            Save Requirement
          </button>
        </div>
      </div>
    </div>
  );
}

export default OfficerRequirement;