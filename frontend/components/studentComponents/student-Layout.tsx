"use client"; //cause Im using useState, i need to import use Client. Making this page React
import { useState } from "react";
import Sidebar from "../SidebarStudent";
import Navbar from "../Navbar";
import { StudentPages } from "@/utils/types";
import BackButton from "@/components/backbutton";
import { usePathname } from "next/navigation";

interface StuLayoutProps {
  children: React.ReactNode;
  firstName: string;
  lastName: string;
  signOutFunc: () => void;
}

export default function StuLayout(layoutProps: StuLayoutProps) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false); // true represents collapsed sidebar. false represents expanded sidebar


  function toggleSidebar() {
    setSidebarCollapsed(!isSidebarCollapsed);
  }
  const pathname = usePathname();
  // console.log("pathname is ...", pathname);
  
  // Map the current route to EmployeePages
  const pathToPageMap = {
    "/Student/Tasks": StudentPages.TASKS,
    "/Student/Team": StudentPages.TEAM,
    "/Student/Project": StudentPages.PROJECT,
    "/Student/Settings": StudentPages.SETTINGS,
    "/Student/Profile": StudentPages.PROFILE,
  };

  const activePage = pathToPageMap[pathname as keyof typeof pathToPageMap];

  return (
    <div className="">
       <Navbar
        initials={
          layoutProps.firstName.charAt(0) + layoutProps.lastName.charAt(0)
        }
        name={layoutProps.firstName + " " + layoutProps.lastName}
        signOutButton={layoutProps.signOutFunc}
        toggleSidebar={toggleSidebar} // Pass the toggleSidebar function
        collapsed={isSidebarCollapsed} // Pass the collapsed state
      />
      <div className="flex flex-1 pb-4">
        <Sidebar
          collapsed={isSidebarCollapsed}
          activePage={activePage}
        />

        {/**Main Content */}
        <main
          className={`bg-[#413F46] flex-1 p-4 transition-all duration-200 ease-in-out main-content rounded-3xl  ml-4 mr-4 ${isSidebarCollapsed ? "ml-0" : "ml-200px"}`}
        >
      <div className="flex items-center gap-4 m">
        {pathname !== "/Student/Tasks" && pathname !== "/Student/Team" && pathname !== "/Student/Project" && (
          <BackButton>← Back</BackButton>
        )}
        {/* Subheading */}
        
      </div>
          {layoutProps.children}
        </main>
      </div>
    </div>
  );
}
