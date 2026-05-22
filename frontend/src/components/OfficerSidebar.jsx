<<<<<<< HEAD
import { NavLink } from "react-router-dom";
import {
  FiMenu,
  FiHome,
  FiFileText,
  FiInbox,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

function OfficerSidebar({ collapsed, setCollapsed }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const navItems = [
    { name: "Dashboard", path: "/officer/dashboard", icon: <FiHome /> },
    { name: "Requirement", path: "/officer/requirement", icon: <FiFileText /> },
    { name: "Requests", path: "/officer/requests", icon: <FiInbox /> },
    { name: "Approved", path: "/officer/approved", icon: <FiCheckCircle /> },
    { name: "Denied", path: "/officer/denied", icon: <FiXCircle /> },
  ];

=======
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiHome,
  FiLogOut,
  FiCheckSquare,
  FiCreditCard,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

function OfficerSidebar({ collapsed, setCollapsed }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Approver dashboards all share OfficerLayout. Pick the dashboard path that
  // matches the current role so the sidebar isn't confusing.
  const roleDash = {
    cursor_org: "/cursor/dashboard",
    department_org: "/department/dashboard",
    bytes_officer: "/bytes/dashboard",
    librarian: "/librarian/dashboard",
    faculty_adviser: "/adviser/dashboard",
    chairperson: "/chairperson/dashboard",
    dean: "/dean/dashboard",
    enrolling_faculty: "/enrolling/dashboard",
  };
  // Org-fee officers also verify the payments for their organization.
  const rolePayments = {
    cursor_org: "/cursor/payments",
    department_org: "/department/payments",
    bytes_officer: "/bytes/payments",
  };
  const dashPath = roleDash[user?.role] || "/officer/dashboard";
  const paymentsPath = rolePayments[user?.role];

  const navItems = [
    { name: "Dashboard", path: dashPath, icon: <FiHome /> },
    { name: "Pending Approvals", path: dashPath, icon: <FiCheckSquare /> },
    ...(paymentsPath
      ? [{ name: "Payments", path: paymentsPath, icon: <FiCreditCard /> }]
      : []),
  ];

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
    : "Officer";
  const initial = (user?.firstName || user?.email || "O").charAt(0).toUpperCase();
  const roleLabel = (user?.role || "officer").replace(/_/g, " ");

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

<<<<<<< HEAD
        {/* Top Profile Card */}
        {!collapsed && (
        <div className="px-4 pb-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/15 p-4 shadow-sm backdrop-blur">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#0D27F7]">
                {user?.email?.charAt(0).toUpperCase() || "O"}
            </div>
            <div>
                <p className="font-semibold text-white">Officer</p>
                <p className="text-xs text-white/75">
                {user?.email || "officer@cics.edu.ph"}
                </p>
            </div>
            </div>
        </div>
        )}
        
        {!collapsed && (
          <p className="px-7 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Officer Menu
          </p>
=======
        {!collapsed && (
          <div className="px-4 pb-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/15 p-4 shadow-sm backdrop-blur">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#0D27F7]">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-white capitalize">{roleLabel}</p>
                <p className="truncate text-xs text-white/75">
                  {displayName}
                </p>
              </div>
            </div>
          </div>
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
        )}

        <nav className="mt-4 space-y-2 px-3">
          {navItems.map((item) => (
            <NavLink
<<<<<<< HEAD
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
=======
              key={item.name}
              to={item.path}
              className={() =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
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
export default OfficerSidebar;
=======
export default OfficerSidebar;
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
