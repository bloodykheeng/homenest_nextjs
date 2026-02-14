"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FiRefreshCw, FiArrowRight } from "react-icons/fi";
import { getAllProducts } from "@/services/products/products-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";

const PromoBanner = () => {
    const getPromoProductsQuery = useQuery({
        queryKey: ["products", "promo-banner"],
        queryFn: (params) => getAllProducts({ ...params, showInBanner: true, per_page: 3 }),
    });

    useHandleQueryError(getPromoProductsQuery);

    const promoProducts = getPromoProductsQuery?.data?.data?.data || [];

    const getImageUrl = (product: any) => {
        const featuredImage = product?.product_attachments?.find((att: any) => att.featured);
        return featuredImage?.file_path || product?.product_attachments?.[0]?.file_path;
    };

    // Skeleton Loader
    if (getPromoProductsQuery.isPending) {
        return (
            <section className="overflow-hidden py-20">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="animate-pulse rounded-lg bg-gray-300 dark:bg-gray-700 h-[300px] sm:h-[350px] mb-7.5"></div>
                    <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
                        <div className="animate-pulse rounded-lg bg-gray-300 dark:bg-gray-700 h-[220px] sm:h-[260px]"></div>
                        <div className="animate-pulse rounded-lg bg-gray-300 dark:bg-gray-700 h-[220px] sm:h-[260px]"></div>
                    </div>
                </div>
            </section>
        );
    }

    // Error State with Retry
    if (getPromoProductsQuery.isError) {
        return (
            <section className="overflow-hidden py-20">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
                        <p className="text-red-500 dark:text-red-400 mb-4 text-center text-sm sm:text-base">
                            Failed to load promotions
                        </p>
                        <button
                            onClick={() => getPromoProductsQuery.refetch()}
                            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white text-sm rounded-md hover:bg-opacity-90 transition-all"
                        >
                            <FiRefreshCw className={getPromoProductsQuery.isRefetching ? "animate-spin" : ""} />
                            {getPromoProductsQuery.isRefetching ? "Retrying..." : "Retry"}
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Empty State
    if (promoProducts.length === 0) {
        return null;
    }

    const mainPromo = promoProducts[0];
    const smallPromos = promoProducts.slice(1, 3);

    const mainImageUrl = getImageUrl(mainPromo);
    const mainDiscount = mainPromo?.discount || 0;
    const mainOriginalPrice = mainPromo?.price;
    const mainDiscountedPrice = mainOriginalPrice - (mainOriginalPrice * mainDiscount) / 100;

    // Color themes for the small promo cards
    const smallPromoThemes = [
        {
            bg: "bg-teal-50 dark:bg-teal-900/20",
            accent: "text-teal-600 dark:text-teal-400",
            btnBg: "bg-teal-600 hover:bg-teal-700",
            imagePosition: "left" as const,
        },
        {
            bg: "bg-orange-50 dark:bg-orange-900/20",
            accent: "text-orange-500 dark:text-orange-400",
            btnBg: "bg-orange-500 hover:bg-orange-600",
            imagePosition: "right" as const,
        },
    ];

    return (
        <section className="overflow-hidden py-20">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                {/* ── Main Promo Banner ─────────────────────────────────────────── */}
                <div className="relative z-1 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 py-12 lg:py-16 xl:py-20 px-4 sm:px-8 lg:px-14 xl:px-20 mb-7.5">
                    <div className="max-w-[550px] w-full">
                        <span className="block font-medium text-lg sm:text-xl text-dark dark:text-white mb-3 line-clamp-1">
                            {mainPromo.name}
                        </span>

                        {mainDiscount > 0 && (
                            <h2 className="font-bold text-xl lg:text-3xl xl:text-4xl text-dark dark:text-white mb-5">
                                UP TO <span className="text-primary">{mainDiscount}%</span> OFF
                            </h2>
                        )}

                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-2 line-clamp-2">
                            {mainPromo.description || "Discover amazing features and quality in this product."}
                        </p>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-6">
                            {mainDiscount > 0 ? (
                                <>
                                    <span className="font-bold text-xl sm:text-2xl text-primary">
                                        UGX {mainDiscountedPrice.toLocaleString()}
                                    </span>
                                    <span className="font-medium text-sm sm:text-base text-gray-400 line-through">
                                        UGX {mainOriginalPrice.toLocaleString()}
                                    </span>
                                </>
                            ) : (
                                <span className="font-bold text-xl sm:text-2xl text-dark dark:text-white">
                                    UGX {mainOriginalPrice.toLocaleString()}
                                </span>
                            )}
                        </div>

                        <Link
                            href={`/product/${mainPromo.id}`}
                            className="inline-flex items-center gap-2 font-medium text-sm text-white bg-primary py-3 px-8 rounded-md hover:bg-opacity-90 transition-all"
                        >
                            Buy Now
                            <FiArrowRight className="text-base" />
                        </Link>
                    </div>

                    {/* Main promo image */}
                    {mainImageUrl && (
                        <div className="absolute bottom-0 right-4 lg:right-20 -z-1 hidden sm:block">
                            <Image
                                src={mainImageUrl}
                                alt={mainPromo.name}
                                width={274}
                                height={350}
                                className="object-contain"
                            />
                        </div>
                    )}
                </div>

                {/* ── Small Promo Banners ───────────────────────────────────────── */}
                {smallPromos.length > 0 && (
                    <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
                        {smallPromos.map((product: any, index: number) => {
                            const theme = smallPromoThemes[index] || smallPromoThemes[0];
                            const imageUrl = getImageUrl(product);
                            const discount = product?.discount || 0;
                            const originalPrice = product?.price;
                            const discountedPrice = originalPrice - (originalPrice * discount) / 100;

                            return (
                                <div
                                    key={product.id}
                                    className={`relative z-1 overflow-hidden rounded-lg ${theme.bg} py-10 xl:py-16 px-4 sm:px-8 xl:px-10`}
                                >
                                    {/* Image positioned based on theme */}
                                    {imageUrl && (
                                        <div
                                            className={`absolute top-1/2 -translate-y-1/2 -z-1 hidden sm:block ${theme.imagePosition === "left"
                                                ? "left-3 sm:left-10"
                                                : "right-3 sm:right-8"
                                                }`}
                                        >
                                            <Image
                                                src={imageUrl}
                                                alt={product.name}
                                                width={200}
                                                height={200}
                                                className="object-contain"
                                            />
                                        </div>
                                    )}

                                    <div className={theme.imagePosition === "left" ? "text-right" : ""}>
                                        <span className="block text-base sm:text-lg text-dark dark:text-white mb-1.5 line-clamp-1">
                                            {product.name}
                                        </span>

                                        {discount > 0 ? (
                                            <h2 className="font-bold text-xl lg:text-2xl text-dark dark:text-white mb-2.5">
                                                Flat <span className={theme.accent}>{discount}%</span> off
                                            </h2>
                                        ) : (
                                            <h2 className="font-bold text-xl lg:text-2xl text-dark dark:text-white mb-2.5">
                                                UGX {originalPrice.toLocaleString()}
                                            </h2>
                                        )}

                                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 max-w-[285px] mb-6">
                                            {product.description || "Quality comfort for your home."}
                                        </p>

                                        <Link
                                            href={`/product/${product.id}`}
                                            className={`inline-flex items-center gap-2 font-medium text-sm text-white ${theme.btnBg} py-2.5 px-8 rounded-md transition-all`}
                                        >
                                            Grab Now
                                            <FiArrowRight className="text-base" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PromoBanner;