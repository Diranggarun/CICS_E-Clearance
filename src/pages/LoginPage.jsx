/**
 * pages/LoginPage.jsx
 * ──────────────────────────────────────────────────────────────────────────────
 * Matches the LoginPage design from LoginPage_Asset.txt
 * Left side: logo + login form card
 * Right side: blue gradient panel with feature highlights
 * ──────────────────────────────────────────────────────────────────────────────
 */
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login } from '../api/auth'
import styles from './LoginPage.module.css'

// Feature items shown on the right panel
const FEATURES = [
  {
    icon: '🔔',
    title: 'Real-time notifications',
    desc: 'Get instantly updated when a signatory approves or flags your clearance.',
  },
  {
    icon: '⚡',
    title: 'Parallel approvals — faster process',
    desc: 'Multiple offices review simultaneously so you never wait in line.',
  },
  {
    icon: '📄',
    title: 'One-click PDF generation',
    desc: 'Download your official clearance document the moment it is fully approved.',
  },
]

export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields.')
      return
    }

    setLoading(true)
    try {
      // TODO (backend team): this calls POST /api/auth/login
      const res = await login(email, password)
      localStorage.setItem('access_token', res.data.access_token)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* ── LEFT PANEL ────────────────────────────────────────────────────── */}
      <div className={styles.leftPanel}>
        {/* Logo + Brand */}
        <div className={styles.brand}>
          <div className={styles.logoCircle}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="20" r="12" fill="#1767FE" />
              <path d="M10 50 Q30 34 50 50" stroke="#1767FE" strokeWidth="4" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <span className={styles.brandName}>CICS E-Clearance</span>
        </div>

        {/* Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.cardTitle}>Sign in</h1>
            <p className={styles.cardSubtitle}>Sign in to your CICS clearance portal.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>EMAIL</label>
              <input
                type="email"
                className={styles.input}
                placeholder="your@cics.edu.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>PASSWORD</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPass ? 'text' : 'password'}
                  className={styles.input}
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPass((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className={styles.forgotRow}>
              <Link to="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button type="submit" className={styles.loginBtn} disabled={loading}>
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          {/* Register link */}
          <p className={styles.registerText}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.registerLink}>
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ───────────────────────────────────────────────────── */}
      <div className={styles.rightPanel}>
        <div className={styles.rightContent}>
          <div className={styles.heroText}>
            <h2 className={styles.heroTitle}>CICS Digital{'\n'}Clearance Portal</h2>
            <p className={styles.heroSubtitle}>
              Complete your clearance digitally. No more running between offices —
              track every step from your device.
            </p>
          </div>

          <div className={styles.features}>
            {FEATURES.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <div>
                  <p className={styles.featureTitle}>{f.title}</p>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
