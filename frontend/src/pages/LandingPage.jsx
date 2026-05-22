import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiZap,
  FiBell,
  FiFileText,
  FiShield,
  FiCreditCard,
  FiUsers,
} from "react-icons/fi";

const FEATURES = [
  {
    icon: <FiZap />,
    title: "Sequential approval pipeline",
    desc: "5 offices, automatic gating. No more chasing signatures around campus.",
  },
  {
    icon: <FiCreditCard />,
    title: "GCash + on-site payments",
    desc: "Upload your receipt, BYTES verifies digitally. Fines stop blocking clearance the moment they're paid.",
  },
  {
    icon: <FiFileText />,
    title: "Official clearance PDF",
    desc: "Auto-generated and downloadable once all 5 offices approve. Reference number, timestamps, all signatures included.",
  },
  {
    icon: <FiBell />,
    title: "Real-time notifications",
    desc: "Every approval, denial, and payment update lands in your inbox and in-app feed.",
  },
  {
    icon: <FiShield />,
    title: "Role-based access",
    desc: "Students, BYTES, Librarian, Adviser, Chairperson, and Dean each see only what they need.",
  },
  {
    icon: <FiUsers />,
    title: "Admin reports & exports",
    desc: "BYTES officers get live dashboards, per-stage breakdowns, and PDF/CSV report exports.",
  },
];

const STEPS = [
  { n: 1, title: "Register", desc: "Sign up with your CICS email — BYTES approves your account." },
  { n: 2, title: "Pay your fines", desc: "Settle outstanding fines via GCash or on-site." },
  { n: 3, title: "Submit clearance", desc: "One click to start your clearance request." },
  { n: 4, title: "Track approvals", desc: "Watch each office approve in real time." },
  { n: 5, title: "Download PDF", desc: "Official form available the moment the Dean approves." },
];

const LOGOS = [
  { src: "/msu-seal.png", alt: "MSU Seal" },
  { src: "/cics-logo.png", alt: "CICS Logo" },
  { src: "/bytes-logo.png", alt: "BYTES Logo" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-white via-[#f6faff] to-[#eef4ff] font-inter">
      {/* Navigation */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0D27F7] to-[#1767FE] text-sm font-bold text-white shadow-md">
            EC
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-[#0D27F7]">CICS</p>
            <p className="text-xs font-medium text-gray-500">E-Clearance</p>
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-full px-5 py-2 text-sm font-semibold text-[#0D27F7] transition hover:bg-blue-50"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="flex items-center gap-2 rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(13,39,247,0.25)] transition hover:opacity-95"
          >
            Get started <FiArrowRight />
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#dbe7ff] bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#0D27F7] backdrop-blur">
            <FiCheckCircle /> Now live for AY 2025–2026
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Clearance,{" "}
            <span className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-transparent">
              done digitally.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">
            The official e-clearance portal for the College of Information and Computing Studies,
            MSU Main Campus. Submit, track, and complete your enrollment clearance from your phone —
            no more office-to-office signatures.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="flex items-center gap-2 rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(13,39,247,0.25)] transition hover:opacity-95 active:scale-[0.98]"
            >
              Create your account <FiArrowRight />
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-[#dbe7ff] bg-white px-7 py-3.5 text-sm font-semibold text-[#0D27F7] transition hover:bg-blue-50"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            {LOGOS.map((logo) => (
              <img
                key={logo.src}
                src={logo.src}
                alt={logo.alt}
                className="h-12 w-12 object-contain opacity-80"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ))}
            <p className="text-xs font-medium text-gray-500">
              College of Information & Computing Studies · MSU Main Campus
            </p>
          </div>
        </div>

        {/* Hero visual */}
        <div className="relative">
          <div className="absolute -left-8 -top-8 h-48 w-48 rounded-full bg-[#0D27F7]/10 blur-3xl" />
          <div className="absolute -bottom-8 -right-8 h-56 w-56 rounded-full bg-[#1767FE]/15 blur-3xl" />

          <div className="relative rounded-[32px] border border-[#dbe7ff] bg-white/80 p-6 shadow-[0_20px_60px_rgba(13,39,247,0.12)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-[#e2ebff] pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0D27F7]/60">
                  Clearance Progress
                </p>
                <p className="mt-1 text-lg font-semibold text-gray-900">EC-2026-AB12CD</p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                4/5 Approved
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-blue-50">
              <div className="h-full w-4/5 bg-gradient-to-r from-[#0D27F7] to-[#0E1BEF]" />
            </div>

            <ul className="mt-5 space-y-3">
              {[
                ["BYTES Officer", "approved"],
                ["Librarian", "approved"],
                ["Faculty Adviser", "approved"],
                ["Chairperson", "approved"],
                ["Dean", "pending"],
              ].map(([role, status]) => (
                <li
                  key={role}
                  className="flex items-center justify-between rounded-2xl border border-[#e2ebff] bg-white/70 px-4 py-3"
                >
                  <p className="text-sm font-medium text-gray-700">{role}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0D27F7]/70">
            What you can do
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Everything your clearance needs, in one portal.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="rounded-[24px] border border-[#dbe7ff] bg-white/70 p-6 shadow-[0_4px_20px_rgba(13,39,247,0.04)] backdrop-blur transition hover:-translate-y-[2px] hover:border-[#c3d4ff] hover:shadow-[0_8px_30px_rgba(13,39,247,0.08)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0D27F7] to-[#1767FE] text-xl text-white shadow-sm">
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0D27F7]/70">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            From registration to PDF in 5 steps.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="rounded-[24px] border border-[#dbe7ff] bg-white/70 p-5 backdrop-blur"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#0D27F7] to-[#1767FE] text-sm font-bold text-white">
                {step.n}
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="overflow-hidden rounded-[36px] bg-gradient-to-br from-[#0D27F7] via-[#1767FE] to-[#2F80ED] p-10 text-white shadow-[0_20px_60px_rgba(13,39,247,0.25)] md:p-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <div>
              <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                Ready to start your clearance?
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-white/85">
                Register once, and your clearance lives in one place every semester. BYTES, your
                signatories, and the Dean all approve digitally.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0D27F7] shadow-md transition hover:bg-blue-50 active:scale-[0.98]"
                >
                  Create account <FiArrowRight />
                </Link>
                <Link
                  to="/login"
                  className="rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  I already have an account
                </Link>
              </div>
            </div>

            <ul className="space-y-2 text-sm text-white/85">
              {[
                "Free to use for all CICS students",
                "Approvals processed within 24 hours",
                "Official PDF accepted by the Registrar",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <FiCheckCircle className="mt-0.5 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e2ebff] bg-white/40 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-gray-500 md:flex-row">
          <p>© {new Date().getFullYear()} CICS E-Clearance · MSU Main Campus</p>
          <p>Built by the CICS — MSU Main Campus team.</p>
        </div>
      </footer>
    </main>
  );
}
