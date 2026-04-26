function PaymentModal({ payment, onClose }) {
  if (!payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[28px] border border-[#d6e2ff] bg-white/90 p-6 shadow-[0_8px_30px_rgba(13,39,247,0.12)] backdrop-blur-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-2xl font-semibold text-transparent">
              Payment - {payment.office}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Submit your payment reference for verification.
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
            <p className="text-sm font-medium text-gray-500">Amount</p>
            <h3 className="mt-2 text-3xl font-semibold text-[#0D27F7]">
              ₱{payment.amount}
            </h3>

            <div className="mt-5 rounded-xl border border-[#e2ebff] bg-blue-50 p-4 text-center text-sm text-gray-500">
              QR Code Placeholder
            </div>

            <p className="mt-4 text-sm text-gray-500">
              GCash / Maya accepted. You may also pay via cash or walk-in.
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500">
                PAYMENT METHOD
              </label>
              <select className="h-[53px] w-full rounded-[12px] border border-[#e2ebff] bg-white/60 px-4 text-sm text-gray-600 outline-none focus:border-[#0D27F7] focus:ring-2 focus:ring-[#0D27F7]/15">
                <option>QR Code</option>
                <option>Cash / Walk-in</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500">
                REFERENCE NUMBER
              </label>
              <input
                placeholder="Enter GCash/Maya ref#"
                className="h-[53px] w-full rounded-[12px] border border-[#e2ebff] bg-white/60 px-4 text-sm outline-none focus:border-[#0D27F7] focus:ring-2 focus:ring-[#0D27F7]/15"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500">
                NOTES
              </label>
              <textarea
                placeholder="Optional message"
                className="min-h-28 w-full rounded-[12px] border border-[#e2ebff] bg-white/60 px-4 py-3 text-sm outline-none focus:border-[#0D27F7] focus:ring-2 focus:ring-[#0D27F7]/15"
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-6 py-3 text-sm font-semibold text-white shadow-[0_2px_10px_rgba(13,39,247,0.2)] transition hover:opacity-95 active:scale-[0.98]"
            >
              Submit Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;