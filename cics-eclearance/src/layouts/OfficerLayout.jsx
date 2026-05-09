import { useState } from "react";
import { Outlet } from "react-router-dom";
import OfficerSidebar from "../components/OfficerSidebar";

function OfficerLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-[#f8fbff] to-[#eef4ff] font-inter">
      <OfficerSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default OfficerLayout;