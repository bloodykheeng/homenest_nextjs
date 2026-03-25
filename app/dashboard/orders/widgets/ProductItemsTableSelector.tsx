import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';
import { InputNumber } from 'primereact/inputnumber';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';

import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import { getAllProductCategories } from "@/services/products/product-categories-service";
import { getAllProductSubcategories } from "@/services/products/product-subcategories-service";
import { getAllProducts } from "@/services/products/products-service";

// ✅ Single source of truth — import from shared types file
import type { OrderItem, OrderCategory, OrderSubcategory } from "./order-types";

// ─── Internal types (only used inside this file) ──────────────────────────────

type ProductWithDetails = {
    id: number;
    name: string;
    sku?: string | null;
    photo_url?: string | null;
    price?: number | null;
    category: OrderCategory;
    subcategory: OrderSubcategory;
    product_category_id?: number;
    product_subcategory_id: number;
};

// Merged type carrying live selection state so DataTable re-renders automatically
type ProductWithSelection = ProductWithDetails & {
    hasQuantity: boolean;
    currentQuantity: number;
    currentUnitPrice: number;
    currentTotalPrice: number | null;
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProductItemsTableSelectorProps {
    visible: boolean;
    onHide: () => void;
    selectedItems: OrderItem[];
    onItemsUpdate: (items: OrderItem[]) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const ProductItemsTableSelector: React.FC<ProductItemsTableSelectorProps> = ({
    visible,
    onHide,
    selectedItems,
    onItemsUpdate,
}) => {
    const primeReactToast = usePrimeReactToast();

    const [items, setItems] = useState<OrderItem[]>([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Filters
    const [selectedCategory, setSelectedCategory] = useState<OrderCategory | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<OrderSubcategory | null>(null);
    const [globalSearchTerm, setGlobalSearchTerm] = useState('');
    const [productSubCategoryId, setProductSubCategoryId] = useState<number | null>(null);

    const [categorySuggestions, setCategorySuggestions] = useState<OrderCategory[]>([]);
    const [subcategorySuggestions, setSubcategorySuggestions] = useState<OrderSubcategory[]>([]);

    // Initialise items when dialog opens
    useEffect(() => {
        if (visible) {
            setItems(selectedItems);
        }
    }, [visible, selectedItems]);

    // Sync subcategory filter when subcategory selection changes
    useEffect(() => {
        setProductSubCategoryId(selectedSubcategory?.id || null);
    }, [selectedSubcategory]);

    // ─── Queries ──────────────────────────────────────────────────────────────

    const categoriesQuery = useQuery({
        queryKey: ["product-categories"],
        queryFn: getAllProductCategories,
        enabled: visible,
    });

    const subcategoriesQuery = useQuery({
        queryKey: ["product-subcategories", selectedCategory?.id],
        queryFn: () => getAllProductSubcategories({ product_category_id: selectedCategory?.id }),
        enabled: !!selectedCategory?.id && visible,
    });

    const getAllProductsQuery = useQuery({
        queryKey: [
            "products",
            currentPage,
            rowsPerPage,
            globalSearchTerm,
            "paginate",
            productSubCategoryId,
        ],
        queryFn: () =>
            getAllProducts({
                page: currentPage,
                rowsPerPage,
                search: globalSearchTerm,
                paginate: true,
                product_subcategory_id: productSubCategoryId,
            }),
        enabled: visible,
    });

    // ─── Merged table data ────────────────────────────────────────────────────

    const tableDataWithSelection = useMemo((): ProductWithSelection[] => {
        const rawData: ProductWithDetails[] =
            getAllProductsQuery?.data?.data?.data?.data || [];

        return rawData.map((product) => {
            const selectedItem = items.find((i) => i.product_id === product.id);
            const currentQuantity = selectedItem?.quantity || 0;
            const currentUnitPrice: number =
                selectedItem?.unit_price ?? (product.price ?? 0);

            let currentTotalPrice: number | null = null;
            if (currentQuantity > 0 && currentUnitPrice > 0) {
                currentTotalPrice = currentQuantity * currentUnitPrice;
            }

            return {
                ...product,
                hasQuantity: currentQuantity > 0,
                currentQuantity,
                currentUnitPrice,
                currentTotalPrice,
            };
        });
    }, [getAllProductsQuery?.data, items]);

    const validItemsCount = useMemo(
        () => items.filter((i) => i.quantity >= 1 && i.unit_price > 0).length,
        [items]
    );

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleQuantityChange = (
        productId: number,
        quantity: number,
        productData: ProductWithSelection
    ) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex((o) => o.product_id === productId);

            if (quantity > 0) {
                if (existingIndex >= 0) {
                    const existing = prev[existingIndex];
                    const updated = [...prev];
                    updated[existingIndex] = {
                        ...existing,
                        quantity,
                        total_price:
                            existing.unit_price > 0 ? existing.unit_price * quantity : 0,
                    };
                    return updated;
                } else {
                    const defaultPrice: number = productData.price ?? 0;
                    const newItem: OrderItem = {
                        product_category_id:
                            productData.product_category_id ?? productData.category?.id,
                        product_subcategory_id: productData.product_subcategory_id,
                        product_id: productData.id,
                        category: productData.category,
                        subcategory: productData.subcategory,
                        product: {
                            id: productData.id,
                            name: productData.name,
                            sku: productData.sku ?? null,
                            photo_url: productData.photo_url ?? null,
                            price: productData.price ?? null,
                        },
                        product_name: productData.name,
                        product_sku: productData.sku ?? null,
                        quantity,
                        unit_price: defaultPrice,
                        total_price: defaultPrice > 0 ? defaultPrice * quantity : 0,
                    };
                    return [...prev, newItem];
                }
            } else {
                if (existingIndex >= 0) {
                    const updated = [...prev];
                    updated.splice(existingIndex, 1);
                    return updated;
                }
                return prev;
            }
        });
    };

    const handleUnitPriceChange = (
        productId: number,
        unit_price: number,
        productData: ProductWithSelection
    ) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex((o) => o.product_id === productId);

            if (existingIndex >= 0) {
                const existing = prev[existingIndex];
                const updated = [...prev];
                updated[existingIndex] = {
                    ...existing,
                    unit_price,
                    total_price:
                        existing.quantity > 0 && unit_price > 0
                            ? existing.quantity * unit_price
                            : 0,
                };
                return updated;
            } else if (unit_price > 0) {
                const newItem: OrderItem = {
                    product_category_id:
                        productData.product_category_id ?? productData.category?.id,
                    product_subcategory_id: productData.product_subcategory_id,
                    product_id: productData.id,
                    category: productData.category,
                    subcategory: productData.subcategory,
                    product: {
                        id: productData.id,
                        name: productData.name,
                        sku: productData.sku ?? null,
                        photo_url: productData.photo_url ?? null,
                        price: productData.price ?? null,
                    },
                    product_name: productData.name,
                    product_sku: productData.sku ?? null,
                    quantity: 0,
                    unit_price,
                    total_price: 0,
                };
                return [...prev, newItem];
            }
            return prev;
        });
    };

    const applyItems = () => {
        const validItems = items.filter(
            (item) => item.quantity >= 1 && item.unit_price > 0
        );

        if (validItems.length === 0) {
            primeReactToast.warn(
                "Enter both quantity (≥1) and unit price (>0) for at least one product before saving."
            );
            return;
        }

        onItemsUpdate(validItems);
        primeReactToast.success(`${validItems.length} item(s) saved successfully`);
        onHide();
    };

    const resetFilters = () => {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setGlobalSearchTerm('');
        setProductSubCategoryId(null);
        setCurrentPage(1);
        setFirst(0);
    };

    const onPageChange = (event: DataTablePageEvent) => {
        setFirst(event.first);
        setCurrentPage((event?.page ?? 0) + 1);
        setRowsPerPage(event?.rows);
    };

    // ─── AutoComplete handlers ────────────────────────────────────────────────

    const fetchCategorySuggestions = (event: { query: string }) => {
        const query = event.query.toLowerCase();
        const filtered =
            (categoriesQuery?.data?.data?.data as OrderCategory[] | undefined)?.filter(
                (item) => item?.name?.toLowerCase().includes(query)
            ) || [];
        setCategorySuggestions(filtered);
    };

    const fetchSubcategorySuggestions = (event: { query: string }) => {
        const query = event.query.toLowerCase();
        const filtered =
            (subcategoriesQuery?.data?.data?.data as OrderSubcategory[] | undefined)?.filter(
                (item) => item?.name?.toLowerCase().includes(query)
            ) || [];
        setSubcategorySuggestions(filtered);
    };

    // ─── Column templates ─────────────────────────────────────────────────────

    const quantityTemplate = (rowData: ProductWithSelection) => (
        <InputNumber
            value={rowData.currentQuantity}
            onChange={(e) => handleQuantityChange(rowData.id, e.value || 0, rowData)}
            min={0}
            showButtons
            buttonLayout="horizontal"
            decrementButtonClassName="p-button-danger p-button-sm"
            incrementButtonClassName="p-button-success p-button-sm"
            decrementButtonIcon="pi pi-minus"
            incrementButtonIcon="pi pi-plus"
            className="w-full"
        />
    );

    const unitPriceTemplate = (rowData: ProductWithSelection) => (
        <div className="flex flex-col">
            <InputNumber
                value={rowData.currentUnitPrice}
                onChange={(e) =>
                    handleUnitPriceChange(rowData.id, e.value || 0, rowData)
                }
                min={0}
                mode="currency"
                currency="UGX"
                locale="en-UG"
                className="w-full"
            />
            {!!rowData.price && (
                <small className="text-gray-500 mt-1">
                    Listed:{" "}
                    {new Intl.NumberFormat("en-UG", {
                        style: "currency",
                        currency: "UGX",
                    }).format(rowData.price)}
                </small>
            )}
        </div>
    );

    const totalPriceTemplate = (rowData: ProductWithSelection) => {
        if (!rowData.currentTotalPrice || rowData.currentTotalPrice <= 0) {
            return <span className="text-gray-500 italic">N/A</span>;
        }
        return new Intl.NumberFormat("en-UG", {
            style: "currency",
            currency: "UGX",
        }).format(rowData.currentTotalPrice);
    };

    // ─── Footer ───────────────────────────────────────────────────────────────

    const dialogFooter = (
        <div className="flex justify-between">
            <Button
                label="Reset Filters"
                icon="pi pi-refresh"
                className="p-button-secondary"
                onClick={resetFilters}
            />
            <div>
                <Button
                    label={`Save Items (${validItemsCount})`}
                    icon="pi pi-check"
                    className="p-button-success mr-2"
                    onClick={applyItems}
                    tooltip={
                        validItemsCount === 0
                            ? "Enter both quantity (≥1) and unit price (>0) to save items"
                            : undefined
                    }
                />
                <Button
                    label="Close"
                    icon="pi pi-times"
                    className="p-button-text"
                    onClick={onHide}
                />
            </div>
        </div>
    );

    const totalRecords = getAllProductsQuery?.data?.data?.data?.total || 0;

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <Dialog
            header="Select Products for Order"
            visible={visible}
            style={{ width: "95vw", height: "90vh" }}
            footer={dialogFooter}
            onHide={onHide}
            maximizable
        >
            <div className="flex flex-col gap-4 h-full">

                {/* Filters */}
                <Card className="flex-shrink-0">
                    <h5 className="mb-3">Filters</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div className="field">
                            <label className="font-medium block mb-2">Category</label>
                            <AutoComplete
                                value={selectedCategory}
                                suggestions={categorySuggestions}
                                completeMethod={fetchCategorySuggestions}
                                field="name"
                                onChange={(e) => {
                                    setSelectedCategory(e.value);
                                    setSelectedSubcategory(null);
                                    setSubcategorySuggestions([]);
                                    setCurrentPage(1);
                                    setFirst(0);
                                }}
                                forceSelection
                                dropdown
                                placeholder="Search & Select Category"
                                className="w-full"
                                disabled={categoriesQuery?.isPending}
                            />
                        </div>

                        <div className="field">
                            <label className="font-medium block mb-2">Subcategory</label>
                            <AutoComplete
                                value={selectedSubcategory}
                                suggestions={subcategorySuggestions}
                                completeMethod={fetchSubcategorySuggestions}
                                field="name"
                                onChange={(e) => {
                                    setSelectedSubcategory(e.value);
                                    setCurrentPage(1);
                                    setFirst(0);
                                }}
                                forceSelection
                                dropdown
                                placeholder="Search & Select Subcategory"
                                className="w-full"
                                disabled={subcategoriesQuery?.isPending || !selectedCategory}
                            />
                        </div>

                        <div className="field">
                            <label className="font-medium block mb-2">Search Products</label>
                            <InputText
                                value={globalSearchTerm}
                                onChange={(e) => {
                                    setGlobalSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                    setFirst(0);
                                }}
                                placeholder="Search products..."
                                className="w-full"
                            />
                        </div>
                    </div>
                </Card>

                {/* Products Table */}
                <div className="flex-1 flex flex-col">
                    {getAllProductsQuery?.isPending ? (
                        <div className="text-center p-8">
                            <ProgressSpinner />
                            <p className="mt-2">Loading products...</p>
                        </div>
                    ) : (
                        <DataTable
                            value={tableDataWithSelection}
                            lazy
                            paginator
                            rows={rowsPerPage}
                            totalRecords={totalRecords}
                            first={first}
                            onPage={onPageChange}
                            rowsPerPageOptions={[5, 10, 20, 50]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
                            responsiveLayout="scroll"
                            className="p-datatable-sm flex-1"
                            emptyMessage={
                                getAllProductsQuery?.isPending ? "Loading..." : "No products found"
                            }
                            dataKey="id"
                        >
                            <Column field="category.name" header="Category" />
                            <Column field="subcategory.name" header="Subcategory" />
                            <Column field="name" header="Product" />
                            <Column field="sku" header="SKU" />
                            <Column
                                header="Unit Price"
                                body={unitPriceTemplate}
                                style={{ width: "220px" }}
                            />
                            <Column
                                header="Quantity"
                                body={quantityTemplate}
                                style={{ width: "150px" }}
                            />
                            <Column header="Total Price" body={totalPriceTemplate} />
                        </DataTable>
                    )}
                </div>
            </div>
        </Dialog>
    );
};

export default ProductItemsTableSelector;