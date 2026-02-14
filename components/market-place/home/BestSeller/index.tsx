"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FiRefreshCw, FiTrendingUp } from "react-icons/fi";
import { getAllProducts } from "@/services/products/products-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";
import SingleItem from "./SingleItem";

const BestSeller = () => {
    const getBestSellersQuery = useQuery({
        queryKey: ["products", "best-sellers"],
        queryFn: (params) => getAllProducts({ ...params, bestSeller: true, per_page: 6 }),
    });

    useHandleQueryError(getBestSellersQuery);

    const bestSellerProducts = getBestSellersQuery?.data?.data?.data || [];

    // Skeleton Loader
    if (getBestSellersQuery.isPending) {
        return (
            <section className="overflow-hidden">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="mb-10 flex items-center justify-between">
                        <div className="space-y-2 animate-pulse">
                            <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="rounded-lg bg-gray-300 dark:bg-gray-700 min-h-[360px] sm:min-h-[403px]"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Error State with Retry
    if (getBestSellersQuery.isError) {
        return (
            <section className="overflow-hidden">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
                        <p className="text-red-500 dark:text-red-400 mb-4 text-center text-sm sm:text-base">
                            Failed to load best sellers
                        </p>
                        <button
                            onClick={() => getBestSellersQuery.refetch()}
                            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white text-sm rounded-md hover:bg-opacity-90 transition-all"
                        >
                            <FiRefreshCw className={getBestSellersQuery.isRefetching ? "animate-spin" : ""} />
                            {getBestSellersQuery.isRefetching ? "Retrying..." : "Retry"}
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Empty State
    if (bestSellerProducts.length === 0) {
        return (
            <section className="overflow-hidden">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="flex items-center justify-center py-16 sm:py-24 px-4">
                        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                            No best sellers at the moment
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="overflow-hidden">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                {/* Section Title */}
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <span className="flex items-center gap-2.5 font-medium text-dark dark:text-white mb-1.5">
                            <FiTrendingUp className="text-xl text-primary" />
                            This Month
                        </span>
                        <h2 className="font-semibold text-xl xl:text-2xl text-dark dark:text-white">
                            Best Sellers
                        </h2>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
                    {bestSellerProducts.map((item: any) => (
                        <SingleItem item={item} key={item.id} />
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12.5">
                    <Link
                        href="/shop"
                        className="inline-flex font-medium text-sm py-3 px-7 sm:px-12.5 rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white hover:bg-dark dark:hover:bg-primary hover:text-white hover:border-transparent transition-all duration-200"
                    >
                        View All
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BestSeller;