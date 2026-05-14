"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FiGrid, FiList, FiFilter, FiX, FiRefreshCw, FiShare2 } from "react-icons/fi";
import { getAllProducts } from "@/services/products/products-service";
import { getAllProductCategories } from "@/services/products/product-categories-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import Breadcrumb from "../Common/Breadcrumb";
import ProductItem from "../Common/ProductItem";
import SingleListItem from "./SingleListItem";
import CategoryDropdown from "./CategoryDropdown";
import ColorsDropdown from "./ColorsDropdown";
import SizesDropdown from "./SizesDropdown";
import PriceDropdown from "./PriceDropdown";
import SortSelect from "./SortSelect";

const Shop = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const primeReactToast = usePrimeReactToast();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // ── Derive filter state from URL ─────────────────────────────────────────
    const sortBy = searchParams.get("sort") || "latest";
    const selectedCategory = searchParams.get("category") || "";
    const activeColor = searchParams.get("color") || null;
    const activeSize = searchParams.get("size") || null;
    const minPrice = Number(searchParams.get("min_price") || 0);
    const maxPrice = Number(searchParams.get("max_price") || 5000000);
    const searchQuery = searchParams.get("search") || "";
    const currentPage = Number(searchParams.get("page") || 1);
    const productStyle = (searchParams.get("view") || "grid") as "grid" | "list";

    // ── URL update helper ────────────────────────────────────────────────────
    const updateParams = useCallback(
        (updates: Record<string, string | null>, resetPage = true) => {
            const params = new URLSearchParams(searchParams.toString());
            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === "") params.delete(key);
                else params.set(key, value);
            });
            if (resetPage) params.delete("page");
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [searchParams, pathname, router]
    );

    // ── Build API params ─────────────────────────────────────────────────────
    const buildParams = useCallback(() => {
        const params: any = { paginate: true, rowsPerPage: 12, page: currentPage };
        if (searchQuery) params.search = searchQuery;
        if (selectedCategory) params.product_subcategory_id = selectedCategory;
        if (minPrice > 0) params.min_price = minPrice;
        if (maxPrice < 5000000) params.max_price = maxPrice;
        switch (sortBy) {
            case "price_asc":
                params.sort_by = "price";
                params.sort_order = "asc";
                break;
            case "price_desc":
                params.sort_by = "price";
                params.sort_order = "desc";
                break;
            case "rating":
                params.sort_by = "rating";
                params.sort_order = "desc";
                break;
            case "best_selling":
                params.bestSeller = true;
                break;
            default:
                params.sort_by = "created_at";
                params.sort_order = "desc";
        }
        return params;
    }, [currentPage, searchQuery, selectedCategory, minPrice, maxPrice, sortBy]);

    // ── Queries ──────────────────────────────────────────────────────────────
    const getProductsQuery = useQuery({
        queryKey: ["products", "shop", buildParams()],
        queryFn: () => getAllProducts(buildParams()),
    });
    useHandleQueryError(getProductsQuery);

    const getCategoriesQuery = useQuery({
        queryKey: ["product-categories", "shop-filter"],
        queryFn: () => getAllProductCategories(),
    });
    useHandleQueryError(getCategoriesQuery);

    const products = getProductsQuery?.data?.data?.data?.data || [];
    const pagination = getProductsQuery?.data?.data?.data;
    const categories = getCategoriesQuery?.data?.data?.data || [];

    // ── Sidebar close on outside click ───────────────────────────────────────
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target as Element).closest(".sidebar-content")) {
                setSidebarOpen(false);
            }
        };
        if (sidebarOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [sidebarOpen]);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleCategoryToggle = (id: number | string) => {
        const str = String(id);
        updateParams({ category: selectedCategory === str ? null : str });
    };

    const clearAllFilters = () => {
        router.replace(pathname, { scroll: false });
    };

    const handleShareFilters = () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({ title: "Shop - HomeNest", url });
        } else {
            navigator.clipboard.writeText(url).then(() => {
                primeReactToast.success("Link copied to clipboard!");
            });
        }
    };

    const hasActiveFilters =
        !!selectedCategory ||
        activeColor !== null ||
        activeSize !== null ||
        minPrice > 0 ||
        maxPrice < 5000000;

    // ── Pagination ───────────────────────────────────────────────────────────
    const totalPages = pagination?.last_page || 1;
    const total = pagination?.total || 0;
    const from = pagination?.from || 0;
    const to = pagination?.to || 0;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    const availableColors = [
        { color_name: "red", color_code: "#EF4444" },
        { color_name: "blue", color_code: "#3B82F6" },
        { color_name: "green", color_code: "#22C55E" },
        { color_name: "orange", color_code: "#F97316" },
        { color_name: "purple", color_code: "#A855F7" },
        { color_name: "pink", color_code: "#EC4899" },
        { color_name: "black", color_code: "#1F2937" },
        { color_name: "white", color_code: "#F9FAFB" },
    ];

    const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

    return (
        <>
            <Breadcrumb title="Explore All Products" pages={["Shop"]} />

            <section className="overflow-hidden relative pb-20 pt-5 lg:pt-10 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="flex gap-7.5">
                        {/* ── Sidebar ──────────────────────────────────────────── */}
                        <div
                            className={`sidebar-content fixed xl:relative xl:translate-x-0 z-50 xl:z-auto left-0 top-0 max-w-[310px] xl:max-w-[270px] w-full transition-transform duration-200 ${sidebarOpen
                                ? "translate-x-0 bg-white dark:bg-gray-800 p-5 h-screen overflow-y-auto shadow-xl"
                                : "-translate-x-full xl:translate-x-0"
                                }`}
                        >
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="xl:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-dark dark:text-white hover:bg-red-500 hover:text-white transition-colors"
                            >
                                <FiX className="text-lg" />
                            </button>

                            <div className="flex flex-col gap-5">
                                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg py-3 px-5">
                                    <div className="flex items-center justify-between">
                                        <p className="text-dark dark:text-white font-medium text-sm">Filters</p>
                                        {hasActiveFilters && (
                                            <button onClick={clearAllFilters} className="text-primary text-sm hover:underline">
                                                Clear All
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => updateParams({ search: e.target.value || null })}
                                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm text-dark dark:text-white placeholder:text-gray-400 py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                    />
                                </div>

                                {categories.length > 0 && (
                                    <CategoryDropdown
                                        categories={categories}
                                        selectedCategories={selectedCategory ? [selectedCategory] : []}
                                        onToggle={handleCategoryToggle}
                                    />
                                )}

                                <SizesDropdown
                                    sizes={availableSizes}
                                    activeSize={activeSize}
                                    onSelect={(size) => updateParams({ size })}
                                />

                                <ColorsDropdown
                                    colors={availableColors}
                                    activeColor={activeColor}
                                    onSelect={(color) => updateParams({ color })}
                                />

                                <PriceDropdown
                                    minPrice={0}
                                    maxPrice={5000000}
                                    priceRange={[minPrice, maxPrice]}
                                    onPriceChange={(range) =>
                                        updateParams({
                                            min_price: range[0] > 0 ? String(range[0]) : null,
                                            max_price: range[1] < 5000000 ? String(range[1]) : null,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        {/* Sidebar overlay */}
                        {sidebarOpen && (
                            <div
                                className="fixed inset-0 bg-black/50 z-40 xl:hidden"
                                onClick={() => setSidebarOpen(false)}
                            />
                        )}

                        {/* ── Main Content ─────────────────────────────────────── */}
                        <div className="xl:max-w-[870px] w-full">
                            {/* Top bar */}
                            <div className="rounded-lg bg-white dark:bg-gray-800 shadow-md px-4 py-3 mb-6">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <button
                                            onClick={() => setSidebarOpen(true)}
                                            className="xl:hidden flex items-center gap-1.5 text-sm text-dark dark:text-white border border-gray-200 dark:border-gray-600 rounded-md py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <FiFilter className="text-sm" />
                                            Filters
                                        </button>

                                        <SortSelect value={sortBy} onChange={(v) => updateParams({ sort: v })} />

                                        {!getProductsQuery.isPending && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Showing{" "}
                                                <span className="text-dark dark:text-white font-medium">
                                                    {from}-{to}
                                                </span>{" "}
                                                of {total} Products
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Share current filters */}
                                        <button
                                            onClick={handleShareFilters}
                                            aria-label="Share this view"
                                            title="Share this view"
                                            className="flex items-center justify-center w-9 h-9 rounded-md border text-dark dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-primary hover:border-primary hover:text-white transition-colors"
                                        >
                                            <FiShare2 className="text-base" />
                                        </button>

                                        <button
                                            onClick={() => updateParams({ view: "grid" }, false)}
                                            aria-label="Grid view"
                                            className={`flex items-center justify-center w-9 h-9 rounded-md border transition-colors ${productStyle === "grid"
                                                ? "bg-primary border-primary text-white"
                                                : "text-dark dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-primary hover:border-primary hover:text-white"
                                                }`}
                                        >
                                            <FiGrid className="text-base" />
                                        </button>

                                        <button
                                            onClick={() => updateParams({ view: "list" }, false)}
                                            aria-label="List view"
                                            className={`flex items-center justify-center w-9 h-9 rounded-md border transition-colors ${productStyle === "list"
                                                ? "bg-primary border-primary text-white"
                                                : "text-dark dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-primary hover:border-primary hover:text-white"
                                                }`}
                                        >
                                            <FiList className="text-base" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Loading */}
                            {getProductsQuery.isPending && (
                                <div
                                    className={
                                        productStyle === "grid"
                                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8"
                                            : "flex flex-col gap-5"
                                    }
                                >
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="animate-pulse">
                                            {productStyle === "grid" ? (
                                                <>
                                                    <div className="rounded-lg bg-gray-300 dark:bg-gray-700 min-h-[220px] sm:min-h-[270px] mb-4"></div>
                                                    <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                                                    <div className="h-5 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                                </>
                                            ) : (
                                                <div className="h-[200px] bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Error */}
                            {getProductsQuery.isError && (
                                <div className="flex flex-col items-center justify-center py-16 px-4">
                                    <p className="text-red-500 dark:text-red-400 mb-4 text-center text-sm">
                                        Failed to load products
                                    </p>
                                    <button
                                        onClick={() => getProductsQuery.refetch()}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm rounded-md hover:bg-opacity-90 transition-all"
                                    >
                                        <FiRefreshCw className={getProductsQuery.isRefetching ? "animate-spin" : ""} />
                                        {getProductsQuery.isRefetching ? "Retrying..." : "Retry"}
                                    </button>
                                </div>
                            )}

                            {/* Empty */}
                            {!getProductsQuery.isPending && !getProductsQuery.isError && products.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 px-4">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                                        No products found matching your filters
                                    </p>
                                    {hasActiveFilters && (
                                        <button onClick={clearAllFilters} className="text-primary text-sm hover:underline">
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Products */}
                            {!getProductsQuery.isPending && !getProductsQuery.isError && products.length > 0 && (
                                <>
                                    <div
                                        className={
                                            productStyle === "grid"
                                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8"
                                                : "flex flex-col gap-5"
                                        }
                                    >
                                        {products.map((item: any) =>
                                            productStyle === "grid" ? (
                                                <ProductItem item={item} key={item.id} />
                                            ) : (
                                                <SingleListItem item={item} key={item.id} />
                                            )
                                        )}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center mt-12">
                                            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-2">
                                                <ul className="flex items-center gap-1">
                                                    <li>
                                                        <button
                                                            onClick={() =>
                                                                updateParams({ page: String(Math.max(1, currentPage - 1)) }, false)
                                                            }
                                                            disabled={currentPage === 1}
                                                            className="flex items-center justify-center w-9 h-9 rounded-md text-dark dark:text-white hover:bg-primary hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                        >
                                                            ‹
                                                        </button>
                                                    </li>

                                                    {getPageNumbers().map((page, index) => (
                                                        <li key={index}>
                                                            {page === "..." ? (
                                                                <span className="flex items-center justify-center w-9 h-9 text-gray-400">
                                                                    ...
                                                                </span>
                                                            ) : (
                                                                <button
                                                                    onClick={() =>
                                                                        updateParams({ page: String(page) }, false)
                                                                    }
                                                                    className={`flex items-center justify-center w-9 h-9 rounded-md text-sm transition-colors ${currentPage === page
                                                                        ? "bg-primary text-white"
                                                                        : "text-dark dark:text-white hover:bg-primary hover:text-white"
                                                                        }`}
                                                                >
                                                                    {page}
                                                                </button>
                                                            )}
                                                        </li>
                                                    ))}

                                                    <li>
                                                        <button
                                                            onClick={() =>
                                                                updateParams({ page: String(Math.min(totalPages, currentPage + 1)) }, false)
                                                            }
                                                            disabled={currentPage === totalPages}
                                                            className="flex items-center justify-center w-9 h-9 rounded-md text-dark dark:text-white hover:bg-primary hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                        >
                                                            ›
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Shop;
