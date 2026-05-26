import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../api/auth";
import {
  FiArrowLeft,
  FiUserPlus,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const COURSES = [
  "BS-Information Technology",
  "BS-Computer Science",
  "BS-Information Systems",
  "BS-Entertainment and Multimedia Computing",
];

const GENDERS = ["Male", "Female", "Prefer not to say"];

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    idNumber: "",
    course: "",
    lastName: "",
    firstName: "",
    middleName: "",
    gender: "",
    dateOfBirth: "",
    contactNumber: "",
    institutionalEmail: "",
    password: "",
    confirmPassword: "",
  });

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const required = [
      "idNumber",
      "course",
      "lastName",
      "firstName",
      "gender",
      "dateOfBirth",
      "contactNumber",
      "institutionalEmail",
      "password",
      "confirmPassword",
    ];

    const err = (msg) => {
      toast.error(msg, { id: "register-error" });
      return false;
    };

    if (required.some((key) => form[key].trim() === "")) {
      return err("Please fill in all required fields.");
    }

    if (!/^\d{4}-?\d{4,8}$/.test(form.idNumber.trim())) {
      return err("School ID must look like 2024-00000 or 202300000.");
    }

    if (form.password !== form.confirmPassword) {
      return err("Passwords do not match.");
    }

    if (form.password.length < 8) {
      return err("Password must be at least 8 characters.");
    }

    if (!agreed) {
      return err("Please agree to the Terms & Conditions.");
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
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
      });

      toast.success(
        "Account created! Awaiting BYTES Officer approval before you can log in.",
        { duration: 5000 }
      );

      navigate("/login");
    } catch (err) {
      const data = err.response?.data;

      if (data?.errors) {
        const first = Object.values(data.errors)[0];
        toast.error(Array.isArray(first) ? first[0] : String(first), {
          id: "register-error",
        });
      } else {
        toast.error(data?.message || "Registration failed. Please try again.", {
          id: "register-error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "h-11 w-full rounded-[14px] border border-[#dbe7ff] bg-white/60 px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 hover:bg-white focus:border-[#0D27F7] focus:bg-white focus:ring-4 focus:ring-[#0D27F7]/15";

  const labelClass =
    "text-[11px] font-semibold uppercase tracking-wide text-[#0D27F7]/70";

  const fieldClass = "flex flex-col gap-1.5";

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
        to="/login"
        className="absolute left-4 top-4 z-50 flex items-center gap-1.5 rounded-full border border-[#dbe7ff] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#0D27F7] shadow-sm backdrop-blur-md transition hover:bg-white hover:shadow-md md:left-6 md:top-6"
      >
        <FiArrowLeft className="text-sm" /> Back to Login
      </Link>

      <div className="relative z-10 mx-auto flex w-full items-center justify-center py-8">
        
        <section className="flex w-full max-w-[640px] flex-col justify-center rounded-[36px] border border-[#dbe7ff] bg-white/85 px-6 py-10 shadow-[0_20px_50px_rgba(13,39,247,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-white/80 backdrop-blur-xl sm:px-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0D27F7] to-[#1767FE] text-white shadow-[0_8px_16px_rgba(13,39,247,0.2)]">
              <FiUserPlus className="text-xl" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0D27F7] sm:text-3xl">Create your account</h2>
            <p className="mt-2 text-sm font-medium text-gray-500">Fill out the required details to request portal access.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className={fieldClass}>
                <label className={labelClass}>ID Number</label>
                <input
                  className={inputClass}
                  placeholder="2024-00000 or 202300000"
                  value={form.idNumber}
                  onChange={set("idNumber")}
                />
              </div>
              <div className={fieldClass}>
                <label className={labelClass}>Course</label>
                <select
                  className={`${inputClass} cursor-pointer`}
                  value={form.course}
                  onChange={set("course")}
                >
                  <option value="" disabled>Select course</option>
                  {COURSES.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className={fieldClass}>
                <label className={labelClass}>First Name</label>
                <input
                  className={inputClass}
                  placeholder="Juan"
                  value={form.firstName}
                  onChange={set("firstName")}
                />
              </div>
              <div className={fieldClass}>
                <label className={labelClass}>Last Name</label>
                <input
                  className={inputClass}
                  placeholder="Dela Cruz"
                  value={form.lastName}
                  onChange={set("lastName")}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className={fieldClass}>
                <label className={labelClass}>Middle Name</label>
                <input
                  className={inputClass}
                  placeholder="Optional"
                  value={form.middleName}
                  onChange={set("middleName")}
                />
              </div>
              <div className={fieldClass}>
                <label className={labelClass}>Gender</label>
                <select
                  className={`${inputClass} cursor-pointer`}
                  value={form.gender}
                  onChange={set("gender")}
                >
                  <option value="" disabled>Select gender</option>
                  {GENDERS.map((gender) => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className={fieldClass}>
                <label className={labelClass}>Date of Birth</label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.dateOfBirth}
                  onChange={set("dateOfBirth")}
                />
              </div>
              <div className={fieldClass}>
                <label className={labelClass}>Contact Number</label>
                <input
                  type="tel"
                  className={inputClass}
                  placeholder="09XX-XXX-XXXX"
                  value={form.contactNumber}
                  onChange={set("contactNumber")}
                />
              </div>
            </div>

            <div className={fieldClass}>
              <label className={labelClass}>Institutional Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0D27F7]/50" />
                <input
                  type="email"
                  className={`${inputClass} pl-11`}
                  placeholder="your@cics.edu.ph"
                  value={form.institutionalEmail}
                  onChange={set("institutionalEmail")}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className={fieldClass}>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0D27F7]/50" />
                  <input
                    type={showPass ? "text" : "password"}
                    className={`${inputClass} pl-11 pr-11`}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={set("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#0D27F7]"
                  >
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className={fieldClass}>
                <label className={labelClass}>Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0D27F7]/50" />
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    className={`${inputClass} pl-11 pr-11`}
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={set("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#0D27F7]"
                  >
                    {showConfirmPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[#e2ebff] pt-6 flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 accent-[#0D27F7] focus:ring-[#0D27F7]"
                />
                <span className="text-[13px] leading-5 text-gray-500">
                  I agree to the{" "}
                  <Link to="/terms" className="font-semibold text-[#0D27F7] transition hover:underline">
                    Terms
                  </Link>{" "}
                  &{" "}
                  <Link to="/privacy" className="font-semibold text-[#0D27F7] transition hover:underline">
                    Privacy
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full shrink-0 rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-8 text-sm font-bold text-white shadow-[0_8px_16px_rgba(13,39,247,0.15)] transition hover:opacity-95 hover:shadow-[0_12px_20px_rgba(13,39,247,0.2)] active:scale-[0.98] disabled:opacity-60 sm:w-auto"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        </section>

      </div>
    </main>
  );
}