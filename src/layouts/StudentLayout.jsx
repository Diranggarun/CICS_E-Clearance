import { Outlet } from "react-router-dom";
import { useState } from "react";
import StudentSidebar from "../components/StudentSidebar";

function StudentLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-[#f8fbff] to-[#eef4ff] font-inter">
      <StudentSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="flex-1 p-4 lg:p-6">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default StudentLayout;