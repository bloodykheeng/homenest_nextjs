// components/Header/MobileMenu.tsx
import { forwardRef } from "react";
import Link from "next/link";
import { FiChevronDown, FiUser, FiPhone, FiPackage, FiSettings, FiLogOut } from "react-icons/fi";
import { Menu } from "./menuData";
import ThemeToggler from "./ThemeToggler";
import SearchBar from "./SearchBar";
import ShoppingCartButton from "./shopping-cart/ShoppingCartButton";

interface MobileMenuProps {
    isOpen: boolean;
    menuData: Menu[];
    pathname: string;
    sticky: boolean;
    openSubmenu: number;
    setOpenSubmenu: (index: number) => void;
    closeMenus: () => void;
    loggedInUserData?: any;
    isSystemAdmin?: boolean;
    logoutMutation?: any;
}

const MobileMenu = forwardRef<HTMLDivElement, MobileMenuProps>(
    (
        {
            isOpen,
            menuData,
            pathname,
            sticky,
            openSubmenu,
            setOpenSubmenu,
            closeMenus,
            loggedInUserData,
            isSystemAdmin,
            logoutMutation,
        },
        ref
    ) => {
        return (
            <>
                {/* Desktop Menu */}
                <div className="hidden xl:flex items-center">
                    <nav>
                        <ul className="flex items-center gap-6">
                            {menuData.map((item, i) =>
                                item.submenu ? (
                                    <li key={i} className="group relative">
                                        <button
                                            className={`flex items-center gap-1.5 font-medium text-sm capitalize hover:text-primary dark:hover:text-primary ${sticky ? "py-4" : "py-6"} ${pathname === item.path ? "text-primary" : "text-dark dark:text-white"}`}
                                        >
                                            {item.title}
                                            <FiChevronDown />
                                        </button>

                                        <ul className="absolute top-full left-0 bg-white dark:bg-gray-dark shadow-lg rounded-md min-w-[200px] invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-50">
                                            {item.submenu.map((sub, j) => (
                                                <li key={j}>
                                                    <Link
                                                        href={sub.path ?? ""}
                                                        className={`block px-4 py-2 text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary ${pathname === sub.path && "text-primary bg-gray-100 dark:bg-gray-800"}`}
                                                    >
                                                        {sub.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ) : (
                                    <li key={i}>
                                        <Link
                                            href={item.path ?? ""}
                                            className={`font-medium text-sm hover:text-primary dark:hover:text-primary flex ${sticky ? "py-4" : "py-6"} ${pathname === item.path ? "text-primary" : "text-dark dark:text-white"}`}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </nav>
                </div>

                {/* Mobile Menu Dropdown */}
                <div
                    ref={ref}
                    className={`xl:hidden fixed top-[80px] left-0 right-0 z-50 bg-white dark:bg-gray-dark shadow-lg border-t border-gray-300 dark:border-gray-700 transition-all duration-300 overflow-y-auto ${isOpen ? "max-h-[calc(100vh-80px)] opacity-100" : "max-h-0 opacity-0 invisible"}`}
                >
                    <div className="container mx-auto px-4 py-6">
                        {/* Search Bar */}
                        <div className="mb-6">
                            <SearchBar />
                        </div>

                        {/* Navigation Links */}
                        <nav className="mb-6">
                            <ul className="flex flex-col gap-2">
                                {menuData.map((item, i) =>
                                    item.submenu ? (
                                        <li key={i}>
                                            <button
                                                onClick={() => setOpenSubmenu(openSubmenu === i ? -1 : i)}
                                                className="flex items-center justify-between w-full px-4 py-3 font-medium text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                                            >
                                                {item.title}
                                                <FiChevronDown
                                                    className={`transition-transform ${openSubmenu === i ? "rotate-180" : ""}`}
                                                />
                                            </button>

                                            {openSubmenu === i && (
                                                <ul className="mt-2 ml-4 space-y-1">
                                                    {item.submenu.map((sub, j) => (
                                                        <li key={j}>
                                                            <Link
                                                                href={sub.path ?? ""}
                                                                onClick={closeMenus}
                                                                className={`block px-4 py-2 text-sm rounded-md ${pathname === sub.path
                                                                    ? "text-primary bg-gray-100 dark:bg-gray-800"
                                                                    : "text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                                                                    }`}
                                                            >
                                                                {sub.title}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ) : (
                                        <li key={i}>
                                            <Link
                                                href={item.path ?? ""}
                                                onClick={closeMenus}
                                                className={`block px-4 py-3 font-medium rounded-md ${pathname === item.path
                                                    ? "text-primary bg-gray-100 dark:bg-gray-800"
                                                    : "text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                                                    }`}
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    )
                                )}
                            </ul>
                        </nav>

                        {/* User Actions */}
                        <div className="space-y-3 pb-4 border-b border-gray-300 dark:border-gray-700">
                            {/* User Account */}
                            {!loggedInUserData ? (
                                <Link
                                    href="/signin"
                                    onClick={closeMenus}
                                    className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <FiUser className="text-primary text-xl" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Account</p>
                                        <p className="font-medium text-sm text-dark dark:text-white">Sign In</p>
                                    </div>
                                </Link>
                            ) : isSystemAdmin ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        onClick={closeMenus}
                                        className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <FiUser className="text-primary text-xl" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Account</p>
                                            <p className="font-medium text-sm text-dark dark:text-white">Dashboard</p>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => { logoutMutation?.mutate({}); closeMenus(); }}
                                        className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-red-500 dark:text-red-400"
                                    >
                                        <FiLogOut className="text-xl" />
                                        <div className="text-left">
                                            <p className="text-xs uppercase opacity-70">Account</p>
                                            <p className="font-medium text-sm">Logout</p>
                                        </div>
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => { logoutMutation?.mutate({}); closeMenus(); }}
                                    className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 w-full"
                                >
                                    <FiUser className="text-primary text-xl" />
                                    <div className="text-left">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Account</p>
                                        <p className="font-medium text-sm text-dark dark:text-white">Logout</p>
                                    </div>
                                </button>
                            )}

                            {/* Profile (logged in only) */}
                            {loggedInUserData && (
                                <Link
                                    href="/profile"
                                    onClick={closeMenus}
                                    className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <FiSettings className="text-primary text-xl" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">My</p>
                                        <p className="font-medium text-sm text-dark dark:text-white">Profile</p>
                                    </div>
                                </Link>
                            )}

                            {/* Cart - Self-contained button + sidebar */}
                            <div className="px-4 py-3">
                                <ShoppingCartButton />
                            </div>

                            {/* Orders */}
                            <Link
                                href="/orders"
                                onClick={closeMenus}
                                className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <FiPackage className="text-primary text-xl" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">My</p>
                                    <p className="font-medium text-sm text-dark dark:text-white">Orders</p>
                                </div>
                            </Link>

                            {/* Support */}
                            <a
                                href="tel:+256788401004"
                                className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <FiPhone className="text-primary text-xl" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">24/7 Support</p>
                                    <p className="font-medium text-sm text-dark dark:text-white">(+256) 7884-01004</p>
                                </div>
                            </a>
                        </div>

                        {/* Theme Toggle */}
                        <div className="flex items-center justify-between px-4 py-4">
                            <span className="font-medium text-sm text-dark dark:text-white">Theme</span>
                            <ThemeToggler />
                        </div>
                    </div>
                </div>
            </>
        );
    }
);

MobileMenu.displayName = "MobileMenu";
export default MobileMenu;