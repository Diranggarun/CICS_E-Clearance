import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  FiBell,
  FiZap,
  FiFileText,
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiUser,
} from "react-icons/fi";

const FEATURES = [
  {
    icon: <FiBell />,
    title: "Real-time notifications",
    desc: "Get updated when an office approves or flags your clearance.",
  },
  {
    icon: <FiZap />,
    title: "Faster approvals",
    desc: "Offices can review clearance requests in parallel.",
  },
  {
    icon: <FiFileText />,
    title: "Clearance report",
    desc: "Download or print your clearance once completed.",
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const result = await loginUser(email, password);
      if (result.success) {
        toast.success("Welcome back!");
        navigate("/student");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden p-4 font-inter md:p-6">
      <img
        src="/college-building.png"
        alt="College Building Background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/82 via-[#f8fbff]/88 to-[#eef4ff]/86" />
      <div className="absolute inset-0 bg-white/60" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-48px)] max-w-6xl items-center gap-8 lg:grid-cols-[minmax(390px,0.9fr)_minmax(560px,1.1fr)]">
        <section className="flex min-w-0 flex-col items-center justify-center">
          <section className="flex min-h-[640px] w-full max-w-[430px] flex-col justify-center rounded-[30px] border border-[#dbe7ff] bg-white px-9 py-12 shadow-[0_10px_32px_rgba(13,39,247,0.08),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-10px_24px_rgba(13,39,247,0.025)] ring-1 ring-white/80">
            <div className="mb-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center text-[#0D27F7]">
                <FiUser className="text-4xl" />
              </div>
              <h2 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-bold text-transparent">Sign in</h2>
              <p className="mt-2 text-sm font-medium text-gray-500">Access your clearance portal.</p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0D27F7]/60" />
                  <input type="email" placeholder="your@cics.edu.ph" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 w-full rounded-[12px] border border-[#dbe7ff] bg-white px-4 pl-11 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0D27F7] focus:ring-4 focus:ring-[#0D27F7]/15" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0D27F7]/60" />
                  <input type={showPass ? "text" : "password"} placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 w-full rounded-[12px] border border-[#dbe7ff] bg-white px-4 pl-11 pr-12 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0D27F7] focus:ring-4 focus:ring-[#0D27F7]/15" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#0D27F7]">
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs font-medium text-[#1767FE] underline-offset-4 transition hover:underline">Forgot password?</Link>
              </div>

              <button type="submit" disabled={loading} className="h-12 rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] text-sm font-semibold text-white shadow-[0_8px_24px_rgba(13,39,247,0.2)] transition hover:opacity-95 active:scale-[0.98] disabled:opacity-60">
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <div className="mt-8 border-t border-[#e2ebff] pt-6">
              <p className="text-center text-sm font-medium text-gray-500">
                Don&apos;t have an account? <Link to="/register" className="font-semibold text-[#1767FE] transition hover:underline">Create one</Link>
              </p>
            </div>
          </section>
        </section>

        <section className="relative hidden min-h-[640px] items-center justify-center overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0D27F7] via-[#1767FE] to-[#2F80ED] p-9 text-white shadow-[0_18px_50px_rgba(13,39,247,0.18),inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-18px_30px_rgba(0,0,0,0.06)] lg:flex">
          <div className="absolute -left-24 -top-28 h-72 w-72 rounded-full bg-white/10 blur-xl" />
          <div className="absolute -bottom-32 -right-24 h-64 w-64 rounded-full bg-white/10 blur-xl" />
          <div className="relative z-10 flex w-full max-w-[460px] flex-col items-center gap-5 text-center">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3 rounded-[22px] border border-white/35 bg-white/20 px-4 py-3 backdrop-blur-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 p-2 ring-1 ring-white/80">
                  <img src="/msu-seal.png" alt="MSU Seal" className="h-full w-full object-contain" />
                </div>
                <div className="h-9 w-px bg-white/35" />
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 p-2 ring-1 ring-white/80">
                  <img src="/cics-logo.png" alt="CICS Logo" className="h-full w-full object-contain" />
                </div>
                <div className="h-9 w-px bg-white/35" />
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 p-2 ring-1 ring-white/80">
                  <img src="/bytes-logo.png" alt="BYTES Logo" className="h-full w-full object-contain" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold leading-tight">CICS<br />E-Clearance Portal</h2>
              <p className="mx-auto mt-3 max-w-[410px] text-sm font-medium leading-6 text-white/85">
                Complete your clearance digitally. Track every step from your device without visiting multiple offices.
              </p>
            </div>

            <div className="flex w-full max-w-[400px] flex-col gap-3">
              {FEATURES.map((feature) => (
                <article key={feature.title} className="flex min-h-[64px] items-center gap-3 rounded-2xl border border-white/45 bg-white/10 p-3.5 text-left shadow-[inset_0_0_16px_rgba(255,255,255,0.10)] backdrop-blur-sm transition hover:bg-white/15">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg text-[#0D27F7] shadow-sm">{feature.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                    <p className="mt-0.5 text-xs leading-4 text-white/75">{feature.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}