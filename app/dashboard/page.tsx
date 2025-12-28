import type { Metadata } from "next";
import React from "react";
import { FiFileText, FiClipboard, FiUsers, FiCheckCircle, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

import Welcome from '@/components/admin-panel/welcome/Welcome'

export const metadata: Metadata = {
  title: "WAJIBU Contract Monitoring System | Transparency & Accountability Dashboard",
  description:
    "Administrative dashboard for the WAJIBU Contract Monitoring System, providing real-time insights into public contracts, procurement processes, vendor performance, and compliance monitoring to support transparency and accountability.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-1">
          <Welcome />
        </div>

        <div>
          DB Home
        </div>

        {/* Bottom Info Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Fostering Transparency and Accountability
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            By monitoring contracts, procurement processes, vendor performance, and compliance metrics together,
            WAJIBU empowers citizens, CSOs, and oversight institutions to hold duty bearers accountable and ensure
            that public resources are effectively managed for the benefit of all Tanzanians.
          </p>
        </div>
      </div>
    </div>
  );
}