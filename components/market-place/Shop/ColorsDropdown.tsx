"use client";

import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

interface ColorsDropdownProps {
    colors: any[];
    activeColor: string | null;
    onSelect: (color: string | null) => void;
}

const ColorsDropdown = ({
    colors,
    activeColor,
    onSelect,
}: ColorsDropdownProps) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`cursor-pointer flex items-center justify-between py-3 px-5 ${isOpen
                    ? "border-b border-gray-100 dark:border-gray-700"
                    : ""
                    }`}
            >
                <p className="text-dark dark:text-white font-medium text-sm">
                    Colors
                </p>

                <FiChevronDown
                    className={`text-dark dark:text-white transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </div>

            <div
                className={`flex-wrap gap-2.5 p-5 ${isOpen ? "flex" : "hidden"
                    }`}
            >
                {colors.map((color: any) => {
                    const colorValue =
                        color?.color_code ||
                        color?.color_name ||
                        color;

                    const colorName =
                        color?.color_name || color;

                    const isActive =
                        activeColor === colorName;

                    return (
                        <button
                            key={colorName}
                            onClick={() =>
                                onSelect(
                                    isActive
                                        ? null
                                        : colorName
                                )
                            }
                            aria-label={`Select ${colorName}`}
                            className="flex items-center justify-center w-7 h-7 rounded-full transition-all"
                            style={
                                isActive
                                    ? {
                                        boxShadow: `0 0 0 2px ${colorValue}`,
                                    }
                                    : undefined
                            }
                        >
                            <span
                                className="block w-5 h-5 rounded-full border border-gray-200 dark:border-gray-600"
                                style={{
                                    backgroundColor:
                                        colorValue,
                                }}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ColorsDropdown;
