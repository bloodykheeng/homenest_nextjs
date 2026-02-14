"use client";

import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

interface SizesDropdownProps {
    sizes: any[];
    activeSize: string | null;
    onSelect: (size: string | null) => void;
}

const SizesDropdown = ({ sizes, activeSize, onSelect }: SizesDropdownProps) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`cursor-pointer flex items-center justify-between py-3 px-5 ${isOpen ? "border-b border-gray-100 dark:border-gray-700" : ""
                    }`}
            >
                <p className="text-dark dark:text-white font-medium text-sm">Size</p>
                <FiChevronDown
                    className={`text-dark dark:text-white transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </div>

            <div className={`flex-wrap gap-2 p-5 ${isOpen ? "flex" : "hidden"}`}>
                {sizes.map((size: any) => {
                    const sizeName = size?.size_name || size;
                    const isActive = activeSize === sizeName;

                    return (
                        <button
                            key={sizeName}
                            onClick={() => onSelect(isActive ? null : sizeName)}
                            className={`text-sm py-1.5 px-3.5 rounded-md border transition-colors ${isActive
                                ? "bg-primary text-white border-primary"
                                : "bg-gray-50 dark:bg-gray-700 text-dark dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-primary hover:text-white hover:border-primary"
                                }`}
                        >
                            {sizeName}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SizesDropdown;