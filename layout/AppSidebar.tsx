"use client";
import React, { useEffect, useState, useCallback, JSX, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useSidebar } from "@/providers/SidebarContextProvider";
import { ChevronDownIcon, HorizontaLDots } from "@/icons/index";
import { getMenuItems, MenuCategory, SidebarItem } from "./MenuItems";
import useAuthContext from "@/providers/AuthProvider";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { getUserQuery } = useAuthContext();
  const loggedInUserData = getUserQuery?.data?.data;

  const menuItems: MenuCategory[] = useMemo(
    () => getMenuItems(loggedInUserData),
    [loggedInUserData]
  );

  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  // Enhanced isActive function to handle exact matching
  const isActive = useCallback(
    (path?: string) => {
      if (!path) return false;

      // Remove query parameters for comparison
      const currentPath = pathname;

      // Exact match
      if (path === currentPath) return true;

      // For dashboard, only match exact path to avoid always being active
      if (path === "/dashboard") {
        return currentPath === "/dashboard";
      }

      // For other paths, check if current path starts with the menu path
      if (currentPath.startsWith(path)) {
        const nextChar = currentPath.charAt(path.length);
        return nextChar === "/" || nextChar === "" || nextChar === "?";
      }

      return false;
    },
    [pathname]
  );

  // Check if any child item is active (recursive)
  const hasActiveChild = useCallback(
    (items: SidebarItem[]): boolean => {
      const checkItems = (itemsList: SidebarItem[]): boolean => {
        return itemsList.some((item) => {
          if (item.path && isActive(item.path)) return true;
          if (item.subItems) return checkItems(item.subItems);
          return false;
        });
      };
      return checkItems(items);
    },
    [isActive]
  );

  // Check if item or any of its descendants is active
  const isItemOrChildActive = useCallback(
    (item: SidebarItem): boolean => {
      if (item.path && isActive(item.path)) return true;
      if (item.subItems) return hasActiveChild(item.subItems);
      return false;
    },
    [isActive, hasActiveChild]
  );

  // Auto-open parents of the active route and keep them open
  useEffect(() => {
    const findAndExpandActiveChain = () => {
      const expanded: Record<string, boolean> = { ...openSubmenus };

      const markActiveChain = (
        items: SidebarItem[],
        parentKey: string
      ): boolean => {
        let hasActiveInBranch = false;

        items.forEach((item) => {
          const key = `${parentKey}-${item.name}`;
          const isDirectlyActive = item.path ? isActive(item.path) : false;

          let hasActiveChild = false;
          if (item.subItems && item.subItems.length > 0) {
            hasActiveChild = markActiveChain(item.subItems, key);
          }

          // If this item or any of its children is active, expand it
          if (isDirectlyActive || hasActiveChild) {
            expanded[key] = true;
            hasActiveInBranch = true;
          }
        });

        return hasActiveInBranch;
      };

      menuItems.forEach((category) => {
        markActiveChain(category.items, category.category);
      });

      setOpenSubmenus(expanded);
    };

    findAndExpandActiveChain();
  }, [pathname, menuItems, isActive]);

  // Handle submenu toggle - don't close when navigating, only when clicking
  const toggleSubmenu = useCallback((key: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  // Recursive render function
  const renderSidebarItem = (
    item: SidebarItem,
    parentKey: string,
    depth: number = 0
  ): JSX.Element => {
    const key = `${parentKey}-${item.name}`;
    const isOpen = openSubmenus[key];
    const directlyActive = item.path ? isActive(item.path) : false;
    const childActive = item.subItems ? hasActiveChild(item.subItems) : false;
    const shouldHighlight = directlyActive || childActive;
    const hasChildren = !!item.subItems?.length;

    // Calculate proper indentation based on depth
    // const getIndentStyle = (depth: number) => {
    //   const baseIndent = depth * 16; // 16px per level
    //   return { paddingLeft: `${baseIndent}px` };
    // };

    const getIndentStyle = (depth: number) => {
      const baseIndent = 16; // always 16px base padding
      const extraIndent = depth * 16; // add 16px more per nested level
      return { paddingLeft: `${baseIndent + extraIndent}px` };
    };

    return (
      <li key={key}>
        {hasChildren ? (
          <div>
            <button
              onClick={() => toggleSubmenu(key)}
              style={
                isExpanded || isHovered || isMobileOpen
                  ? getIndentStyle(depth)
                  : {}
              }
              className={`menu-item group w-full flex items-center text-left ${shouldHighlight ? "menu-item-active" : "menu-item-inactive"
                } ${depth > 0 && !(isExpanded || isHovered || isMobileOpen)
                  ? "justify-center"
                  : ""
                }`}
            >
              {/* Left icon */}
              <span className="flex-shrink-0 mr-2">{item.icon}</span>

              {/* Label + chevron (only when expanded or hovered) */}
              {(isExpanded || isHovered || isMobileOpen) && (
                <>
                  <span className="flex-grow">{item.name}</span>
                  <ChevronDownIcon
                    className={`ml-auto h-4 w-4 min-w-[16px] transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""
                      }`}
                  />
                </>
              )}

              {/* Chevron in collapsed mode */}
              {!isExpanded && !isHovered && !isMobileOpen && (
                <ChevronDownIcon
                  className={`ml-auto h-4 w-4 min-w-[16px] transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""
                    }`}
                />
              )}
            </button>

            {isOpen && (
              <ul className="mt-1 space-y-1">
                {item.subItems!.map((subItem) =>
                  renderSidebarItem(subItem, key, depth + 1)
                )}
              </ul>
            )}
          </div>
        ) : (
          <Link
            href={item.path || "#"}
            style={
              isExpanded || isHovered || isMobileOpen
                ? getIndentStyle(depth)
                : {}
            }
            className={`menu-item group ${directlyActive ? "menu-item-active" : "menu-item-inactive"
              } ${depth > 0 && !(isExpanded || isHovered || isMobileOpen)
                ? "justify-center"
                : ""
              }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <>
                <span className="flex-grow">{item.name}</span>
                {item.pro && (
                  <span className="ml-auto text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded flex-shrink-0">
                    PRO
                  </span>
                )}
              </>
            )}
          </Link>
        )}
      </li>
    );
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-gray-200 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          <Image
            src="/logos/homenest_light.png"
            alt="logo"
            priority={true}
            width={isExpanded || isHovered || isMobileOpen ? 140 : 80}
            height={30}
            style={{ height: "40px", width: "auto" }}
            className="dark:hidden object-contain"
          />

          <Image
            src="/logos/homenest_dark.png"
            alt="logo"
            priority={true}
            width={isExpanded || isHovered || isMobileOpen ? 140 : 80}
            height={30}
            style={{ height: "40px", width: "auto" }}
            className="hidden dark:block object-contain"
          />

          {/* Slogan */}
          {(isExpanded || isHovered || isMobileOpen) && (
            <span className="text-sm font-medium whitespace-nowrap">
              <span className="text-green-600 dark:text-green-400">
                Comfort
              </span>{" "}
              <span className="text-orange-500 dark:text-orange-400">
                starts here
              </span>
            </span>
          )}
        </Link>
      </div>

      {/* Menu */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {menuItems.map((category) => (
              <div key={category.category}>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered && !isMobileOpen
                    ? "lg:justify-center"
                    : "justify-start"
                    }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    category.menu
                  ) : (
                    <HorizontaLDots />
                  )}
                </h2>
                <ul className="flex flex-col gap-1">
                  {category.items.map((item) =>
                    renderSidebarItem(item, category.category)
                  )}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
