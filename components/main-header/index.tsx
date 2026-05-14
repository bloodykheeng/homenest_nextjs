// components/Header/index.tsx
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiShoppingCart, FiUser, FiPhone, FiHeart, FiPackage, FiSettings, FiLogOut } from "react-icons/fi";
import useAuthContext from "@/providers/AuthProvider";
import { useFavourites } from "@/providers/FavouritesProvider";
import { menuData } from "./menuData";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";
import ThemeToggler from "./ThemeToggler";

import ShoppingCartButton from "./shopping-cart/ShoppingCartButton";

const Header = () => {
  const { getUserQuery, logoutMutation } = useAuthContext();
  const loggedInUserData = getUserQuery?.data?.data;
  const isSystemAdmin = loggedInUserData?.role === "System Admin";
  const { favouriteCount } = useFavourites();

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
              {/* Support — click to open phone dialer */}
              <a href="tel:+256788401004" className="flex items-center gap-3.5 cursor-pointer group">
                <FiPhone className="text-primary text-2xl group-hover:text-primary/80 transition-colors" />
                <div>
                  <span className="block text-xs text-dark-4 dark:text-gray-400 uppercase">
                    24/7 SUPPORT
                  </span>
                  <p className="font-medium text-sm text-dark dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
                    (+256) 7884-01004
                  </p>
                </div>
              </a>

              <span className="w-px h-7.5 bg-gray-300 dark:bg-gray-600"></span>

              {/* User */}
              {!loggedInUserData ? (
                <Link href="/signin" className="flex items-center gap-2.5">
                  <FiUser className="text-primary text-2xl" />
                  <div>
                    <span className="block text-xs text-dark-4 dark:text-gray-400 uppercase">account</span>
                    <p className="font-medium text-sm text-dark dark:text-white">Sign In</p>
                  </div>
                </Link>
              ) : isSystemAdmin ? (
                <div className="flex items-center gap-3">
                  <Link href="/dashboard" className="flex items-center gap-2.5">
                    <FiUser className="text-primary text-2xl" />
                    <div>
                      <span className="block text-xs text-dark-4 dark:text-gray-400 uppercase">account</span>
                      <p className="font-medium text-sm text-dark dark:text-white">Dashboard</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => logoutMutation.mutate({})}
                    title="Logout"
                    className="flex items-center justify-center w-8 h-8 rounded-md text-dark dark:text-white hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <FiLogOut className="text-lg" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => logoutMutation.mutate({})}
                  className="flex items-center gap-2.5"
                >
                  <FiUser className="text-primary text-2xl" />
                  <div>
                    <span className="block text-xs text-dark-4 dark:text-gray-400 uppercase">account</span>
                    <p className="font-medium text-sm text-dark dark:text-white">Logout</p>
                  </div>
                </button>
              )}

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
                isSystemAdmin={isSystemAdmin}
                logoutMutation={logoutMutation}
              />

              {/* Right Nav (Favourites + Orders) */}
              <div>
                <ul className="flex items-center gap-5.5">
                  {loggedInUserData && (
                    <li className="py-4">
                      <Link
                        href="/profile"
                        className={`flex items-center gap-1.5 font-medium text-sm hover:text-primary dark:hover:text-primary transition-colors ${pathname === "/profile" ? "text-primary" : "text-dark dark:text-white"}`}
                      >
                        Profile
                        <FiSettings className="text-xl" />
                      </Link>
                    </li>
                  )}
                  <li className="py-4">
                    <Link
                      href="/favourites"
                      className={`flex items-center gap-1.5 font-medium text-sm hover:text-primary dark:hover:text-primary transition-colors ${pathname === "/favourites" ? "text-primary" : "text-dark dark:text-white"}`}
                    >
                      Favourites
                      <span className="relative">
                        <FiHeart className="text-xl" />
                        {favouriteCount > 0 && (
                          <span className="flex items-center justify-center font-medium text-xs absolute -right-2 -top-2.5 bg-primary w-4.5 h-4.5 rounded-full text-white">
                            {favouriteCount > 99 ? "99+" : favouriteCount}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                  <li className="py-4">
                    <Link
                      href="/orders"
                      className={`flex items-center gap-1.5 font-medium text-sm hover:text-primary dark:hover:text-primary transition-colors ${pathname === "/orders" ? "text-primary" : "text-dark dark:text-white"}`}
                    >
                      Orders
                      <FiPackage className="text-xl" />
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
        isSystemAdmin={isSystemAdmin}
        logoutMutation={logoutMutation}
      />

    </>
  );
};

export default Header;