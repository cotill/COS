import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Button } from "./ui/button";
import React, { useState } from "react";
import UserMenu from "./user-menu";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavbarProperties {
  initials: string;
  signOutButton: () => void;
  name: string;
  toggleSidebar: () => void;
  collapsed: boolean;
}

export default function Navbar({
  initials,
  signOutButton,
  name,
  toggleSidebar,
  collapsed,
}: NavbarProperties) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <nav className="w-full flex justify-center border-b-foreground/10 h-16">
      <div className="w-full max-w-8xl flex justify-between items-center pr-6 pl-3 text-sm text-white">
        <div className="flex items-center gap-6">
          {/* Sidebar Toggle Button */}
          <Button size={"icon"} onClick={toggleSidebar}>
            {collapsed ? <ChevronLeft /> : <ChevronRight />}
          </Button>
          <img
            src="/ttg-logo.png"
            alt="Tartigrade Limited"
            className="w-[17.5%]"
          />
          <span className="text-white text-xl tracking-[0.2em]">
            Capstone Onboarding System
          </span>
        </div>

        <div className="relative flex items-center gap-6 -ml-20">
          <span className="text-white">{currentDate}</span>

          <button
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
            style={{ backgroundColor: "#81c26c", color: "white" }}
            onClick={() => setMenuOpen(!isMenuOpen)}
          >
            {initials}
          </button>

          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black opacity-50 z-40"
                onClick={() => setMenuOpen(false)} // Close modal when clicking backdrop
              />
              <div className="fixed top-0 right-0 z-50">
                <UserMenu
                  initials={initials}
                  onClose={() => setMenuOpen(false)}
                  signOutButton={signOutButton}
                  name={name}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
