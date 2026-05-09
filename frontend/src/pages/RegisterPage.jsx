/**
 * pages/RegisterPage.jsx
 * ──────────────────────────────────────────────────────────────────────────────
 * Matches the RegisterPage design from RegisterPage.txt
 * Centered card layout with a conic gradient background.
 * ──────────────────────────────────────────────────────────────────────────────
 */
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { register } from '../api/auth'
import styles from './RegisterPage.module.css'

const COURSES = [
  'BS-Information Technology',
  'BS-Computer Science',
  'BS-Information Systems',
  'BS-Entertainment and Multimedia Computing',
]

const GENDERS = ['Male', 'Female', 'Prefer not to say']

export default function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    idNumber: '',
    course: '',
    lastName: '',
    firstName: '',
    middleName: '',
    gender: '',
    dateOfBirth: '',
    contactNumber: '',
    institutionalEmail: '',
    password: '',
    confirmPassword: '',
  })
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const required = ['idNumber', 'course', 'lastName', 'firstName', 'gender',
      'dateOfBirth', 'contactNumber', 'institutionalEmail', 'password', 'confirmPassword']
    if (required.some((k) => form[k].trim() === '')) {
      toast.error('Please fill in all required fields.')
      return false
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.')
      return false
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return false
    }
    if (!agreed) {
      toast.error('Please agree to the Terms & Conditions.')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      // TODO (backend team): this calls POST /api/auth/register
      await register({
        id_number: form.idNumber,
        course: form.course,
        last_name: form.lastName,
        first_name: form.firstName,
        middle_name: form.middleName,
        gender: form.gender,
        date_of_birth: form.dateOfBirth,
        contact_number: form.contactNumber,
        email: form.institutionalEmail,
        password: form.password,
      })
      toast.success('Account created! Awaiting BYTES Officer approval before you can log in.', { duration: 5000 })
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        const first = Object.values(data.errors)[0]
        toast.error(Array.isArray(first) ? first[0] : String(first))
      } else {
        toast.error(data?.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Back to login */}
      <Link to="/login" className={styles.backLink}>
        &lt;&nbsp; Back to Login
      </Link>

      {/* Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h1 className={styles.cardTitle}>Register</h1>
          <p className={styles.cardSubtitle}>Create your account</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Row 1: ID Number + Course */}
          <div className={styles.row2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>ID NUMBER</label>
              <input
                className={styles.input}
                placeholder="2024-00000"
                value={form.idNumber}
                onChange={set('idNumber')}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>COURSE</label>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.input}
                  value={form.course}
                  onChange={set('course')}
                >
                  <option value="" disabled>Select your course</option>
                  {COURSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <span className={styles.selectArrow}>›</span>
              </div>
            </div>
          </div>

          {/* Row 2: Last / First / Middle Name */}
          <div className={styles.row3}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>LAST NAME</label>
              <input
                className={styles.input}
                placeholder="Dela Cruz"
                value={form.lastName}
                onChange={set('lastName')}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>FIRST NAME</label>
              <input
                className={styles.input}
                placeholder="Juan"
                value={form.firstName}
                onChange={set('firstName')}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>MIDDLE NAME (OPTIONAL)</label>
              <input
                className={styles.input}
                placeholder="Santos"
                value={form.middleName}
                onChange={set('middleName')}
              />
            </div>
          </div>

          {/* Row 3: Gender + Date of Birth */}
          <div className={styles.row2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>GENDER</label>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.input}
                  value={form.gender}
                  onChange={set('gender')}
                >
                  <option value="" disabled>Select gender</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <span className={styles.selectArrow}>›</span>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>DATE OF BIRTH</label>
              <input
                type="date"
                className={styles.input}
                placeholder="mm/dd/yyyy"
                value={form.dateOfBirth}
                onChange={set('dateOfBirth')}
              />
            </div>
          </div>

          {/* Row 4: Institutional Email + Contact Number */}
          <div className={styles.row2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>INSTITUTIONAL EMAIL</label>
              <input
                type="email"
                className={styles.input}
                placeholder="your@cics.edu.ph"
                value={form.institutionalEmail}
                onChange={set('institutionalEmail')}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>CONTACT NUMBER</label>
              <input
                type="tel"
                className={styles.input}
                placeholder="09XX-XXX-XXX"
                value={form.contactNumber}
                onChange={set('contactNumber')}
              />
            </div>
          </div>

          {/* Row 5: Password + Confirm Password */}
          <div className={styles.row2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>PASSWORD</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPass ? 'text' : 'password'}
                  className={styles.input}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={set('password')}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(v => !v)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>CONFIRM PASSWORD</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  className={styles.input}
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirmPass(v => !v)}>
                  {showConfirmPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          </div>

          {/* Terms + Submit */}
          <div className={styles.footer}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span className={styles.checkboxText}>
                I agree to the{' '}
                <Link to="/terms" className={styles.termsLink}>Terms &amp; Conditions</Link>
                {' '}and{' '}
                <Link to="/privacy" className={styles.termsLink}>Privacy Policy</Link>.
              </span>
            </label>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating…' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
