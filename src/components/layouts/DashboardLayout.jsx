import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../layouts/Sidebar";
import { Navbar } from "../layouts/Navbar";
import { cn } from "../../lib/utils";

export const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className={cn("flex-1 flex flex-col min-h-screen transition-all duration-300", collapsed ? "ml-[70px]" : "ml-[240px]")}>
        <Navbar sidebarCollapsed={collapsed} onMenuToggle={() => setCollapsed((c) => !c)} />
        <main className="flex-1 pt-16 p-6 overflow-auto">
          <Outlet /> {/* ✅ nested pages render here */}
        </main>
      </div>
    </div>
  );
};