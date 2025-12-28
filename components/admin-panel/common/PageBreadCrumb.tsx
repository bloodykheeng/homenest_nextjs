"use client";

import React, { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

interface BreadcrumbProps {
  pageTitle?: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle }) => {
  const pathname = usePathname();
  const router = useRouter();
  const visitedPaths = useRef<string[]>([]);

  // Split the path into segments and filter out empty segments
  const pathSegments = pathname?.split("/").filter((segment) => segment) || [];

  // Update visited paths on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Only add the path if it's not already the last item
      if (
        visitedPaths.current.length === 0 ||
        visitedPaths.current[visitedPaths.current.length - 1] !== pathname
      ) {
        visitedPaths.current.push(pathname);
      }
    }
  }, [pathname]);

  // Create breadcrumb items with proper links
  const breadcrumbItems = pathSegments.map((segment, index) => {
    // Create the URL for this breadcrumb by joining all segments up to this point
    const url = "/" + pathSegments.slice(0, index + 1).join("/");

    // Format the segment for display (capitalize first letter)
    const displayName =
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

    return {
      name: displayName,
      url: url,
      isLast: index === pathSegments.length - 1,
    };
  });

  // Use provided pageTitle or default to the last segment's name
  const title =
    pageTitle ||
    (breadcrumbItems.length > 0
      ? breadcrumbItems[breadcrumbItems.length - 1].name
      : "Home");

  // Count steps and navigate back
  const handleBreadcrumbClick = (e: React.MouseEvent, targetUrl: string) => {
    e.preventDefault();

    // Find the last time this URL was in our history
    const targetIndex = [...visitedPaths.current]
      .reverse()
      .findIndex((path) => path === targetUrl);

    if (targetIndex >= 0) {
      // +1 because we're going from the current page back to the target
      const stepsBack = targetIndex + 1;
      window.history.go(-stepsBack);
    } else {
      // If we can't find it in history, navigate directly
      router.push(targetUrl);
    }
  };

  // Handle home click - either go back in history or navigate to root
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Find the last time home was visited
    const homeIndex = [...visitedPaths.current]
      .reverse()
      .findIndex((path) => path === "/");

    if (homeIndex >= 0) {
      // +1 because we're going from the current page back to home
      const stepsBack = homeIndex + 1;
      window.history.go(-stepsBack);
    } else {
      // If home is not in history, navigate directly
      router.push("/");
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
        {title}
      </h2>
      <nav>
        <ol className="flex items-center gap-1.5">
          <li>
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              onClick={handleHomeClick}
            >
              Home
              {breadcrumbItems.length > 0 && (
                <svg
                  className="stroke-current"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    stroke=""
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </a>
          </li>

          {breadcrumbItems.map((item, index) => (
            <li key={index}>
              {item.isLast ? (
                <span className="text-sm text-gray-800 dark:text-white/90">
                  {item.name}
                </span>
              ) : (
                <a
                  href={item.url}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                  onClick={(e) => handleBreadcrumbClick(e, item.url)}
                >
                  {item.name}
                  <svg
                    className="stroke-current"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                      stroke=""
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
