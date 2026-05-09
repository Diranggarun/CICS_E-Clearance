import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../api/auth";
import styles from "./LoginPage.module.css";

const FEATURES = [
  {
    icon: "🔔",
    title: "Real-time notifications",
    desc: "Get instantly updated when a signatory approves or flags your clearance.",
  },
  {
    icon: "⚡",
    title: "Parallel approvals — faster process",
    desc: "Multiple offices review simultaneously so you never wait in line.",
  },
  {
    icon: "📄",
    title: "One-click PDF generation",
    desc: "Download your clearance document once fully approved.",
  },
];

export default function LoginPage() {
  const navigate = useNavigate();

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
      const res = await login(email, password);

      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user?.role || res.data.role;

      toast.success("Welcome back!");

      const dest = {
        student: "/student/dashboard",
        bytes_officer: "/admin/dashboard",
        librarian: "/officer/dashboard",
        faculty_adviser: "/officer/dashboard",
        chairperson: "/officer/dashboard",
        dean: "/officer/dashboard",
      }[role] || "/login";

      navigate(dest);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.leftPanel}>
        <div className={styles.brand}>
         <div className={styles.logoCircle}>
        <div className={styles.logoMark}>
          <span>EC</span>
        </div>
      </div>

          <h1 className={styles.brandName}>CICS E-Clearance</h1>
        </div>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Sign in</h2>
            <p className={styles.cardSubtitle}>
              Sign in to your CICS clearance portal.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>EMAIL</label>
              <input
                type="email"
                className={styles.input}
                placeholder="your@cics.edu.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>PASSWORD</label>

              <div className={styles.inputWrapper}>
                <input
                  type={showPass ? "text" : "password"}
                  className={styles.input}
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPass((value) => !value)}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className={styles.forgotRow}>
              <Link to="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className={styles.loginBtn} disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className={styles.registerText}>
            Don&apos;t have an account?{" "}
            <Link to="/register" className={styles.registerLink}>
              Create one
            </Link>
          </p>
        </section>
      </section>

      <section className={styles.rightPanel}>
        <div className={styles.rightContent}>
          <div className={styles.heroLogos}>
            <img
              src="/msu-seal.png"
              alt="Mindanao State University Seal"
              className={`${styles.heroLogo} ${styles.heroLogoMsu}`}
            />
            <img
              src="/cics-logo.png"
              alt="CICS Logo"
              className={styles.heroLogo}
            />
          </div>

          <div className={styles.heroText}>
            <h2 className={styles.heroTitle}>
              CICS Digital
              <br />
              Clearance Portal
            </h2>

            <p className={styles.heroSubtitle}>
              Complete your clearance digitally. No more running between offices
              — track every step from your device.
            </p>
          </div>

          <div className={styles.features}>
            {FEATURES.map((feature) => (
              <article key={feature.title} className={styles.featureCard}>
                <span className={styles.featureIcon}>{feature.icon}</span>
                <div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDesc}>{feature.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}