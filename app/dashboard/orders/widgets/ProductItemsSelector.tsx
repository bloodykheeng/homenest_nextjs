"use client";

import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useQuery } from "@tanstack/react-query";
import { getAllProductCategories } from "@/services/products/product-categories-service";
import { getAllProductSubcategories } from "@/services/products/product-subcategories-service";
import { getAllProducts } from "@/services/products/products-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";

export type OrderItem = {
    product_id: number;
    product_name: string;
    product_sku?: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
};

interface ProductItemsSelectorProps {
    value: OrderItem[];
    onChange: (items: OrderItem[]) => void;
}

const ProductItemsSelector: React.FC<ProductItemsSelectorProps> = ({ value, onChange }) => {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);

    // Fetch categories
    const categoriesQuery = useQuery({
        queryKey: ["product-categories"],
        queryFn: () => getAllProductCategories({}),
    });

    // Fetch subcategories filtered by category
    const subcategoriesQuery = useQuery({
        queryKey: ["product-subcategories", selectedCategoryId],
        queryFn: () => getAllProductSubcategories({ product_category_id: selectedCategoryId }),
        enabled: !!selectedCategoryId,
    });

    // Fetch products filtered by subcategory (or category)
    const productsQuery = useQuery({
        queryKey: ["products-selector", selectedCategoryId, selectedSubcategoryId],
        queryFn: () =>
            getAllProducts({
                product_category_id: selectedCategoryId || undefined,
                product_subcategory_id: selectedSubcategoryId || undefined,
                paginate: false,
            }),
        enabled: !!(selectedCategoryId || selectedSubcategoryId),
    });

    useHandleQueryError(categoriesQuery);
    useHandleQueryError(subcategoriesQuery);
    useHandleQueryError(productsQuery);

    const categories = categoriesQuery?.data?.data?.data || categoriesQuery?.data?.data || [];
    const subcategories = subcategoriesQuery?.data?.data?.data || subcategoriesQuery?.data?.data || [];
    const products = productsQuery?.data?.data?.data || productsQuery?.data?.data || [];

    const addProduct = (product: any) => {
        const alreadyAdded = value.some((item) => item.product_id === product.id);
        if (alreadyAdded) return;

        const newItem: OrderItem = {
            product_id: product.id,
            product_name: product.name,
            product_sku: product.sku || null,
            quantity: 1,
            unit_price: product.price ?? product.selling_price ?? 0,
            total_price: product.price ?? product.selling_price ?? 0,
        };
        onChange([...value, newItem]);
    };

    const removeItem = (productId: number) => {
        onChange(value.filter((item) => item.product_id !== productId));
    };

    const updateItemField = (productId: number, field: "quantity" | "unit_price", newVal: number) => {
        onChange(
            value.map((item) => {
                if (item.product_id !== productId) return item;
                const qty = field === "quantity" ? newVal : item.quantity;
                const price = field === "unit_price" ? newVal : item.unit_price;
                return { ...item, [field]: newVal, total_price: qty * price };
            })
        );
    };

    const isAdded = (productId: number) => value.some((item) => item.product_id === productId);

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="block font-medium mb-1 text-sm">Category Filter</label>
                    <Dropdown
                        value={selectedCategoryId}
                        options={(Array.isArray(categories) ? categories : []).map((c: any) => ({ label: c.name, value: c.id }))}
                        onChange={(e) => {
                            setSelectedCategoryId(e.value);
                            setSelectedSubcategoryId(null);
                        }}
                        placeholder="All Categories"
                        showClear
                        className="w-full"
                        loading={categoriesQuery.isLoading}
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1 text-sm">Subcategory Filter</label>
                    <Dropdown
                        value={selectedSubcategoryId}
                        options={(Array.isArray(subcategories) ? subcategories : []).map((s: any) => ({ label: s.name, value: s.id }))}
                        onChange={(e) => setSelectedSubcategoryId(e.value)}
                        placeholder="All Subcategories"
                        showClear
                        disabled={!selectedCategoryId}
                        className="w-full"
                        loading={subcategoriesQuery.isLoading}
                    />
                </div>
            </div>

            {/* Products Table */}
            {(selectedCategoryId || selectedSubcategoryId) && (
                <div>
                    <h4 className="font-semibold mb-2 text-sm">Available Products</h4>
                    <DataTable
                        value={Array.isArray(products) ? products : []}
                        loading={productsQuery.isLoading}
                        emptyMessage="No products found."
                        size="small"
                        scrollable
                        scrollHeight="250px"
                    >
                        <Column field="name" header="Name" />
                        <Column field="sku" header="SKU" />
                        <Column
                            header="Price"
                            body={(row) => row.price ?? row.selling_price ?? "N/A"}
                        />
                        <Column
                            header="Action"
                            body={(row) => (
                                <Button
                                    label={isAdded(row.id) ? "Added" : "Add"}
                                    icon={isAdded(row.id) ? "pi pi-check" : "pi pi-plus"}
                                    size="small"
                                    disabled={isAdded(row.id)}
                                    onClick={() => addProduct(row)}
                                />
                            )}
                        />
                    </DataTable>
                </div>
            )}

            {/* Selected Items Table */}
            {value.length > 0 && (
                <div>
                    <h4 className="font-semibold mb-2 text-sm">Order Items ({value.length})</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    <th className="text-left p-2 border border-gray-200 dark:border-gray-700">Product</th>
                                    <th className="text-left p-2 border border-gray-200 dark:border-gray-700">SKU</th>
                                    <th className="text-left p-2 border border-gray-200 dark:border-gray-700 w-28">Qty</th>
                                    <th className="text-left p-2 border border-gray-200 dark:border-gray-700 w-32">Unit Price</th>
                                    <th className="text-left p-2 border border-gray-200 dark:border-gray-700 w-28">Total</th>
                                    <th className="p-2 border border-gray-200 dark:border-gray-700 w-16"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {value.map((item) => (
                                    <tr key={item.product_id} className="border-b border-gray-200 dark:border-gray-700">
                                        <td className="p-2 border border-gray-200 dark:border-gray-700">{item.product_name}</td>
                                        <td className="p-2 border border-gray-200 dark:border-gray-700">{item.product_sku || "—"}</td>
                                        <td className="p-2 border border-gray-200 dark:border-gray-700">
                                            <InputNumber
                                                value={item.quantity}
                                                onValueChange={(e) => updateItemField(item.product_id, "quantity", e.value ?? 1)}
                                                min={1}
                                                showButtons
                                                inputClassName="w-16 text-sm"
                                                className="w-24"
                                            />
                                        </td>
                                        <td className="p-2 border border-gray-200 dark:border-gray-700">
                                            <InputNumber
                                                value={item.unit_price}
                                                onValueChange={(e) => updateItemField(item.product_id, "unit_price", e.value ?? 0)}
                                                min={0}
                                                minFractionDigits={2}
                                                maxFractionDigits={2}
                                                inputClassName="w-20 text-sm"
                                                className="w-28"
                                            />
                                        </td>
                                        <td className="p-2 border border-gray-200 dark:border-gray-700 font-medium">
                                            {item.total_price.toFixed(2)}
                                        </td>
                                        <td className="p-2 border border-gray-200 dark:border-gray-700 text-center">
                                            <Button
                                                icon="pi pi-trash"
                                                size="small"
                                                severity="danger"
                                                text
                                                onClick={() => removeItem(item.product_id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductItemsSelector;
