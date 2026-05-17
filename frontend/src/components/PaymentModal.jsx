import { useState } from "react";

function PaymentModal({ payment, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState("QR Code");

  if (!payment) return null;

  const isPaymentRequired = payment.amount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[28px] border border-[#d6e2ff] bg-white/90 p-6 shadow-[0_8px_30px_rgba(13,39,247,0.12)] backdrop-blur-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-2xl font-semibold text-transparent">
              {isPaymentRequired
                ? `Payment - ${payment.office}`
                : `Requirement - ${payment.office}`}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isPaymentRequired
                ? "Submit your payment details for officer verification."
                : "Submit your requirement or remarks for officer review."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-[#e2ebff] bg-white px-3 py-1 text-sm text-gray-500 transition hover:bg-blue-50"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#e2ebff] bg-white/70 p-5">
            <p className="text-sm font-medium text-gray-500">
              {isPaymentRequired ? "Amount" : "Requirement"}
            </p>

            <h3 className="mt-2 text-3xl font-semibold text-[#0D27F7]">
              {isPaymentRequired
                ? `₱${payment.amount}`
                : payment.requirement || "Office Requirement"}
            </h3>

            {isPaymentRequired ? (
              <>
                <div className="mt-5 rounded-xl border border-[#e2ebff] bg-blue-50 p-4 text-center text-sm text-gray-500">
                  QR Code Placeholder
                </div>

                <p className="mt-4 text-sm text-gray-500">
                  GCash / Maya accepted. Cash or walk-in may also be available.
                </p>
              </>
            ) : (
              <div className="mt-5 rounded-xl border border-[#e2ebff] bg-blue-50 p-4 text-sm text-gray-500">
                Please ensure your documents or requirements are complete before
                submission.
              </div>
            )}
          </div>

          <form className="space-y-4">
            {isPaymentRequired && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-500">
                    PAYMENT METHOD
                  </label>

                  <div className="grid gap-3 grid-cols-2">
                    {["QR Code", "Cash / Walk-in"].map((method) => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                          paymentMethod === method
                            ? "border-[#0D27F7] bg-[#0D27F7] text-white"
                            : "border-[#e2ebff] bg-white/60 text-gray-500 hover:border-[#0D27F7] hover:text-[#0D27F7]"
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-500">
                    REFERENCE NUMBER
                  </label>

                  <input
                    placeholder="Enter payment reference"
                    className="h-[53px] w-full rounded-[12px] border border-[#e2ebff] bg-white/60 px-4 text-sm outline-none focus:border-[#0D27F7] focus:ring-2 focus:ring-[#0D27F7]/15"
                  />
                </div>
              </>
            )}

            {!isPaymentRequired && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-500">
                  REQUIREMENT DETAILS
                </label>

                <input
                  placeholder="Enter submitted requirement"
                  className="h-[53px] w-full rounded-[12px] border border-[#e2ebff] bg-white/60 px-4 text-sm outline-none focus:border-[#0D27F7] focus:ring-2 focus:ring-[#0D27F7]/15"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500">
                UPLOAD PAYMENT PROOF
              </label>

              <input
                type="file"
                accept="image/*,.pdf"
                className="w-full rounded-[12px] border border-[#e2ebff] bg-white/60 px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500">
                NOTES
              </label>

              <textarea
                placeholder="Optional remarks"
                className="min-h-28 w-full rounded-[12px] border border-[#e2ebff] bg-white/60 px-4 py-3 text-sm outline-none focus:border-[#0D27F7] focus:ring-2 focus:ring-[#0D27F7]/15"
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-6 py-3 text-sm font-semibold text-white shadow-[0_2px_10px_rgba(13,39,247,0.2)] transition hover:opacity-95 active:scale-[0.98]"
            >
              {isPaymentRequired
                ? "Submit Payment"
                : "Submit Requirement"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;