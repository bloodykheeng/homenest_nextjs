"use client";

import { useSidebar } from "@/providers/SidebarContextProvider";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";

import { Suspense } from "react";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <Suspense>
      <div className="min-h-screen xl:flex bg-white dark:bg-gray-900">
        {/* Sidebar and Backdrop */}
        <AppSidebar />
        <Backdrop />
        {/* Main Content Area */}
        <div
          className={`overflow-auto flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
        >
          {/* Header */}
          <AppHeader />
          {/* Page Content */}
          {/* <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div> */}

          {/* <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6"> */}
          <div className={`p-4 mx-auto max-w-full md:p-6`}>
            <div>{children}</div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
