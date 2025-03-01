import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StudentPages } from "@/utils/types";

interface SidebarProps {
  collapsed: boolean;
  // toggleSidebar: () => void;
  activePage: StudentPages;
}

export default function Sidebar(sideBarProp: SidebarProps) {
  // Define sidebar links based on user role and Student level
  const links =
    [
        {
        name: StudentPages.TASKS,
        path: "/Student/Tasks",
        svg: (
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            viewBox="0 0 512 512"
            fill="currentColor"
            stroke="currentColor"
            >
            <path
                d="M139.61 35.5a12 12 0 0 0-17 0L58.93 98.81l-22.7-22.12a12 12 0 0 0-17 0L3.53 92.41a12 12 0 0 0 0 17l47.59 47.4a12.78 12.78 0 0 0 17.61 0l15.59-15.62L156.52 69a12.09 12.09 0 0 0 .09-17zm0 159.19a12 12 0 0 0-17 0l-63.68 63.72-22.7-22.1a12 12 0 0 0-17 0L3.53 252a12 12 0 0 0 0 17L51 316.5a12.77 12.77 0 0 0 17.6 0l15.7-15.69 72.2-72.22a12 12 0 0 0 .09-16.9zM64 368c-26.49 0-48.59 21.5-48.59 48S37.53 464 64 464a48 48 0 0 0 0-96zm432 16H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"
            />
            </svg>
        ),
        },
        {
        name: StudentPages.TEAM,
        path: "/Student/Team",
        svg: (
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="currentColor"
            >
            <path d="M12 10C14.2091 10 16 8.20914 16 6 16 3.79086 14.2091 2 12 2 9.79086 2 8 3.79086 8 6 8 8.20914 9.79086 10 12 10ZM5.5 13C6.88071 13 8 11.8807 8 10.5 8 9.11929 6.88071 8 5.5 8 4.11929 8 3 9.11929 3 10.5 3 11.8807 4.11929 13 5.5 13ZM21 10.5C21 11.8807 19.8807 13 18.5 13 17.1193 13 16 11.8807 16 10.5 16 9.11929 17.1193 8 18.5 8 19.8807 8 21 9.11929 21 10.5ZM12 11C14.7614 11 17 13.2386 17 16V22H7V16C7 13.2386 9.23858 11 12 11ZM5 15.9999C5 15.307 5.10067 14.6376 5.28818 14.0056L5.11864 14.0204C3.36503 14.2104 2 15.6958 2 17.4999V21.9999H5V15.9999ZM22 21.9999V17.4999C22 15.6378 20.5459 14.1153 18.7118 14.0056 18.8993 14.6376 19 15.307 19 15.9999V21.9999H22Z" />
            </svg>
        ),
        },
        {
            name: StudentPages.PROJECT,
            path: "/Student/Project",
            svg: (
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                >
                <path
                    fill="none"
                    strokeWidth="2"
                    d="M9,15 L9,23 L1,23 L1,15 L9,15 Z M23,15 L23,23 L15,23 L15,15 L23,15 Z M9,1 L9,9 L1,9 L1,1 L9,1 Z M23,1 L23,9 L15,9 L15,1 L23,1 Z"
                />
                </svg>
            ),
        },
    ];

  return (
    <div
      className={`bg-[#1d1b23] text-white h-full ${
        sideBarProp.collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Sidebar Links */}
      <ul className="space-y-2 pt-4 pr-4 pb-4">
        {links.map((link) => (
          <Link key={link.path} href={link.path}>
            <li
              className={`p-4 pl-4 rounded-br-3xl rounded-tr-3xl ${
                sideBarProp.activePage === link.name ? "bg-[#81c26c]" : ""
              }`}
            >
              <div className="flex items-center space-x-4">
                <span>{link.svg}</span>
                <span
                  className={`${sideBarProp.collapsed ? "hidden" : ""}`}
                >
                  {link.name}
                </span>
              </div>
            </li>
          </Link>
        ))}
      </ul>

      {/* Sidebar Toggle Button */}
      {/* <Button
        size="icon"
        onClick={sideBarProp.toggleSidebar}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
      >
        {sideBarProp.collapsed ? <ChevronRight /> : <ChevronLeft />}
      </Button> */}
    </div>
  );
}
