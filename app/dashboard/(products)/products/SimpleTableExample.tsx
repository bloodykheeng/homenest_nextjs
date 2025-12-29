'use client'
import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

interface Item {
    id: number;
    name: string;
    featured: boolean;
}

const SimpleTableExample = () => {
    const [items, setItems] = useState<Item[]>([
        { id: 1, name: "Item 1", featured: false },
        { id: 2, name: "Item 2", featured: false },
        { id: 3, name: "Item 3", featured: false },
    ]);

    const toggleFeatured = (index: number) => {
        console.log("items:", items);

        const updatedItems = items.map((item, i) => ({
            ...item,
            featured: i === index ? !item.featured : false,
        }));

        setItems(updatedItems);
    };

    return (
        <div>
            <DataTable value={items}>
                <Column field="name" header="Name" />
                <Column
                    field="featured"
                    header="Featured"
                    body={(rowData) => rowData.featured ? "⭐" : ""}
                />
                <Column
                    header="Action"
                    body={(rowData, { rowIndex }) => (
                        <Button
                            label="Toggle"
                            onClick={(e) => {
                                e.preventDefault();
                                toggleFeatured(rowIndex);
                            }}
                        />
                    )}
                />
            </DataTable>
        </div>
    );
};

export default SimpleTableExample;