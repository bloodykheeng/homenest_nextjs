"use client";

import React from "react";
import Link from "next/link";
import { FiChevronRight, FiHome } from "react-icons/fi";

interface BreadcrumbProps {
    title: string;
    pages: string[];
}

const Breadcrumb = ({ title, pages }: BreadcrumbProps) => {
    return (
        <div className="bg-gray-100 dark:bg-gray-800 py-6 sm:py-8">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                <h1 className="font-semibold text-xl sm:text-2xl text-dark dark:text-white mb-2">
                    {title}
                </h1>
                <nav>
                    <ol className="flex items-center gap-1.5 text-sm">
                        <li>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                            >
                                <FiHome className="text-sm" />
                                Home
                            </Link>
                        </li>
                        {pages.map((page, index) => (
                            <React.Fragment key={index}>
                                <li>
                                    <FiChevronRight className="text-gray-400 text-sm" />
                                </li>
                                <li>
                                    {index === pages.length - 1 ? (
                                        <span className="text-primary font-medium">{page}</span>
                                    ) : (
                                        <Link
                                            href={`/${page.toLowerCase().replace(/\s+/g, "-")}`}
                                            className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                                        >
                                            {page}
                                        </Link>
                                    )}
                                </li>
                            </React.Fragment>
                        ))}
                    </ol>
                </nav>
            </div>
        </div>
    );
};

export default Breadcrumb;