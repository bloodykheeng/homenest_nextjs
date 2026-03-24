"use client";

import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/services/products/products-service";
import { getAllProductCategories } from "@/services/products/product-categories-service";
import { getAllProductSubcategories } from "@/services/products/product-subcategories-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";

export type OrderItem = {
    product_id: number;
    product_name: string;
    product_sku?: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
};

interface ProductItemsTableSelectorProps {
    value: OrderItem[];
    onChange: (items: OrderItem[]) => void;
}

type Product = {
    id: number;
    name: string;
    sku?: string;
    price?: number;
    selling_price?: number;
    product_category_id?: number;
    product_subcategory_id?: number;
    [key: string]: any;
};

const ProductItemsTableSelector: React.FC<ProductItemsTableSelectorProps> = ({
    value = [],
    onChange,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [globalSearch, setGlobalSearch] = useState("");
    const [globalSearchTerm, setGlobalSearchTerm] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);

    // Fetch categories
    const categoriesQuery = useQuery({
        queryKey: ["product-categories"],
        queryFn: () => getAllProductCategories({}),
    });

    useHandleQueryError(categoriesQuery);

    const categories = categoriesQuery?.data?.data?.data || categoriesQuery?.data?.data || [];

    // Fetch subcategories filtered by category
    const subcategoriesQuery = useQuery({
        queryKey: ["product-subcategories", selectedCategoryId],
        queryFn: () => getAllProductSubcategories({ product_category_id: selectedCategoryId }),
        enabled: !!selectedCategoryId,
    });

    useHandleQueryError(subcategoriesQuery);

    const subcategories = subcategoriesQuery?.data?.data?.data || subcategoriesQuery?.data?.data || [];

    // Fetch products with pagination
    const productsQuery = useQuery({
        queryKey: [
            "products-selector",
            currentPage,
            rowsPerPage,
            globalSearchTerm,
            selectedCategoryId,
            selectedSubcategoryId,
        ],
        queryFn: () =>
            getAllProducts({
                page: currentPage,
                rowsPerPage,
                search: globalSearchTerm,
                paginate: true,
                product_category_id: selectedCategoryId || undefined,
                product_subcategory_id: selectedSubcategoryId || undefined,
            }),
    });

    useHandleQueryError(productsQuery);

    const products = productsQuery?.data?.data?.data?.data || productsQuery?.data?.data?.data || [];
    const totalRecords = productsQuery?.data?.data?.data?.total || 0;

    const onPageChange = (event: any) => {
        const newPage = (event?.page ?? 0) + 1;
        setFirst(event.first);
        setCurrentPage(newPage);
        setRowsPerPage(event?.rows);
    };

    const handleSearch = (e: React.MouseEvent) => {
        e.preventDefault();
        setGlobalSearchTerm(globalSearch);
        setCurrentPage(1);
        setFirst(0);
    };

    const addProduct = (product: Product) => {
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

    const removeSelectedProduct = (item: OrderItem, e: React.MouseEvent) => {
        e.preventDefault();
        onChange(value.filter((i) => i.product_id !== item.product_id));
    };

    const clearAllSelections = (e: React.MouseEvent) => {
        e.preventDefault();
        onChange([]);
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

    const categoryOptions = [
        { label: "All Categories", value: null },
        ...(Array.isArray(categories)
            ? categories.map((c: any) => ({ label: c.name, value: c.id }))
            : []),
    ];

    const subcategoryOptions = [
        { label: "All Subcategories", value: null },
        ...(Array.isArray(subcategories)
            ? subcategories.map((s: any) => ({ label: s.name, value: s.id }))
            : []),
    ];

    const formatPrice = (price?: number): string => {
        if (price === undefined || price === null) return "N/A";
        return price.toFixed(2);
    };

    if (productsQuery.isLoading && !productsQuery.data) {
        return (
            <div className="flex justify-content-center p-4">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Card className="mb-4">
                <div className="mb-4">
                    <h4 className="text-lg font-semibold mb-2 border-b pb-1">Select Products</h4>
                    {value.length > 0 && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <div className="font-medium">Selected Products ({value.length})</div>
                                <Button
                                    label="Clear All"
                                    icon="pi pi-trash"
                                    outlined
                                    severity="danger"
                                    onClick={clearAllSelections}
                                    tooltip="Clear all selections"
                                    size="small"
                                />
                            </div>
                            <div className="p-3 mb-3 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 rounded">
                                {value.map((item) => (
                                    <div
                                        key={item.product_id}
                                        className="flex justify-between items-center mb-2 last:mb-0"
                                    >
                                        <div>
                                            {item.product_name}
                                            {item.product_sku && ` (${item.product_sku})`}
                                        </div>
                                        <Button
                                            icon="pi pi-times"
                                            className="p-button-rounded p-button-text p-button-danger p-button-sm"
                                            onClick={(e) => removeSelectedProduct(item, e)}
                                            tooltip="Remove selection"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div>
                        <label className="block font-medium mb-1 text-sm">Category Filter</label>
                        <Dropdown
                            value={selectedCategoryId}
                            options={categoryOptions}
                            onChange={(e) => {
                                setSelectedCategoryId(e.value);
                                setSelectedSubcategoryId(null);
                                setCurrentPage(1);
                                setFirst(0);
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
                            options={subcategoryOptions}
                            onChange={(e) => {
                                setSelectedSubcategoryId(e.value);
                                setCurrentPage(1);
                                setFirst(0);
                            }}
                            placeholder="All Subcategories"
                            showClear
                            disabled={!selectedCategoryId}
                            className="w-full"
                            loading={subcategoriesQuery.isLoading}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1 text-sm">Search</label>
                        <div className="p-inputgroup">
                            <InputText
                                value={globalSearch}
                                onChange={(e) => setGlobalSearch(e.target.value)}
                                placeholder="Search products..."
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch(e as unknown as React.MouseEvent);
                                    }
                                }}
                            />
                            <Button icon="pi pi-search" onClick={handleSearch} />
                        </div>
                    </div>
                </div>

                {/* Products Table with Pagination */}
                <DataTable
                    value={products}
                    dataKey="id"
                    paginator
                    rows={rowsPerPage}
                    totalRecords={totalRecords}
                    lazy
                    first={first}
                    onPage={onPageChange}
                    loading={productsQuery.isLoading}
                    emptyMessage="No products found."
                    className="p-datatable-sm"
                    responsiveLayout="scroll"
                >
                    <Column
                        header="Action"
                        body={(rowData: Product) => (
                            <Button
                                label={isAdded(rowData.id) ? "Added" : "Add"}
                                icon={isAdded(rowData.id) ? "pi pi-check" : "pi pi-plus"}
                                size="small"
                                disabled={isAdded(rowData.id)}
                                onClick={() => addProduct(rowData)}
                            />
                        )}
                        style={{ width: "100px" }}
                    />
                    <Column field="name" header="Name" sortable />
                    <Column field="sku" header="SKU" sortable />
                    <Column
                        header="Price"
                        body={(rowData: Product) => formatPrice(rowData.price ?? rowData.selling_price)}
                        sortable
                    />
                    <Column field="stock" header="Stock" />
                </DataTable>
            </Card>

            {/* Selected Items Table (editable) */}
            {value.length > 0 && (
                <Card>
                    <h4 className="text-lg font-semibold mb-4">Order Items ({value.length})</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    <th className="text-left p-2 border border-gray-200 dark:border-gray-700">Product</th>
                                    <th className="text-left p-2 border border-gray-200 dark:border-gray-700">SKU</th>
                                    <th className="text-left p-2 border border-gray-200 dark:border-gray-700 w-28">Qty</th>
                                    <th className="text-left p-2 border border-gray-200 dark:border-gray-700 w-32">Unit Price</th>
                                    <th className="text-left p-2 border border-gray-200 dark:border-gray-700 w-32">Total</th>
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
                                                onClick={(e) => removeSelectedProduct(item, e as any)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ProductItemsTableSelector;
