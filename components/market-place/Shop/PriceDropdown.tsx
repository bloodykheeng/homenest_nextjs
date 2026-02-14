"use client";

import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Slider } from "primereact/slider";

interface PriceDropdownProps {
    minPrice: number;
    maxPrice: number;
    priceRange: [number, number];
    onPriceChange: (range: [number, number]) => void;
}

const PriceDropdown = ({
    minPrice,
    maxPrice,
    priceRange,
    onPriceChange,
}: PriceDropdownProps) => {
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
                    Price
                </p>

                <FiChevronDown
                    className={`text-dark dark:text-white transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </div>

            <div className={`p-5 ${isOpen ? "block" : "hidden"}`}>
                <Slider
                    value={priceRange}
                    onChange={(e) =>
                        onPriceChange(e.value as [number, number])
                    }
                    range
                    min={minPrice}
                    max={maxPrice}
                    step={1000}
                    className="w-full"
                />

                <div className="flex items-center justify-between pt-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex rounded border border-gray-200 dark:border-gray-600">
                        <span className="block border-r border-gray-200 dark:border-gray-600 px-2 py-1.5 text-dark dark:text-gray-300">
                            UGX
                        </span>
                        <span className="block px-2.5 py-1.5 text-dark dark:text-gray-300">
                            {priceRange[0].toLocaleString()}
                        </span>
                    </div>

                    <span className="text-gray-400 text-xs">—</span>

                    <div className="text-xs text-gray-500 dark:text-gray-400 flex rounded border border-gray-200 dark:border-gray-600">
                        <span className="block border-r border-gray-200 dark:border-gray-600 px-2 py-1.5 text-dark dark:text-gray-300">
                            UGX
                        </span>
                        <span className="block px-2.5 py-1.5 text-dark dark:text-gray-300">
                            {priceRange[1].toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceDropdown;
