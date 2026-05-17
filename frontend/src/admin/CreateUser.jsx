import { useState } from "react";
import toast from "react-hot-toast";
import { FiUserPlus, FiLoader } from "react-icons/fi";
import { createStaffUser } from "../api/staff";

const ROLES = [
  { value: "bytes_officer", label: "BYTES Officer" },
  { value: "librarian", label: "Librarian" },
  { value: "faculty_adviser", label: "Faculty Adviser" },
  { value: "chairperson", label: "Chairperson" },
  { value: "dean", label: "Dean" },
];

const EMPTY = {
  firstName: "",
  lastName: "",
  email: "",
  role: "librarian",
  schoolId: "",
  password: "",
  confirm: "",
};

function CreateUser() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.role) {
      return toast.error("Fill all required fields.");
    }
    if (form.password.length < 8) {
      return toast.error("Password must be at least 8 characters.");
    }
    if (form.password !== form.confirm) {
      return toast.error("Passwords do not match.");
    }

    setLoading(true);
    try {
      const { data } = await createStaffUser({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        role: form.role,
        password: form.password,
        schoolId: form.schoolId.trim() || undefined,
      });
      toast.success(`Created ${data.user.firstName} ${data.user.lastName} (${data.user.role})`);
      setForm(EMPTY);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create user");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "h-[53px] w-full rounded-[12px] border border-[#e2ebff] bg-white/60 px-4 text-sm text-gray-600 outline-none backdrop-blur transition hover:border-[#c3d4ff] focus:border-[#0D27F7] focus:ring-2 focus:ring-[#0D27F7]/15";

  const labelClass = "mb-2 block text-sm font-medium text-gray-500";

  const appleCard =
    "rounded-[28px] border border-[#d6e2ff] bg-white/70 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl";

  return (
    <div className="space-y-8 font-inter">
      <div className="flex items-center gap-3">
        <FiUserPlus className="text-3xl text-[#0D27F7]" />
        <div>
          <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
            Create Staff User
          </h1>
          <p className="mt-2 text-base font-medium text-gray-500 md:text-lg">
            Create officer / approver accounts directly. Skips the pending-approval flow.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className={`${appleCard} p-6 md:p-8`}>
        <h2 className="text-xl font-semibold text-[#0D27F7]">Basic Information</h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <label className={labelClass}>FIRST NAME *</label>
            <input className={inputClass} value={form.firstName} onChange={set("firstName")} />
          </div>

          <div>
            <label className={labelClass}>LAST NAME *</label>
            <input className={inputClass} value={form.lastName} onChange={set("lastName")} />
          </div>

          <div>
            <label className={labelClass}>EMAIL ADDRESS *</label>
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={set("email")}
              placeholder="staff@cics.edu.ph"
            />
          </div>

          <div>
            <label className={labelClass}>ROLE *</label>
            <select className={inputClass} value={form.role} onChange={set("role")}>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>SCHOOL / STAFF ID (optional)</label>
            <input
              className={inputClass}
              value={form.schoolId}
              onChange={set("schoolId")}
              placeholder="Auto-generated if blank"
            />
          </div>

          <div />

          <div>
            <label className={labelClass}>TEMPORARY PASSWORD *</label>
            <input
              type="password"
              className={inputClass}
              value={form.password}
              onChange={set("password")}
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label className={labelClass}>CONFIRM PASSWORD *</label>
            <input
              type="password"
              className={inputClass}
              value={form.confirm}
              onChange={set("confirm")}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 md:col-span-2">
            <button
              type="button"
              onClick={() => setForm(EMPTY)}
              disabled={loading}
              className="rounded-full border border-[#e2ebff] bg-white/60 px-8 py-3 text-sm font-semibold text-gray-600 backdrop-blur transition hover:bg-blue-50 disabled:opacity-60"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-8 py-3 text-sm font-semibold text-white shadow-[0_2px_10px_rgba(13,39,247,0.2)] transition hover:opacity-95 hover:shadow-[0_6px_20px_rgba(13,39,247,0.25)] active:scale-[0.98] disabled:opacity-60"
            >
              {loading && <FiLoader className="animate-spin" />}
              {loading ? "Creating…" : "Create User"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateUser;
