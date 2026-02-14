// components/Header/index.tsx
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiShoppingCart, FiUser, FiPhone } from "react-icons/fi";
import useAuthContext from "@/providers/AuthProvider";
import { menuData } from "./menuData";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";
import ThemeToggler from "./ThemeToggler";

import ShoppingCartButton from "./shopping-cart/ShoppingCartButton";

const Header = () => {
  const { getUserQuery } = useAuthContext();
  const loggedInUserData = getUserQuery?.data?.data;

  const [sticky, setSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(-1);

  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Sticky header on scroll
  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY >= 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on click outside
  const handleClickOutside = useMemo(() => {
    return (event: MouseEvent) => {
      const isOutsideMenu = menuRef.current && !menuRef.current.contains(event.target as Node);
      const clickedHamburger = hamburgerRef.current && hamburgerRef.current.contains(event.target as Node);

      if (isOutsideMenu && !clickedHamburger && mobileMenuOpen) {
        setMobileMenuOpen(false);
        setOpenSubmenu(-1);
      }
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setOpenSubmenu(-1);
  };

  return (
    <>
      <header
        className={`fixed left-0 top-0 w-full z-40 transition-all duration-300 ${sticky
          ? "bg-white/80 dark:bg-gray-dark dark:shadow-sticky-dark shadow-sticky backdrop-blur-sm"
          : "bg-white dark:bg-gray-dark"
          }`}
      >
        <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
          {/* Top Header */}
          <div
            className={`flex items-center justify-between transition-all duration-200 ${sticky ? "py-4" : "py-6"
              }`}
          >
            {/* Logo - Always visible */}
            <Link className="flex-shrink-0" href="/">
              <Image
                src="/logos/homenest_light.png"
                alt="Logo"
                width={140}
                height={40}
                className="w-auto h-10 dark:hidden"
              />
              <Image
                src="/logos/homenest_dark.png"
                alt="Logo"
                width={140}
                height={40}
                className="hidden w-auto h-10 dark:block"
              />
            </Link>

            {/* Desktop: Search Bar */}
            <div className="hidden xl:flex flex-1 max-w-[500px] mx-8">
              <SearchBar />
            </div>

            {/* Desktop: Support + User + Cart + Theme */}
            <div className="hidden xl:flex items-center gap-5">
              {/* Support */}
              <div className="flex items-center gap-3.5">
                <FiPhone className="text-primary text-2xl" />
                <div>
                  <span className="block text-xs text-dark-4 dark:text-gray-400 uppercase">
                    24/7 SUPPORT
                  </span>
                  <p className="font-medium text-sm text-dark dark:text-white">
                    (+256) 7884-01004
                  </p>
                </div>
              </div>

              <span className="w-px h-7.5 bg-gray-300 dark:bg-gray-600"></span>

              {/* User */}
              <Link
                href={loggedInUserData ? "/dashboard" : "/signin"}
                className="flex items-center gap-2.5"
              >
                <FiUser className="text-primary text-2xl" />
                <div>
                  <span className="block text-xs text-dark-4 dark:text-gray-400 uppercase">
                    account
                  </span>
                  <p className="font-medium text-sm text-dark dark:text-white">
                    {loggedInUserData ? "Dashboard" : "Sign In"}
                  </p>
                </div>
              </Link>

              {/* Cart */}
              <ShoppingCartButton />

              {/* Theme Toggle */}
              <ThemeToggler />
            </div>

            {/* Mobile: Hamburger only */}
            <button
              ref={hamburgerRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden block relative w-5.5 h-5.5"
            >
              <span className="block absolute right-0 w-full h-full">
                <span
                  className={`block relative bg-dark dark:bg-white rounded-sm w-0 h-0.5 my-1 transition-all duration-200 ${!mobileMenuOpen && "!w-full delay-300"
                    }`}
                />
                <span
                  className={`block relative bg-dark dark:bg-white rounded-sm w-0 h-0.5 my-1 transition-all duration-200 delay-150 ${!mobileMenuOpen && "!w-full delay-400"
                    }`}
                />
                <span
                  className={`block relative bg-dark dark:bg-white rounded-sm w-0 h-0.5 my-1 transition-all duration-200 delay-200 ${!mobileMenuOpen && "!w-full delay-500"
                    }`}
                />
              </span>
              <span className="block absolute right-0 w-full h-full rotate-45">
                <span
                  className={`block bg-dark dark:bg-white rounded-sm transition-all duration-200 delay-300 absolute left-2.5 top-0 w-0.5 h-full ${!mobileMenuOpen && "!h-0 delay-0"
                    }`}
                />
                <span
                  className={`block bg-dark dark:bg-white rounded-sm transition-all duration-200 delay-400 absolute left-0 top-2.5 w-full h-0.5 ${!mobileMenuOpen && "!h-0 delay-200"
                    }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation Bar */}
        <div className="hidden xl:block border-t border-gray-300 dark:border-gray-700">
          <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
            <div className="flex items-center justify-between">
              <MobileMenu
                ref={menuRef}
                isOpen={mobileMenuOpen}
                menuData={menuData}
                pathname={pathname}
                sticky={sticky}
                openSubmenu={openSubmenu}
                setOpenSubmenu={setOpenSubmenu}
                closeMenus={closeMenus}
                loggedInUserData={loggedInUserData}
              />

              {/* Right Nav (Wishlist) */}
              <div>
                <ul className="flex items-center gap-5.5">
                  <li className="py-4">
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-1.5 font-medium text-sm text-dark dark:text-white hover:text-primary dark:hover:text-primary"
                    >
                      Wishlist
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <MobileMenu
        ref={menuRef}
        isOpen={mobileMenuOpen}
        menuData={menuData}
        pathname={pathname}
        sticky={sticky}
        openSubmenu={openSubmenu}
        setOpenSubmenu={setOpenSubmenu}
        closeMenus={closeMenus}
        loggedInUserData={loggedInUserData}
      />

    </>
  );
};

export default Header;