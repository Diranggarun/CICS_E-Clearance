import { NavLink } from "react-router-dom";
import { FiMenu, FiHome, FiUsers, FiClipboard } from "react-icons/fi";

function Sidebar({ collapsed, setCollapsed }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FiHome /> },
    { name: "Create User", path: "/admin/create-user", icon: <FiUsers /> },
    { name: "Records", path: "/admin/records", icon: <FiClipboard /> },
  ];

  return (
    <aside
      className={`h-screen bg-gradient-to-b from-[#0D27F7] to-[#1767FE] text-white flex flex-col justify-between transition-all duration-300
      ${collapsed ? "w-[90px]" : "w-[260px]"}`}
    >
      {/* TOP */}
      <div>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-6">
          {!collapsed && (
            <h1 className="text-xl font-bold leading-tight">
              CICS <br /> E-Clearance
            </h1>
          )}

          <FiMenu
            className="cursor-pointer text-2xl"
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>

        {/* Nav */}
        <nav className="mt-10 space-y-4 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition
                ${
                  isActive
                    ? "bg-white/10 border border-white"
                    : "hover:bg-white/10"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && <span className="text-lg">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* PROFILE */}
      {!collapsed && (
        <div className="p-4">
          <div className="rounded-2xl bg-white text-[#1767FE] p-4 flex items-center gap-3 shadow">
            <div className="h-10 w-10 rounded-full bg-[#1767FE] text-white flex items-center justify-center font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">Admin</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;