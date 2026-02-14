"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FiRefreshCw } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { getAllProducts } from "@/services/products/products-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";
import ProductItem from "../../Common/ProductItem";

const NewArrivals = () => {
    const getNewArrivalsQuery = useQuery({
        queryKey: ["products", "new-arrivals"],
        queryFn: (params) => getAllProducts({ ...params, sort_by: "created_at", sort_order: "desc", per_page: 8 }),
    });

    useHandleQueryError(getNewArrivalsQuery);

    const newProducts = getNewArrivalsQuery?.data?.data?.data || [];

    // Skeleton Loader
    if (getNewArrivalsQuery.isPending) {
        return (
            <section className="overflow-hidden pt-15">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="mb-7 flex items-center justify-between">
                        <div className="space-y-2 animate-pulse">
                            <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="rounded-lg bg-gray-300 dark:bg-gray-700 min-h-[220px] sm:min-h-[270px] mb-4"></div>
                                <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                                <div className="h-5 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Error State with Retry
    if (getNewArrivalsQuery.isError) {
        return (
            <section className="overflow-hidden pt-15">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
                        <p className="text-red-500 dark:text-red-400 mb-4 text-center text-sm sm:text-base">
                            Failed to load new arrivals
                        </p>
                        <button
                            onClick={() => getNewArrivalsQuery.refetch()}
                            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white text-sm rounded-md hover:bg-opacity-90 transition-all"
                        >
                            <FiRefreshCw className={getNewArrivalsQuery.isRefetching ? "animate-spin" : ""} />
                            {getNewArrivalsQuery.isRefetching ? "Retrying..." : "Retry"}
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Empty State
    if (newProducts.length === 0) {
        return (
            <section className="overflow-hidden pt-15">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="flex items-center justify-center py-16 sm:py-24 px-4">
                        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                            No new arrivals at the moment
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="overflow-hidden pt-15">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                {/* Section Title */}
                <div className="mb-7 flex items-center justify-between">
                    <div>
                        <span className="flex items-center gap-2.5 font-medium text-dark dark:text-white mb-1.5">
                            <HiOutlineShoppingBag className="text-xl text-primary" />
                            This Week&apos;s
                        </span>
                        <h2 className="font-semibold text-xl xl:text-2xl text-dark dark:text-white">
                            New Arrivals
                        </h2>
                    </div>

                    <Link
                        href="/shop"
                        className="inline-flex font-medium text-sm py-2.5 px-7 rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white hover:bg-dark dark:hover:bg-primary hover:text-white hover:border-transparent transition-all duration-200"
                    >
                        View All
                    </Link>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
                    {newProducts.map((item: any) => (
                        <ProductItem item={item} key={item.id} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;