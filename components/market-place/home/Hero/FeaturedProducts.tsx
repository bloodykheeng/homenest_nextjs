// components/Hero/FeaturedProducts.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { FiRefreshCw } from "react-icons/fi";
import { getAllProducts } from "@/services/products/products-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";

const FeaturedProducts = () => {
    const getAllProductsQuery = useQuery({
        queryKey: ["products", "featured"],
        queryFn: (params) => getAllProducts({ ...params, featured: true }),
    });

    useHandleQueryError(getAllProductsQuery);

    const featuredProducts = getAllProductsQuery?.data?.data?.data || [];

    // Skeleton Loader
    if (getAllProductsQuery.isPending) {
        return (
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
                {[1, 2].map((i) => (
                    <div key={i} className="w-full relative rounded-[10px] bg-white dark:bg-gray-800 p-4 sm:p-6 animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0 space-y-3">
                                <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            </div>
                            <div className="w-16 h-20 sm:w-20 sm:h-24 bg-gray-300 dark:bg-gray-700 rounded flex-shrink-0"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Error State with Retry
    if (getAllProductsQuery.isError) {
        return (
            <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-red-500 dark:text-red-400 mb-4 text-center text-sm">Failed to load featured products</p>
                <button
                    onClick={() => getAllProductsQuery.refetch()}
                    className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white text-sm rounded-md hover:bg-opacity-90 transition-all"
                >
                    <FiRefreshCw className={getAllProductsQuery.isRefetching ? "animate-spin" : ""} />
                    {getAllProductsQuery.isRefetching ? "Retrying..." : "Retry"}
                </button>
            </div>
        );
    }

    // Empty State
    if (featuredProducts.length === 0) {
        return (
            <div className="flex items-center justify-center p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400 text-sm">No featured products available</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
            {featuredProducts.slice(0, 2).map((product: any) => {
                const featuredImage = product?.product_attachments?.find((att: any) => att.featured);
                const imageUrl = featuredImage?.file_path || product?.product_attachments?.[0]?.file_path;
                const discount = product?.discount || 0;
                const originalPrice = product?.price;
                const discountedPrice = originalPrice - (originalPrice * discount) / 100;

                return (
                    <div key={product.id} className="w-full relative rounded-[10px] bg-white dark:bg-gray-800 p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                                <h2 className="font-semibold text-dark dark:text-white text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 line-clamp-2">
                                    <Link href={`/product/${product.id}`} className="hover:text-primary transition-colors">
                                        {product.name}
                                    </Link>
                                </h2>

                                <div>
                                    {discount > 0 && (
                                        <p className="font-medium text-gray-500 dark:text-gray-400 text-xs mb-1">
                                            limited time offer
                                        </p>
                                    )}
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium text-base sm:text-lg text-primary">
                                            UGX {discountedPrice.toLocaleString()}
                                        </span>
                                        {discount > 0 && (
                                            <span className="font-medium text-xs sm:text-sm text-gray-400 line-through">
                                                UGX {originalPrice.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="relative w-16 h-20 sm:w-20 sm:h-24 lg:w-24 lg:h-28 flex-shrink-0 overflow-hidden rounded-lg">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                        <span className="text-xs text-gray-400">No Image</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FeaturedProducts;