// components/Footer/index.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-gradient-to-b from-slate-50 to-white dark:from-gray-dark dark:to-gray-900 overflow-hidden">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Footer Menu */}
        <div className="flex flex-wrap xl:flex-nowrap gap-10 xl:gap-19 xl:justify-between pt-5 xl:pt-10 pb-5 xl:pb-5">
          {/* About Section */}
          <div className="max-w-[330px] w-full">
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/logos/homenest_light.png"
                alt="HomeNest Logo"
                width={140}
                height={80}
                className="w-auto h-20 dark:hidden"
              />
              <Image
                src="/logos/homenest_dark.png"
                alt="HomeNest Logo"
                width={140}
                height={80}
                className="hidden w-auto h-20 dark:block"
              />
            </Link>

            <p className="text-sm text-body-color dark:text-gray-400 mb-6">
              HomeNest brings together carefully selected household essentials,
              décor, and everyday home needs in one place. Designed to make your
              home feel warmer, simpler, and more comfortable — from kitchen to
              living room.
            </p>

            <p className="text-base font-semibold text-primary dark:text-primary mb-6">
              Comfort Starts Here
            </p>
          </div>

          {/* Contact Information */}
          <div className="w-full sm:w-auto">
            <h2 className="mb-7.5 text-lg font-medium text-dark dark:text-white">
              Contact Us
            </h2>

            <ul className="flex flex-col gap-3.5">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-primary dark:text-primary flex-shrink-0 text-lg mt-0.5" />
                <span className="text-sm text-body-color dark:text-gray-400">Kampala, Uganda</span>
              </li>

              <li>
                <a href="tel:+256788401004" className="flex items-start gap-3 hover:text-primary dark:hover:text-primary transition-colors">
                  <FiPhone className="text-primary dark:text-primary flex-shrink-0 text-lg mt-0.5" />
                  <span className="text-sm text-body-color dark:text-gray-400">(+256) 7884-01004</span>
                </a>
              </li>

              <li>
                <a href="mailto:kaweesifahim@gmail.com" className="flex items-start gap-3 hover:text-primary dark:hover:text-primary transition-colors">
                  <FiMail className="text-primary dark:text-primary flex-shrink-0 text-lg mt-0.5" />
                  <span className="text-sm text-body-color dark:text-gray-400">kaweesifahim@gmail.com</span>
                </a>
              </li>

              <li>
                {/* Social Links */}
                <div className="flex items-center gap-4 mt-4">
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-dark dark:text-white hover:bg-primary hover:text-white dark:hover:bg-primary transition-all"
                  >
                    <FiFacebook className="text-lg" />
                  </a>

                  <a
                    href="#"
                    aria-label="Twitter"
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-dark dark:text-white hover:bg-primary hover:text-white dark:hover:bg-primary transition-all"
                  >
                    <FiTwitter className="text-lg" />
                  </a>

                  <a
                    href="#"
                    aria-label="Instagram"
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-dark dark:text-white hover:bg-primary hover:text-white dark:hover:bg-primary transition-all"
                  >
                    <FiInstagram className="text-lg" />
                  </a>

                  <a
                    href="#"
                    aria-label="LinkedIn"
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-dark dark:text-white hover:bg-primary hover:text-white dark:hover:bg-primary transition-all"
                  >
                    <FiLinkedin className="text-lg" />
                  </a>
                </div>
              </li>
            </ul>


          </div>

          {/* Quick Links */}
          <div className="w-full sm:w-auto">
            <h2 className="mb-7.5 text-lg font-medium text-dark dark:text-white">
              Quick Link
            </h2>

            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/privacy-policy" className="text-sm text-body-color dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-sm text-body-color dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-body-color dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-sm text-body-color dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  FAQ&apos;s
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-body-color dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="w-full sm:w-auto">
            <h2 className="mb-7.5 text-lg font-medium text-dark dark:text-white">
              Categories
            </h2>

            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/shop?category=kitchen" className="text-sm text-body-color dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Kitchen
                </Link>
              </li>
              <li>
                <Link href="/shop?category=living-room" className="text-sm text-body-color dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Living Room
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bedroom" className="text-sm text-body-color dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Bedroom
                </Link>
              </li>
              <li>
                <Link href="/shop?category=decor" className="text-sm text-body-color dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Home Décor
                </Link>
              </li>
              <li>
                <Link href="/shop?category=essentials" className="text-sm text-body-color dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Essentials
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <p className="text-center text-sm text-body-color dark:text-gray-400">
            &copy; {year} HomeNest. All rights reserved.
          </p>
        </div>
      </div>

      {/* Decorative SVG - Bottom Left */}
      <div className="absolute bottom-0 left-0 z-[-1] opacity-20 dark:opacity-10">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="140" r="40" stroke="url(#footer_gradient_1)" strokeWidth="1.5" fill="none" opacity="0.5" />
          <circle cx="100" cy="160" r="25" fill="url(#footer_gradient_2)" opacity="0.4" />
          <circle cx="40" cy="100" r="15" fill="url(#footer_gradient_3)" opacity="0.6" />

          <defs>
            <linearGradient id="footer_gradient_1" x1="60" y1="100" x2="60" y2="180">
              <stop stopColor="#3b82f6" />
              <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="footer_gradient_2">
              <stop offset="0.3" stopColor="#60a5fa" />
              <stop offset="1" stopColor="#2563eb" stopOpacity="0.2" />
            </radialGradient>
            <radialGradient id="footer_gradient_3">
              <stop offset="0.3" stopColor="#3b82f6" />
              <stop offset="1" stopColor="#2563eb" stopOpacity="0.3" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Decorative SVG - Bottom Right */}
      <div className="absolute bottom-0 right-0 z-[-1] opacity-15 dark:opacity-10">
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="120" cy="120" r="50" stroke="url(#footer_right_gradient)" strokeWidth="1" fill="none" opacity="0.6" />
          <circle cx="140" cy="60" r="30" fill="url(#footer_right_fill)" opacity="0.4" />
          <circle cx="50" cy="50" r="4" fill="#3b82f6" opacity="0.6" />
          <circle cx="80" cy="60" r="3" fill="#60a5fa" opacity="0.5" />

          <defs>
            <linearGradient id="footer_right_gradient" x1="120" y1="70" x2="120" y2="170">
              <stop stopColor="#3b82f6" />
              <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="footer_right_fill">
              <stop offset="0.3" stopColor="#60a5fa" stopOpacity="0" />
              <stop offset="1" stopColor="#3b82f6" stopOpacity="0.4" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;