// components/Header/ThemeToggler.tsx
"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { FiMoon, FiSun } from "react-icons/fi";

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      aria-label="theme toggler"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center text-black rounded-full cursor-pointer bg-gray-200 dark:bg-gray-700 h-9 w-9 dark:text-white md:h-14 md:w-14 hover:bg-gray-300 dark:hover:bg-dark-bg transition-colors"
    >
      <FiMoon className="w-5 h-5 md:w-6 md:h-6 dark:hidden" />
      <FiSun className="hidden w-5 h-5 md:w-6 md:h-6 dark:block" />
    </button>
  );
};

export default ThemeToggler;