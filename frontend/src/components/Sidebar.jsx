<<<<<<< HEAD
import { NavLink } from "react-router-dom";
import { FiMenu, FiHome, FiUsers, FiClipboard } from "react-icons/fi";

function Sidebar({ collapsed, setCollapsed }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FiHome /> },
=======
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiHome,
  FiUsers,
  FiClipboard,
  FiUserCheck,
  FiCheckSquare,
  FiCreditCard,
  FiDollarSign,
  FiBarChart2,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

function Sidebar({ collapsed, setCollapsed }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FiHome /> },
    { name: "Clearance Approvals", path: "/admin/clearance-approvals", icon: <FiCheckSquare /> },
    { name: "Pending Accounts", path: "/admin/pending-accounts", icon: <FiUserCheck /> },
    { name: "Payment Verification", path: "/admin/payment-verification", icon: <FiCreditCard /> },
    { name: "Manage Fines", path: "/admin/manage-fines", icon: <FiDollarSign /> },
    { name: "Reports", path: "/admin/reports", icon: <FiBarChart2 /> },
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
    { name: "Create User", path: "/admin/create-user", icon: <FiUsers /> },
    { name: "Records", path: "/admin/records", icon: <FiClipboard /> },
  ];

<<<<<<< HEAD
=======
  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
    : "Admin";
  const initial = (user?.firstName || user?.email || "A").charAt(0).toUpperCase();

>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
  return (
    <aside
      className={`h-screen flex flex-col justify-between text-white
      bg-gradient-to-b from-[#0D27F7] via-[#1767FE] to-[#4F8DFF]
      border-r border-white/30 shadow-[0_8px_30px_rgba(13,39,247,0.18)]
      transition-all duration-300
      ${collapsed ? "w-[90px]" : "w-[260px]"}`}
    >
      <div>
        <div className="flex items-center justify-between px-5 py-6">
          {!collapsed && (
            <h1 className="text-lg font-semibold leading-tight tracking-tight">
              CICS <br /> E-Clearance
            </h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-xl bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20"
          >
            <FiMenu className="text-xl" />
          </button>
        </div>

        {!collapsed && (
          <div className="px-4 pb-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/15 p-4 shadow-sm backdrop-blur">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#0D27F7]">
<<<<<<< HEAD
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <p className="font-semibold text-white">Admin</p>
                <p className="text-xs text-white/75">
                  {user?.email || "admin@cics.edu.ph"}
=======
                {initial}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">{displayName}</p>
                <p className="truncate text-xs text-white/75">
                  {user?.email || ""}
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="mt-4 space-y-2 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/20 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)] backdrop-blur"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

<<<<<<< HEAD
      {!collapsed && (
        <div className="p-4">
          <NavLink
            to="/login"
            className="flex items-center justify-center rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur transition hover:bg-white/20"
          >
            Logout
          </NavLink>
        </div>
      )}
=======
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur transition hover:bg-white/20"
        >
          <FiLogOut />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
    </aside>
  );
}

<<<<<<< HEAD
export default Sidebar;
=======
export default Sidebar;
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
