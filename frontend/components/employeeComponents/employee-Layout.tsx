"use client"; //cause Im using useState, i need to import use Client. Making this page React
import { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { EmployeePages, UserRole } from "@/utils/types";

interface EmpLayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  activePage: EmployeePages;
  employeeLevel?: number;
  firstName: string;
  lastName: string;
  signOutFunc: () => void;
}

export default function EmpLayout(layoutProps: EmpLayoutProps) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false); // true represents collapsed sidebar. false represents expanded sidebar

  function toggleSidebar() {
    setSidebarCollapsed(!isSidebarCollapsed);
  }

  return (
    <div className="">
      <Navbar
        initials={
          layoutProps.firstName.charAt(0) + "" + layoutProps.lastName.charAt(0)
        }
        signOutButton={layoutProps.signOutFunc}
      />
      <div className="flex">
        <Sidebar
          userRole={layoutProps.userRole}
          collapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
          activePage={layoutProps.activePage}
          employeeLevel={layoutProps.employeeLevel}
        />

        {/**Main Content */}
        <main
          className={`bg-[#413F46] flex-1 pl-4 transition-all duration-200 ease-in-out main-content rounded-3xl  ${isSidebarCollapsed ? "ml-0" : "ml-200px"}`}
        >
          {/* Subheading */}
          <div className="flex items-center justify-between border-zinc-400 py-5">
            <h2 className="text-xl font-semibold">
              {layoutProps.activePage} Page
            </h2>
          </div>
          {layoutProps.children}
        </main>
      </div>
    </div>
  );
}
