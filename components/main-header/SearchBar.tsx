// components/main-header/SearchBar.tsx
"use client";

import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("all");

    const categories = [
        { label: "All Categories", value: "all" },
        { label: "Desktop", value: "desktop" },
        { label: "Laptop", value: "laptop" },
        { label: "Phone", value: "phone" },
    ];

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ searchQuery, category });
    };

    return (
        <form onSubmit={onSubmit} className="max-w-[475px] w-full">
            <div className="p-inputgroup">
                {/* Category */}
                <Dropdown
                    value={category}
                    options={categories}
                    onChange={(e) => setCategory(e.value)}
                    className="w-[200px]"
                />

                {/* Search */}
                <InputText
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="I am shopping for..."
                    className="w-full"
                />

                {/* Button */}
                <Button
                    type="submit"
                    icon="pi pi-search"
                />
            </div>
        </form>
    );
};

export default SearchBar;
