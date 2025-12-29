import type { Metadata } from "next";
import React from "react";
import Link from "next/link";

import Welcome from "@/components/admin-panel/welcome/Welcome";

export const metadata: Metadata = {
  title: "HomeNest | Your Home, Made Comfortable",
  description:
    "HomeNest is an Ecommerce platform offering quality household essentials, home décor, and everyday comfort items — all in one trusted place.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-1">
          <Welcome />
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Dashboard Home
        </div>

        {/* Bottom Info Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Comfort Starts Here
          </h3>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            HomeNest brings together carefully selected household essentials,
            décor, and everyday home needs in one place. Designed to make your
            home feel warmer, simpler, and more comfortable — from kitchen to
            living room.
          </p>
        </div>
      </div>
    </div>
  );
}
