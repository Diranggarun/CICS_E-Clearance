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
      // 1. Call the login function
      const res = await login(email, password);

      console.log("Full Response:", res); // DEBUG: Check what the server actually sent

      /**
       * 2. Handle Session / JWT 
       * If your auth.js returns the full axios response, use res.data.
       * If your auth.js returns only the data, use res directly.
       */
      const data = res.data || res; 
      const { access_token, user } = data;

      if (!access_token) {
        throw new Error("No token received from server");
      }

      // Store data
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Welcome back!");

      // 3. Role-Based Navigation
      const role = user?.role;
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/office/dashboard");
      }
    } catch (err) {
      console.error("Login attempt failed:", err);
      // This helps you see if it's a network error or a credential error
      const msg = err.response?.data?.message || err.message || "Invalid credentials.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      {/* LEFT PANEL: Branding and Sign-in Form */}
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
                required
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
                  required
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

      {/* RIGHT PANEL: Hero Graphics and Features list */}
      <section className={styles.rightPanel}>
        <div className={styles.rightContent}>
          <div className={styles.heroIcon}>✓</div>

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