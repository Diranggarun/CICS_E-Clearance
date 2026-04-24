function CreateUser() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-[#1767FE]">Create Users</h1>
      <p className="mt-2 text-lg font-medium text-[#717171]">
        Create officer accounts for the clearance system.
      </p>

      <div className="mt-8 rounded-[25px] border border-gray-200 bg-[#F8F8FF] p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-[#1767FE]">
          Basic Information
        </h2>

        <form className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#717171]">
              FIRST NAME
            </label>
            <input className="h-[53px] w-full rounded-xl border border-gray-300 bg-[#F2F3FF] px-4 outline-none focus:border-[#1767FE]" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#717171]">
              LAST NAME
            </label>
            <input className="h-[53px] w-full rounded-xl border border-gray-300 bg-[#F2F3FF] px-4 outline-none focus:border-[#1767FE]" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#717171]">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              className="h-[53px] w-full rounded-xl border border-gray-300 bg-[#F2F3FF] px-4 outline-none focus:border-[#1767FE]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#717171]">
              ROLE
            </label>
            <select className="h-[53px] w-full rounded-xl border border-gray-300 bg-[#F2F3FF] px-4 text-[#717171] outline-none focus:border-[#1767FE]">
              <option>Officer</option>
              <option>Admin</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#717171]">
              TEMPORARY PASSWORD
            </label>
            <input
              type="password"
              className="h-[53px] w-full rounded-xl border border-gray-300 bg-[#F2F3FF] px-4 outline-none focus:border-[#1767FE]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#717171]">
              OFFICE ASSIGNMENT
            </label>
            <select className="h-[53px] w-full rounded-xl border border-gray-300 bg-[#F2F3FF] px-4 text-[#717171] outline-none focus:border-[#1767FE]">
              <option>Library</option>
              <option>Publication</option>
              <option>Student Council</option>
              <option>Department Society</option>
              <option>Academic Adviser</option>
              <option>Chairperson</option>
              <option>Dean</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#717171]">
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              className="h-[53px] w-full rounded-xl border border-gray-300 bg-[#F2F3FF] px-4 outline-none focus:border-[#1767FE]"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="rounded-[15px] border border-gray-300 px-8 py-3 font-semibold text-[#717171]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[15px] bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-8 py-3 font-semibold text-white shadow-sm"
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