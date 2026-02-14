"use client";

import React from "react";
import { Dropdown } from "primereact/dropdown";

interface SortSelectProps {
    value: string;
    onChange: (value: string) => void;
}

const sortOptions = [
    { label: "Latest Products", value: "latest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Best Rating", value: "rating" },
    { label: "Best Selling", value: "best_selling" },
];

const SortSelect = ({ value, onChange }: SortSelectProps) => {
    return (
        <Dropdown
            value={value}
            onChange={(e) => onChange(e.value)}
            options={sortOptions}
            optionLabel="label"
            optionValue="value"
            placeholder="Sort by"
            className="w-[180px] text-sm"
        />
    );
};

export default SortSelect;