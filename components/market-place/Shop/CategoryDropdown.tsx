"use client";

import React, { useState } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

interface CategoryItemProps {
    category: any;
    selected: boolean;
    onToggle: (id: number | string) => void;
}

const CategoryItem = ({ category, selected, onToggle }: CategoryItemProps) => {
    return (
        <button
            className={`${selected ? "text-primary" : "text-dark dark:text-gray-300"
                } group flex items-center justify-between w-full text-left hover:text-primary transition-colors`}
            onClick={() => onToggle(category.id)}
        >
            <div className="flex items-center gap-2">
                <div
                    className={`flex items-center justify-center rounded w-4 h-4 border transition-colors ${selected
                        ? "border-primary bg-primary"
                        : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        }`}
                >
                    {selected && <FiCheck className="text-white text-xs" />}
                </div>
                <span className="text-sm">{category.name}</span>
            </div>

            {category.products_count !== undefined && (
                <span
                    className={`${selected ? "text-white bg-primary" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        } inline-flex rounded-full text-xs px-2 py-0.5 transition-colors group-hover:text-white group-hover:bg-primary`}
                >
                    {category.products_count}
                </span>
            )}
        </button>
    );
};

interface CategoryDropdownProps {
    categories: any[];
    selectedCategories: (number | string)[];
    onToggle: (id: number | string) => void;
}

const CategoryDropdown = ({ categories, selectedCategories, onToggle }: CategoryDropdownProps) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`cursor-pointer flex items-center justify-between py-3 px-5 ${isOpen ? "border-b border-gray-100 dark:border-gray-700" : ""
                    }`}
            >
                <p className="text-dark dark:text-white font-medium text-sm">Category</p>
                <FiChevronDown
                    className={`text-dark dark:text-white transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </div>

            <div className={`flex-col gap-3 py-4 px-5 ${isOpen ? "flex" : "hidden"}`}>
                {categories.map((category: any) => (
                    <CategoryItem
                        key={category.id}
                        category={category}
                        selected={selectedCategories.includes(category.id)}
                        onToggle={onToggle}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategoryDropdown;