"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ThemeToggler() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="group relative inline-flex size-14 items-center justify-center rounded-full bg-brand-500 shadow-lg transition-all duration-300 hover:bg-brand-600 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-brand-500/50"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >

        {/* Moon Icon (VISIBLE IN LIGHT MODE) */}
        <Moon
          className="absolute h-5 w-5 text-black rotate-0 scale-100 transition-all duration-300 dark:scale-0 dark:-rotate-90"
          aria-hidden="true"
        />

        {/* Sun Icon (VISIBLE IN DARK MODE) */}
        <Sun
          className="absolute h-5 w-5 text-white rotate-90 scale-0 transition-all duration-300 dark:scale-100 dark:rotate-0"
          aria-hidden="true"
        />

        {/* Tooltip */}
        <span className="absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 dark:bg-white dark:text-gray-900">
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </span>
      </button>



      {/* Home Nest Logo */}
      {/* <Link
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative"
      >
        <div className="relative overflow-hidden rounded-lg bg-white p-2 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
          <Image
            src="/logos/homenest_dark.png"
            alt="Homenest UHRC Logo"
            width={120}
            height={60}
            className="h-auto w-[100px] object-contain transition-transform duration-300 group-hover:scale-105 sm:w-[120px]"
            priority
          />
          Tooltip
          <span className="absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 dark:bg-white dark:text-gray-900">
            Home Nest
          </span>
        </div>
      </Link> */}
    </div>
  );
}