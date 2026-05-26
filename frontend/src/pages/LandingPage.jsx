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
  { src: "/msu-seal.png", alt: "Mindanao State University Seal" },
  { src: "/cics-logo.png", alt: "CICS Logo" },
  { src: "/bytes-logo.png", alt: "BYTES Logo" },
  { src: "/linkcode.png", alt: "Linkcode Logo" },
  { src: "/cursor.png", alt: "Cursor Logo" },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden font-inter bg-[#f8fbff]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0D27F71A_1px,transparent_1px),linear-gradient(to_bottom,#0D27F71A_1px,transparent_1px)] bg-[size:4rem_4rem] z-0" />

      <div className="relative z-10 mx-4 sm:mx-6 md:mx-8 mt-4 sm:mt-6 overflow-hidden rounded-[40px] bg-gradient-to-br from-[#0D27F7] via-[#1767FE] to-[#2F80ED] p-8 text-white shadow-[0_24px_64px_rgba(13,39,247,0.3)]">
        <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-white/20 blur-[100px]" />
        <div className="absolute -bottom-40 -right-20 h-[600px] w-[600px] rounded-full bg-white/15 blur-[120px]" />

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
          <div className="flex flex-col leading-none">
            <p className="text-2xl font-black tracking-tight text-white">CICS</p>
            <p className="mt-1 text-lg font-bold uppercase tracking-widest text-white/80">
              E-Clearance
            </p>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full px-5 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/15 hover:text-white"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#1767FE] shadow-[0_8px_16px_rgba(23,103,254,0.2)] hover:bg-blue-50 active:scale-[0.98]"
            >
              Get started <FiArrowRight />
            </Link>
          </nav>
        </header>

        <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-10 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-28 lg:pt-16">
          <div className="flex flex-col items-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-md">
              <FiCheckCircle className="text-lg text-[#A7F3D0]" /> Now live for AY 2025–2026
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
              Clearance,{" "}
              <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                done digitally.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-white/90 md:text-lg">
              The official e-clearance portal for the College of Information and Computing Studies,
              MSU Main Campus. Submit, track, and complete your enrollment clearance from your phone —
              no more office-to-office signatures.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#1767FE] shadow-[0_8px_16px_rgba(23,103,254,0.2)] transition hover:bg-blue-50 hover:shadow-[0_12px_20px_rgba(23,103,254,0.3)] active:scale-[0.98]"
              >
                Create your account <FiArrowRight className="text-lg" />
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-md transition hover:bg-white/20 hover:shadow-[0_6px_16px_rgba(0,0,0,0.1)] active:scale-[0.98]"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-2 rounded-[22px] border border-white/30 bg-white/15 px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.1)] backdrop-blur-xl">
              {LOGOS.map((logo, index) => (
                <div key={logo.src} className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition hover:scale-105">
                    <img src={logo.src} alt={logo.alt} className="h-full w-full object-contain" />
                  </div>
                  {index !== LOGOS.length - 1 && (
                    <div className="h-6 w-px bg-white/30" />
                  )}
                </div>
              ))}
              <p className="ml-2 pr-2 text-[11px] font-semibold tracking-wide text-white/90">
                CICS • MSU Main Campus
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative overflow-hidden rounded-[32px] border border-white/40 bg-white/95 p-7 shadow-[0_24px_60px_rgba(0,0,0,0.2)] ring-1 ring-white/80 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1767FE]/70">
                    Clearance Progress
                  </p>
                  <p className="mt-1 text-lg font-bold tracking-tight text-[#1767FE]">EC-2026-AB12CD</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-[#1767FE] shadow-sm ring-1 ring-[#1767FE]/10">
                  4/5 Approved
                </span>
              </div>

              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-blue-50/50 ring-1 ring-inset ring-[#e2ebff]">
                <div className="h-full w-4/5 bg-gradient-to-r from-[#1767FE] to-[#4A90E2] shadow-[0_0_10px_rgba(23,103,254,0.4)]" />
              </div>

              <ul className="mt-6 space-y-2.5">
                {[
                  ["BYTES Officer", "approved"],
                  ["Librarian", "approved"],
                  ["Faculty Adviser", "approved"],
                  ["Chairperson", "approved"],
                  ["Dean", "pending"],
                ].map(([role, status]) => (
                  <li
                    key={role}
                    className="flex items-center justify-between rounded-[16px] border border-[#eef3ff] bg-white px-4 py-3.5 shadow-sm transition hover:bg-gray-50"
                  >
                    <p className="text-sm font-semibold text-[#1767FE]">{role}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                        status === "approved"
                          ? "bg-blue-50 text-[#1767FE] ring-1 ring-[#1767FE]/20"
                          : "bg-gray-50 text-gray-400 ring-1 ring-gray-200"
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
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1767FE]/60">
            What you can do
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1767FE] md:text-4xl">
            Everything your clearance needs, in one portal.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="group rounded-[28px] border border-[#dbe7ff]/80 bg-gradient-to-br from-white via-[#f0f5ff] to-[#dce7ff] p-7 shadow-[0_12px_32px_rgba(23,103,254,0.08)] ring-1 ring-white/80 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#b9ccff] hover:bg-gradient-to-br hover:from-[#f0f5ff] hover:via-[#dce7ff] hover:to-[#c3d6ff] hover:shadow-[0_20px_50px_rgba(23,103,254,0.15)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#1767FE] to-[#4A90E2] text-2xl text-white shadow-[0_8px_16px_rgba(23,103,254,0.25)] transition-transform duration-300 group-hover:scale-110">
                {f.icon}
              </div>
              <h3 className="mt-6 text-lg font-bold text-[#1767FE]">{f.title}</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[#1767FE]/70">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1767FE]/60">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1767FE] md:text-4xl">
            From registration to PDF in 5 steps.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="relative flex flex-col items-start rounded-[28px] border border-[#dbe7ff]/80 bg-gradient-to-br from-white via-white to-[#f0f4ff] p-6 shadow-[0_10px_24px_rgba(23,103,254,0.08)] ring-1 ring-white/80 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(23,103,254,0.12)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-white text-2xl font-black text-[#1767FE] shadow-[0_8px_16px_rgba(23,103,254,0.08)] ring-1 ring-[#dbe7ff]">
                {step.n}
              </div>
              <h3 className="mt-5 text-base font-bold text-[#1767FE]">{step.title}</h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-[#1767FE]/60">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#0D27F7] via-[#1767FE] to-[#2F80ED] p-10 text-white shadow-[0_24px_64px_rgba(23,103,254,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] md:p-16">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-white/15 blur-3xl" />

          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
                Ready to start your clearance?
              </h2>
              <p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-white/90 md:text-lg">
                Register once, and your clearance lives in one place every semester. BYTES, your
                signatories, and the Dean all approve digitally.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#1767FE] shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition hover:bg-blue-50 active:scale-[0.98]"
                >
                  Create account <FiArrowRight className="text-lg" />
                </Link>
                <Link
                  to="/login"
                  className="rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-[0.98]"
                >
                  I already have an account
                </Link>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/30 bg-white/15 p-6 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
              <ul className="space-y-4 text-sm font-medium text-white/95">
                {[
                  "Free to use for all CICS students",
                  "Approvals processed within 24 hours",
                  "Official PDF accepted by the Registrar",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <FiCheckCircle className="mt-0.5 shrink-0 text-xl text-[#A7F3D0]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[#dbe7ff] bg-white/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs font-medium text-[#1767FE]/60 md:flex-row">
          <p>© {new Date().getFullYear()} CICS E-Clearance • MSU Main Campus</p>
          <div className="flex items-center gap-4">
             <p>Built by the ITE182 A* Students</p>
          </div>
        </div>
      </footer>
    </main>
  );
}