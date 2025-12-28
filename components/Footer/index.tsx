"use client";
import Image from "next/image";
import Link from "next/link";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <>
      <footer className="relative z-10 bg-linear-to-b from-slate-50 to-white dark:from-gray-dark dark:to-gray-900 bottom-0 overflow-hidden">
        <div className="container relative">

          {/* Copyright Section */}
          <div className="py-6">
            <p className="text-center text-base text-body-color dark:text-white">
              © {new Date().getFullYear()} HURIS | Powered by{" "}
              <a
                href="https://www.uhrc.ug"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary font-medium transition"
              >
                Uganda Human Rights Commission
              </a>
            </p>
          </div>
        </div>

        {/* Decorative SVG - Bottom Left Corner */}
        <div className="absolute bottom-0 left-0 z-[-1] opacity-20 dark:opacity-10">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Shield icon pattern */}
            <path
              d="M40 60 L60 50 L60 80 Q60 110 40 125 Q20 110 20 80 L20 50 Z"
              fill="url(#footer_shield_gradient)"
              opacity="0.6"
            />
            <path
              d="M100 100 L120 90 L120 120 Q120 150 100 165 Q80 150 80 120 L80 90 Z"
              fill="url(#footer_shield_gradient)"
              opacity="0.4"
            />

            {/* Circles */}
            <circle cx="140" cy="140" r="30" stroke="url(#footer_circle_gradient)" strokeWidth="1.5" fill="none" opacity="0.5" />
            <circle cx="60" cy="160" r="15" fill="url(#footer_dot_gradient)" opacity="0.6" />

            <defs>
              <linearGradient id="footer_shield_gradient" x1="20" y1="50" x2="60" y2="125" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#2563eb" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="footer_circle_gradient" x1="140" y1="110" x2="140" y2="170" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563eb" />
                <stop offset="1" stopColor="#60a5fa" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="footer_dot_gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(60 160) scale(15)">
                <stop offset="0.3" stopColor="#60a5fa" />
                <stop offset="1" stopColor="#2563eb" stopOpacity="0.2" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Decorative SVG - Bottom Right Corner */}
        <div className="absolute bottom-0 right-0 z-[-1] opacity-15 dark:opacity-10">
          <svg
            width="180"
            height="180"
            viewBox="0 0 180 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Justice scales inspired pattern */}
            <circle cx="120" cy="120" r="50" stroke="url(#footer_right_gradient)" strokeWidth="1" fill="none" opacity="0.6" />
            <circle cx="110" cy="110" r="30" fill="url(#footer_right_fill)" opacity="0.4" />

            {/* Geometric shapes */}
            <rect x="30" y="120" width="40" height="40" rx="6" fill="url(#footer_rect_gradient)" opacity="0.5" />
            <circle cx="150" cy="50" r="20" fill="url(#footer_accent_gradient)" opacity="0.5" />

            {/* Small dots */}
            <circle cx="50" cy="50" r="4" fill="#3b82f6" opacity="0.6" />
            <circle cx="80" cy="60" r="3" fill="#60a5fa" opacity="0.5" />
            <circle cx="110" cy="55" r="4" fill="#3b82f6" opacity="0.6" />

            <defs>
              <linearGradient id="footer_right_gradient" x1="120" y1="70" x2="120" y2="170" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="footer_right_fill" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(110 110) scale(30)">
                <stop offset="0.3" stopColor="#60a5fa" stopOpacity="0" />
                <stop offset="1" stopColor="#3b82f6" stopOpacity="0.4" />
              </radialGradient>
              <linearGradient id="footer_rect_gradient" x1="30" y1="120" x2="70" y2="160" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60a5fa" />
                <stop offset="1" stopColor="#2563eb" stopOpacity="0.3" />
              </linearGradient>
              <radialGradient id="footer_accent_gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(150 50) scale(20)">
                <stop offset="0.3" stopColor="#3b82f6" />
                <stop offset="1" stopColor="#2563eb" stopOpacity="0.2" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Top decorative line pattern */}
        <div className="absolute top-0 left-0 right-0 z-[-1] h-1 opacity-30">
          <svg width="100%" height="4" preserveAspectRatio="none" viewBox="0 0 1200 4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 2 Q300 0 600 2 T1200 2" stroke="url(#footer_top_line)" strokeWidth="2" fill="none" />
            <defs>
              <linearGradient id="footer_top_line" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="0.5" stopColor="#2563eb" />
                <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </footer >
    </>
  );
};

export default Footer;