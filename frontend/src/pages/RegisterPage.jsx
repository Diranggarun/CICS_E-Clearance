import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../api/auth";

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
    "h-11 w-full rounded-[12px] border border-[#dbe7ff] bg-white/75 px-3.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0D27F7] focus:ring-4 focus:ring-[#0D27F7]/15";

  const labelClass =
    "text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500";

  const fieldClass = "space-y-1.5";

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-white via-[#f8fbff] to-[#eef4ff] px-4 py-5 font-inter">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] max-w-5xl flex-col justify-center">
        <Link
          to="/login"
          className="mb-4 inline-flex w-fit items-center gap-1 text-sm font-medium text-[#0D27F7] transition hover:opacity-75"
        >
          &lt; Back to Login
        </Link>

        <section className="rounded-[28px] border border-[#dbe7ff]/80 bg-white/75 p-6 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl md:p-7">
          <div className="mb-6 flex flex-col gap-3 border-b border-[#e2ebff] pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0D27F7]/60">
                Student Registration
              </p>
              <h1 className="mt-2 bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-2xl font-semibold tracking-tight text-transparent md:text-3xl">
                Create your account
              </h1>
              <p className="mt-1 text-sm font-medium text-gray-500">
                Fill out the required details to request portal access.
              </p>
            </div>

            <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0D27F7] to-[#1767FE] text-sm font-bold tracking-wider text-white shadow-[0_10px_24px_rgba(13,39,247,0.22)] md:flex">
              EC
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-4 md:grid-cols-2">
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
                  <option value="" disabled>
                    Select course
                  </option>
                  {COURSES.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className={fieldClass}>
                <label className={labelClass}>Last Name</label>
                <input
                  className={inputClass}
                  placeholder="Dela Cruz"
                  value={form.lastName}
                  onChange={set("lastName")}
                />
              </div>

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
                <label className={labelClass}>Middle Name</label>
                <input
                  className={inputClass}
                  placeholder="Optional"
                  value={form.middleName}
                  onChange={set("middleName")}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className={fieldClass}>
                <label className={labelClass}>Gender</label>
                <select
                  className={`${inputClass} cursor-pointer`}
                  value={form.gender}
                  onChange={set("gender")}
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  {GENDERS.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>

              <div className={fieldClass}>
                <label className={labelClass}>Date of Birth</label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.dateOfBirth}
                  onChange={set("dateOfBirth")}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className={fieldClass}>
                <label className={labelClass}>Institutional Email</label>
                <input
                  type="email"
                  className={inputClass}
                  placeholder="your@cics.edu.ph"
                  value={form.institutionalEmail}
                  onChange={set("institutionalEmail")}
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

            <div className="grid gap-4 md:grid-cols-2">
              <div className={fieldClass}>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    className={`${inputClass} pr-11`}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={set("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm transition hover:scale-105"
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className={fieldClass}>
                <label className={labelClass}>Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    className={`${inputClass} pr-11`}
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={set("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm transition hover:scale-105"
                  >
                    {showConfirmPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#e2ebff] pt-5 lg:flex-row lg:items-center lg:justify-between">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#0D27F7]"
                />
                <span className="text-xs leading-5 text-gray-500 md:text-sm">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="font-medium text-[#0D27F7] underline"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="font-medium text-[#0D27F7] underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="h-11 rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-7 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(13,39,247,0.2)] transition hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 lg:min-w-[170px]"
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