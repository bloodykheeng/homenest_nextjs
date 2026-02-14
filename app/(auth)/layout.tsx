import ThemeToggler from "@/components/common/ThemeToggler";
import React from "react";
import AuthLottieAnimation from "./AuthLottieAnimation";

export default function HomeNestAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-1 bg-white p-6 dark:bg-gray-900 sm:p-0">
      <div className="relative flex h-screen w-full flex-col justify-center dark:bg-gray-900 sm:p-0 lg:flex-row">
        {/* Left Side - HomeNest Branding & Animation Section */}
        <div className="lg:w-1/2 w-full h-full bg-blue-900 dark:bg-white/5 lg:grid items-center hidden">
          <div className="relative z-1 flex items-center justify-center">
            {/* Centered Content */}
            <div className="flex max-w-lg flex-col items-center space-y-6 px-8">
              <AuthLottieAnimation />
            </div>
          </div>
        </div>

        {/* Right Side - Form Section (Children) */}
        <div className="flex h-full w-full items-center justify-center lg:w-1/2">
          {children}
        </div>

        {/* Theme Toggler - Fixed Bottom Right */}
        <ThemeToggler />
      </div>
    </div>
  );
}