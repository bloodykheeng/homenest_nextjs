"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import useAuthContext from "@/providers/AuthProvider";

const Header = () => {

  const { getUserQuery, logoutMutation } = useAuthContext();
  const loggedInUserData = getUserQuery?.data?.data;

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);

  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const usePathName = usePathname();

  // Handle sticky nav on scroll
  const handleStickyNavbar: () => void = () => {
    setSticky(window.scrollY >= 80);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => {
      window.removeEventListener("scroll", handleStickyNavbar);
    };
  }, []);



  // Use useMemo to create a memoized version of the click handler
  const handleClickOutside = useMemo(() => {
    return (event: MouseEvent) => {

      // Check if click is outside both menu and hamburger button
      const isOutsideMenu = menuRef.current && !menuRef.current.contains(event.target as Node);
      const clickedHamburgerButton = hamburgerRef.current && hamburgerRef.current.contains(event.target as Node);

      // If clicking outside menu AND outside hamburger button → close the menu
      if (isOutsideMenu && !clickedHamburgerButton && navbarOpen) {
        setNavbarOpen(false);
        setOpenIndex(-1);
      }
    };
  }, [navbarOpen]); // Include navbarOpen in dependencies


  // Use the memoized handler in useEffect
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]); // Use the memoized handler as dependency

  const navbarToggleHandler = (e: React.MouseEvent) => {
    // e.stopPropagation(); // Stop event bubbling
    console.log("🚀 ~ navbarOpen: out", navbarOpen)
    setNavbarOpen(prev => !prev);
  };

  const handleSubmenu = (index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  const closeMenus = () => {
    setNavbarOpen(false);
    setOpenIndex(-1);
  };

  return (
    <>
      <header
        className={`header top-0 left-0 z-40 flex w-full items-center ${sticky
          ? "dark:bg-gray-dark dark:shadow-sticky-dark shadow-sticky fixed z-9999 bg-white/80 backdrop-blur-xs transition"
          : "absolute bg-transparent"
          }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-100 max-w-full xl:mx-12"> {/* Container width increased from w-60 → w-80 */}
              <Link
                href="/"
                className={`header-logo block w-full ${sticky ? "py-5 lg:py-2" : "py-5"}`}
              >
                {/* Light mode logo */}
                <Image
                  src="/logos/uhrc-complete-logo.png"
                  alt="logo"
                  width={200}   // increased width
                  height={50}   // increased height
                  className="w-full h-auto dark:hidden"
                />

                {/* Dark mode logo */}
                <Image
                  src="/logos/uhrc-complete-logo.png"
                  alt="logo"
                  width={200}
                  height={50}
                  className="hidden w-full h-auto dark:block"
                />
              </Link>
            </div>

            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button
                  ref={hamburgerRef}
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="ring-primary absolute top-1/2 right-4 block translate-y-[-50%] rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? "top-[7px] rotate-45" : " "
                      }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? "opacity-0" : " "
                      }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? "top-[-8px] -rotate-45" : " "
                      }`}
                  />
                </button>
                <nav
                  ref={menuRef}
                  id="navbarCollapse"
                  className={`navbar border-body-color/50 dark:border-body-color/20 dark:bg-dark absolute right-0 z-30 w-[250px] rounded border-[.5px] bg-white px-6 py-4 duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${navbarOpen
                    ? "visibility top-full opacity-100"
                    : "invisible top-[120%] opacity-0"
                    }`}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    {menuData.map((menuItem, index) => (
                      <li key={index} className="group relative">
                        {menuItem.path ? (
                          <Link
                            href={menuItem.path}
                            onClick={closeMenus}
                            className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${usePathName === menuItem.path
                              ? "text-primary dark:text-white"
                              : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                              }`}
                          >
                            {menuItem.title}
                          </Link>
                        ) : (
                          <>
                            <p
                              onClick={() => handleSubmenu(index)}
                              className="text-dark group-hover:text-primary flex cursor-pointer items-center justify-between py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 dark:text-white/70 dark:group-hover:text-white"
                            >
                              {menuItem.title}
                              <span className="pl-3">
                                <svg width="25" height="24" viewBox="0 0 25 24">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </p>
                            <div
                              className={`submenu dark:bg-dark relative top-full left-0 rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${openIndex === index ? "block" : "hidden"
                                }`}
                            >
                              {menuItem?.submenu?.map((submenuItem, index) => (
                                <Link
                                  href={submenuItem.path}
                                  onClick={closeMenus}
                                  key={index}
                                  className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                                >
                                  {submenuItem.title}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                  {/* Mobile-only sign in/up */}
                  <div className="mt-4 border-t pt-4 lg:hidden">
                    <Link
                      href="/signin"
                      className="block w-full text-center py-2 text-base font-medium text-dark hover:opacity-70 dark:text-white"
                      onClick={closeMenus}
                    >
                      Sign In
                    </Link>


                    {getUserQuery.isLoading ? (
                      <div className="flex justify-center py-2">
                        <i className="pi pi-spinner pi-spin text-primary text-xl"></i>
                      </div>
                    ) : loggedInUserData ? (
                      <Link
                        href="/dashboard"
                        className="block w-full text-center mt-2 bg-primary py-2 rounded text-white font-medium hover:bg-opacity-90"
                        onClick={closeMenus}
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/login"
                        className="block w-full text-center mt-2 bg-primary py-2 rounded text-white font-medium hover:bg-opacity-90"
                        onClick={closeMenus}
                      >
                        Login
                      </Link>
                    )}
                  </div>

                  {/* Mobile-only theme toggle */}
                  <div className="mt-4 border-t pt-4 lg:hidden flex justify-center">
                    <ThemeToggler />
                  </div>
                </nav>
              </div>
              {/* Desktop sign in/up */}
              <div className="hidden lg:flex items-center">
                {/* <Link
                href="/signin"
                className="px-7 py-3 text-base font-medium text-dark hover:opacity-70 dark:text-white"
              >
                Sign In
              </Link> */}


                {getUserQuery.isLoading ? (
                  <i className="pi pi-spinner pi-spin text-primary text-xl"></i>
                ) : loggedInUserData ? (
                  <Link
                    href="/dashboard"
                    className="ease-in-up shadow-btn hover:shadow-btn-hover rounded-sm bg-primary px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-opacity-90"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/signin"
                    className="ease-in-up shadow-btn hover:shadow-btn-hover rounded-sm bg-primary px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-opacity-90"
                  >
                    Signin
                  </Link>
                )}

                {/* Desktop theme toggle */}
                <div className="hidden lg:block">
                  <ThemeToggler />
                </div>

              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
