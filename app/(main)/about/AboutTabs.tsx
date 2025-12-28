'use client'

import React, { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";

import AboutUsPage from './AboutUsPage'

const AboutTabs: React.FC = () => {
    return (
        <div className="relative flex justify-center items-center flex-col pb-8 pt-30 min-h-full md:pl-1 md:pr-1 overflow-hidden">
            <div className="w-full md:w-[80%] lg:w-[70%] relative z-10">
                <TabView>
                    {/* About Us Tab */}
                    <TabPanel header="About Us" className="dark:bg-dark">
                        <AboutUsPage />
                    </TabPanel>
                </TabView>
            </div>

            {/* Top Left SVG - Scales and Balance Symbol */}
            <div className="absolute left-0 top-20 z-1 opacity-10 lg:opacity-20">
                <svg
                    width="200"
                    height="200"
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Balance beam */}
                    <line
                        x1="60"
                        y1="100"
                        x2="140"
                        y2="100"
                        stroke="url(#paint1_linear_about)"
                        strokeWidth="3"
                    />
                    <circle cx="100" cy="100" r="8" fill="url(#paint2_radial_about)" />

                    {/* Left scale pan */}
                    <path
                        d="M 60 100 L 50 120 L 70 120 Z"
                        fill="url(#paint3_linear_about)"
                        opacity="0.6"
                    />

                    {/* Right scale pan */}
                    <path
                        d="M 140 100 L 130 120 L 150 120 Z"
                        fill="url(#paint4_linear_about)"
                        opacity="0.6"
                    />

                    {/* Decorative circles */}
                    <circle cx="100" cy="60" r="15" stroke="url(#paint5_linear_about)" strokeWidth="2" fill="none" opacity="0.4" />

                    <defs>
                        <linearGradient id="paint1_linear_about" x1="60" y1="100" x2="140" y2="100">
                            <stop stopColor="#2563eb" />
                            <stop offset="1" stopColor="#60a5fa" />
                        </linearGradient>
                        <radialGradient id="paint2_radial_about" cx="0" cy="0" r="1" gradientTransform="translate(100 100) scale(8)">
                            <stop stopColor="#3b82f6" />
                            <stop offset="1" stopColor="#2563eb" />
                        </radialGradient>
                        <linearGradient id="paint3_linear_about" x1="60" y1="100" x2="60" y2="120">
                            <stop stopColor="#60a5fa" />
                            <stop offset="1" stopColor="#3b82f6" stopOpacity="0.5" />
                        </linearGradient>
                        <linearGradient id="paint4_linear_about" x1="140" y1="100" x2="140" y2="120">
                            <stop stopColor="#60a5fa" />
                            <stop offset="1" stopColor="#3b82f6" stopOpacity="0.5" />
                        </linearGradient>
                        <linearGradient id="paint5_linear_about" x1="100" y1="45" x2="100" y2="75">
                            <stop stopColor="#3b82f6" />
                            <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Top Right SVG - Shield with Checkmark */}
            <div className="absolute right-0 top-40 z-1 opacity-10 lg:opacity-20">
                <svg
                    width="180"
                    height="220"
                    viewBox="0 0 180 220"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Shield outline */}
                    <path
                        d="M 90 20 L 140 40 L 140 100 Q 140 160 90 180 Q 40 160 40 100 L 40 40 Z"
                        stroke="url(#paint6_linear_about)"
                        strokeWidth="2"
                        fill="url(#paint7_radial_about)"
                        opacity="0.5"
                    />

                    {/* Checkmark inside shield */}
                    <path
                        d="M 70 95 L 85 110 L 110 75"
                        stroke="#60a5fa"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        opacity="0.7"
                    />

                    {/* Accent circles */}
                    <circle cx="90" cy="200" r="12" fill="url(#paint8_radial_about)" opacity="0.4" />

                    <defs>
                        <linearGradient id="paint6_linear_about" x1="90" y1="20" x2="90" y2="180">
                            <stop stopColor="#3b82f6" />
                            <stop offset="1" stopColor="#2563eb" stopOpacity="0.3" />
                        </linearGradient>
                        <radialGradient id="paint7_radial_about" cx="0" cy="0" r="1" gradientTransform="translate(90 100) scale(70)">
                            <stop offset="0.5" stopColor="#60a5fa" stopOpacity="0" />
                            <stop offset="1" stopColor="#3b82f6" stopOpacity="0.2" />
                        </radialGradient>
                        <radialGradient id="paint8_radial_about" cx="0" cy="0" r="1" gradientTransform="translate(90 200) scale(12)">
                            <stop stopColor="#60a5fa" />
                            <stop offset="1" stopColor="#3b82f6" stopOpacity="0.2" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>

            {/* Bottom Left SVG - Gavel Pattern */}
            <div className="absolute left-10 bottom-20 z-1 opacity-8 lg:opacity-15">
                <svg
                    width="160"
                    height="160"
                    viewBox="0 0 160 160"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Gavel handle */}
                    <rect
                        x="50"
                        y="90"
                        width="8"
                        height="50"
                        rx="2"
                        fill="url(#paint9_linear_about)"
                        transform="rotate(-45 54 90)"
                        opacity="0.6"
                    />

                    {/* Gavel head */}
                    <rect
                        x="70"
                        y="55"
                        width="30"
                        height="12"
                        rx="3"
                        fill="url(#paint10_linear_about)"
                        transform="rotate(-45 85 61)"
                        opacity="0.6"
                    />

                    {/* Sound waves */}
                    <circle cx="100" cy="45" r="15" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.3" />
                    <circle cx="100" cy="45" r="25" stroke="#60a5fa" strokeWidth="1" fill="none" opacity="0.2" />

                    <defs>
                        <linearGradient id="paint9_linear_about" x1="54" y1="90" x2="54" y2="140">
                            <stop stopColor="#3b82f6" />
                            <stop offset="1" stopColor="#2563eb" stopOpacity="0.4" />
                        </linearGradient>
                        <linearGradient id="paint10_linear_about" x1="70" y1="61" x2="100" y2="61">
                            <stop stopColor="#60a5fa" />
                            <stop offset="1" stopColor="#3b82f6" stopOpacity="0.5" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Bottom Right SVG - Book and Quill */}
            <div className="absolute right-8 bottom-10 z-1 opacity-10 lg:opacity-18">
                <svg
                    width="150"
                    height="150"
                    viewBox="0 0 150 150"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Book */}
                    <rect
                        x="40"
                        y="60"
                        width="60"
                        height="70"
                        rx="4"
                        fill="url(#paint11_linear_about)"
                        opacity="0.4"
                    />
                    <line x1="70" y1="60" x2="70" y2="130" stroke="#60a5fa" strokeWidth="1.5" opacity="0.5" />

                    {/* Pages lines */}
                    <line x1="50" y1="80" x2="90" y2="80" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
                    <line x1="50" y1="90" x2="90" y2="90" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
                    <line x1="50" y1="100" x2="85" y2="100" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />

                    {/* Quill */}
                    <path
                        d="M 95 50 Q 100 55 105 65"
                        stroke="url(#paint12_linear_about)"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.5"
                    />
                    <circle cx="95" cy="48" r="3" fill="#3b82f6" opacity="0.6" />

                    <defs>
                        <linearGradient id="paint11_linear_about" x1="70" y1="60" x2="70" y2="130">
                            <stop stopColor="#60a5fa" stopOpacity="0.3" />
                            <stop offset="1" stopColor="#2563eb" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="paint12_linear_about" x1="95" y1="50" x2="105" y2="65">
                            <stop stopColor="#3b82f6" />
                            <stop offset="1" stopColor="#60a5fa" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>




        </div>
    );
};

export default AboutTabs;