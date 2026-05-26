import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  FiZap,
  FiBell,
  FiShield,
  FiFileText,
  FiCreditCard,
  FiUsers,
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiUser,
  FiArrowLeft,
} from "react-icons/fi";

const FEATURES = [
  {
    icon: <FiZap />,
    title: "Instant tracking",
    desc: "Track every step from your device without visiting multiple offices.",
  },
  {
    icon: <FiBell />,
    title: "Instant notifications",
    desc: "Get updated when an office approves or flags your clearance.",
  },
  {
    icon: <FiShield />,
    title: "Parallel processing",
    desc: "Offices can review clearance requests concurrently.",
  },
  {
    icon: <FiFileText />,
    title: "Official clearance report",
    desc: "Download or print your clearance immediately once completed.",
  },
  {
    icon: <FiCreditCard />,
    title: "Secure payments",
    desc: "Pay obligations seamlessly without long queues.",
  },
  {
    icon: <FiUsers />,
    title: "Centralized support",
    desc: "Direct support to address clearance issues efficiently.",
  },
];

const LOGOS = [
  { src: "/msu-seal.png", alt: "Mindanao State University Seal" },
  { src: "/cics-logo.png", alt: "CICS Logo" },
  { src: "/bytes-logo.png", alt: "BYTES Logo" },
  { src: "/linkcode.png", alt: "Linkcode Logo" },
  { src: "/cursor.png", alt: "Cursor Logo" },
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
        const role = result.user?.role;
        const dashByRole = {
          admin: "/admin/dashboard",
          cursor_org: "/cursor/dashboard",
          department_org: "/department/dashboard",
          bytes_officer: "/bytes/dashboard",
          librarian: "/librarian/dashboard",
          faculty_adviser: "/adviser/dashboard",
          chairperson: "/chairperson/dashboard",
          dean: "/dean/dashboard",
          enrolling_faculty: "/enrolling/dashboard",
        };
        navigate(dashByRole[role] || "/student/dashboard");
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
    <main className="relative min-h-screen w-full overflow-hidden font-inter p-4 md:p-6 flex items-center justify-center">
      <img
        src="/college-building.png"
        alt="College Building Background"
        className="absolute inset-0 h-full w-full object-cover -z-40"
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-[#f8fbff]/90 to-[#eef4ff]/85 backdrop-blur-[2px] -z-30" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0D27F705_1px,transparent_1px),linear-gradient(to_bottom,#0D27F705_1px,transparent_1px)] bg-[size:4rem_4rem] -z-20" />

      <div className="absolute -top-40 -right-40 h-[800px] w-[800px] rounded-full bg-gradient-to-bl from-[#0D27F7]/10 to-transparent blur-[120px] -z-10" />
      <div className="absolute -bottom-40 left-0 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-[#1767FE]/10 to-transparent blur-[120px] -z-10" />

      <Link
        to="/"
        className="absolute left-4 top-4 z-50 flex items-center gap-1.5 rounded-full border border-[#dbe7ff] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#0D27F7] shadow-sm backdrop-blur-md transition hover:bg-white hover:shadow-md md:left-6 md:top-6"
      >
        <FiArrowLeft className="text-sm" /> Back to homepage
      </Link>

      <div className="relative z-10 mx-auto grid w-full max-w-[1200px] items-center gap-8 lg:grid-cols-[minmax(390px,0.9fr)_minmax(560px,1.1fr)]">
        <section className="flex min-w-0 flex-col items-center justify-center">
          <section className="flex w-full max-w-[440px] flex-col justify-center rounded-[36px] border border-[#dbe7ff] bg-white/85 px-8 py-12 shadow-[0_20px_50px_rgba(13,39,247,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-white/80 backdrop-blur-xl sm:px-10">
            <div className="mb-10 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0D27F7] to-[#1767FE] text-white shadow-[0_8px_16px_rgba(13,39,247,0.2)]">
                <FiUser className="text-2xl" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-[#0D27F7]">Sign In</h2>
              <p className="mt-2 text-sm font-medium text-gray-500">Sign in to your clearance portal.</p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-[#0D27F7]/70">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0D27F7]/50" />
                  <input
                    type="email"
                    placeholder="your@cics.edu.ph"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full rounded-[14px] border border-[#dbe7ff] bg-white/60 px-4 pl-11 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 hover:bg-white focus:border-[#0D27F7] focus:bg-white focus:ring-4 focus:ring-[#0D27F7]/15"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-[#0D27F7]/70">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0D27F7]/50" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 w-full rounded-[14px] border border-[#dbe7ff] bg-white/60 px-4 pl-11 pr-12 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 hover:bg-white focus:border-[#0D27F7] focus:bg-white focus:ring-4 focus:ring-[#0D27F7]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#0D27F7]"
                  >
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-12 items-center justify-center rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] text-sm font-bold text-white shadow-[0_8px_16px_rgba(13,39,247,0.15)] transition hover:opacity-95 hover:shadow-[0_12px_20px_rgba(13,39,247,0.2)] active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-8 border-t border-[#e2ebff] pt-6">
              <p className="text-center text-sm font-medium text-gray-500">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="font-bold text-[#1767FE] transition hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </section>
        </section>

        <section className="relative hidden min-h-[640px] items-center justify-center overflow-hidden rounded-[40px] bg-gradient-to-br from-[#0D27F7] via-[#1767FE] to-[#2F80ED] p-8 text-white shadow-[0_24px_64px_rgba(13,39,247,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] lg:flex xl:p-10">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          
          <div className="relative z-10 flex w-full max-w-[480px] flex-col items-center gap-6 text-center">
            <div className="flex items-center justify-center">
              <div className="flex flex-wrap items-center gap-2 rounded-[22px] border border-white/20 bg-white/10 px-4 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-xl">
                {LOGOS.map((logo, index) => (
                  <div key={logo.src} className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition hover:scale-105">
                      <img src={logo.src} alt={logo.alt} className="h-full w-full object-contain" />
                    </div>
                    {index !== LOGOS.length - 1 && (
                      <div className="h-5 w-px bg-white/20" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold leading-tight tracking-tight xl:text-4xl">CICS E-Clearance</h2>
              <p className="mx-auto mt-3 max-w-[410px] text-sm font-medium leading-relaxed text-white/85">
                Complete your clearance digitally. Track every step from your device without visiting multiple offices.
              </p>
            </div>

            <div className="mt-2 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <article
                  key={feature.title}
                  className="group flex min-h-[64px] items-start gap-3 rounded-[20px] border border-white/20 bg-white/10 p-3.5 text-left shadow-[inset_0_0_16px_rgba(255,255,255,0.05)] backdrop-blur-md transition hover:bg-white/15"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white text-lg text-[#0D27F7] shadow-sm transition-transform group-hover:scale-110">
                    {feature.icon}
                  </span>
                  <div>
                    <h3 className="text-[13px] font-bold tracking-tight text-white">{feature.title}</h3>
                    <p className="mt-0.5 text-[11px] font-medium leading-snug text-white/75">{feature.desc}</p>
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