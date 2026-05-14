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

            {/* Top Left SVG - House outline */}
            <div className="absolute left-0 top-20 z-1 opacity-10 lg:opacity-20">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Roof */}
                    <path d="M 100 40 L 160 100 L 40 100 Z" stroke="url(#hn1)" strokeWidth="3" fill="url(#hn2)" opacity="0.5" />
                    {/* Walls */}
                    <rect x="60" y="100" width="80" height="60" rx="2" stroke="url(#hn1)" strokeWidth="2" fill="none" opacity="0.6" />
                    {/* Door */}
                    <rect x="85" y="125" width="30" height="35" rx="2" fill="url(#hn3)" opacity="0.5" />
                    {/* Window */}
                    <rect x="65" y="110" width="18" height="16" rx="2" stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.5" />
                    <rect x="117" y="110" width="18" height="16" rx="2" stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.5" />
                    {/* Chimney */}
                    <rect x="130" y="55" width="12" height="30" rx="2" fill="url(#hn1)" opacity="0.4" />
                    <defs>
                        <linearGradient id="hn1" x1="100" y1="40" x2="100" y2="160">
                            <stop stopColor="#2563eb" /><stop offset="1" stopColor="#60a5fa" />
                        </linearGradient>
                        <linearGradient id="hn2" x1="100" y1="40" x2="100" y2="100">
                            <stop stopColor="#60a5fa" stopOpacity="0.2" /><stop offset="1" stopColor="#3b82f6" stopOpacity="0.05" />
                        </linearGradient>
                        <linearGradient id="hn3" x1="100" y1="125" x2="100" y2="160">
                            <stop stopColor="#3b82f6" stopOpacity="0.4" /><stop offset="1" stopColor="#2563eb" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Top Right SVG - Sofa / couch */}
            <div className="absolute right-0 top-40 z-1 opacity-10 lg:opacity-20">
                <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Seat base */}
                    <rect x="30" y="90" width="140" height="35" rx="8" fill="url(#sf1)" opacity="0.5" />
                    {/* Back cushion */}
                    <rect x="30" y="60" width="140" height="35" rx="8" fill="url(#sf2)" opacity="0.4" />
                    {/* Left arm */}
                    <rect x="20" y="65" width="20" height="60" rx="6" fill="url(#sf1)" opacity="0.5" />
                    {/* Right arm */}
                    <rect x="160" y="65" width="20" height="60" rx="6" fill="url(#sf1)" opacity="0.5" />
                    {/* Legs */}
                    <rect x="45" y="122" width="10" height="20" rx="3" fill="#3b82f6" opacity="0.4" />
                    <rect x="145" y="122" width="10" height="20" rx="3" fill="#3b82f6" opacity="0.4" />
                    {/* Cushion divider */}
                    <line x1="100" y1="90" x2="100" y2="125" stroke="#60a5fa" strokeWidth="1.5" opacity="0.4" />
                    <defs>
                        <linearGradient id="sf1" x1="100" y1="60" x2="100" y2="142">
                            <stop stopColor="#2563eb" /><stop offset="1" stopColor="#60a5fa" />
                        </linearGradient>
                        <linearGradient id="sf2" x1="100" y1="60" x2="100" y2="95">
                            <stop stopColor="#60a5fa" /><stop offset="1" stopColor="#3b82f6" stopOpacity="0.5" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Bottom Left SVG - Plant / leaf */}
            <div className="absolute left-10 bottom-20 z-1 opacity-8 lg:opacity-15">
                <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Pot */}
                    <path d="M 60 120 L 55 145 L 105 145 L 100 120 Z" fill="url(#pl1)" opacity="0.5" />
                    <rect x="52" y="112" width="56" height="12" rx="3" fill="url(#pl2)" opacity="0.5" />
                    {/* Stem */}
                    <path d="M 80 112 Q 80 80 80 60" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
                    {/* Leaves */}
                    <path d="M 80 80 Q 55 65 50 40 Q 70 50 80 80" fill="url(#pl2)" opacity="0.5" />
                    <path d="M 80 70 Q 105 55 110 30 Q 90 45 80 70" fill="url(#pl1)" opacity="0.5" />
                    <path d="M 80 95 Q 55 88 45 70 Q 65 75 80 95" fill="url(#pl2)" opacity="0.4" />
                    <defs>
                        <linearGradient id="pl1" x1="80" y1="30" x2="80" y2="145">
                            <stop stopColor="#3b82f6" /><stop offset="1" stopColor="#2563eb" stopOpacity="0.4" />
                        </linearGradient>
                        <linearGradient id="pl2" x1="80" y1="30" x2="80" y2="112">
                            <stop stopColor="#60a5fa" /><stop offset="1" stopColor="#3b82f6" stopOpacity="0.5" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Bottom Right SVG - Lamp */}
            <div className="absolute right-8 bottom-10 z-1 opacity-10 lg:opacity-18">
                <svg width="140" height="180" viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Shade */}
                    <path d="M 35 80 L 50 30 L 90 30 L 105 80 Z" fill="url(#lm1)" opacity="0.45" />
                    {/* Shade outline */}
                    <path d="M 35 80 L 50 30 L 90 30 L 105 80" stroke="url(#lm2)" strokeWidth="2" fill="none" opacity="0.6" />
                    {/* Pole */}
                    <rect x="67" y="80" width="6" height="70" rx="3" fill="url(#lm2)" opacity="0.5" />
                    {/* Base */}
                    <ellipse cx="70" cy="152" rx="28" ry="8" fill="url(#lm1)" opacity="0.4" />
                    {/* Light glow */}
                    <circle cx="70" cy="60" r="18" fill="#fbbf24" opacity="0.1" />
                    <circle cx="70" cy="60" r="10" fill="#fbbf24" opacity="0.15" />
                    <defs>
                        <linearGradient id="lm1" x1="70" y1="30" x2="70" y2="160">
                            <stop stopColor="#60a5fa" stopOpacity="0.4" /><stop offset="1" stopColor="#2563eb" stopOpacity="0.15" />
                        </linearGradient>
                        <linearGradient id="lm2" x1="70" y1="30" x2="70" y2="152">
                            <stop stopColor="#3b82f6" /><stop offset="1" stopColor="#60a5fa" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>




        </div>
    );
};

export default AboutTabs;