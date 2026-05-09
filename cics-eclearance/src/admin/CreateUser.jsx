function CreateUser() {
  const inputClass =
    "h-[53px] w-full rounded-[12px] border border-[#e2ebff] bg-white/60 px-4 text-sm text-gray-600 outline-none backdrop-blur transition hover:border-[#c3d4ff] focus:border-[#0D27F7] focus:ring-2 focus:ring-[#0D27F7]/15";

  const labelClass = "mb-2 block text-sm font-medium text-gray-500";

  const appleCard =
    "rounded-[28px] border border-[#d6e2ff] bg-white/70 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl";

  return (
    <div className="space-y-8 font-inter">
      <div>
        <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
          Create Users
        </h1>
        <p className="mt-2 text-base font-medium text-gray-500 md:text-lg">
          Create officer accounts for the clearance system.
        </p>
      </div>

      <div className={`${appleCard} p-6 md:p-8`}>
        <h2 className="text-xl font-semibold text-[#0D27F7]">
          Basic Information
        </h2>

        <form className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <label className={labelClass}>FIRST NAME</label>
            <input className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>LAST NAME</label>
            <input className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>EMAIL ADDRESS</label>
            <input type="email" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>ROLE</label>
            <select className={inputClass}>
              <option>Officer</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>TEMPORARY PASSWORD</label>
            <input type="password" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>OFFICE ASSIGNMENT</label>
            <select className={inputClass}>
              <option>Library</option>
              <option>Publication</option>
              <option>Student Council</option>
              <option>Department Society</option>
              <option>Academic Adviser</option>
              <option>Chairperson</option>
              <option>Dean</option>
              <option>Enrolling Officer</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>CONFIRM PASSWORD</label>
            <input type="password" className={inputClass} />
          </div>

          <div className="flex justify-end gap-3 pt-4 md:col-span-2">
            <button
              type="button"
              className="rounded-full border border-[#e2ebff] bg-white/60 px-8 py-3 text-sm font-semibold text-gray-600 backdrop-blur transition hover:bg-blue-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-8 py-3 text-sm font-semibold text-white shadow-[0_2px_10px_rgba(13,39,247,0.2)] transition hover:opacity-95 hover:shadow-[0_6px_20px_rgba(13,39,247,0.25)] active:scale-[0.98]"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;