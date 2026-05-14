// components/Hero/HeroCarousel.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart, FiRefreshCw } from "react-icons/fi";
import { getAllProducts } from "@/services/products/products-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";

import "swiper/css/pagination";
import "swiper/css";

const HeroCarousel = () => {
    const getAllProductsQuery = useQuery({
        queryKey: ["products", "slider"],
        queryFn: (params) => getAllProducts({ ...params, showInSlider: true }),
    });

    useHandleQueryError(getAllProductsQuery);

    const sliderProducts = getAllProductsQuery?.data?.data?.data || [];

    // Skeleton Loader
    if (getAllProductsQuery.isPending) {
        return (
            <div className="animate-pulse p-4 sm:p-6">
                <div className="flex flex-col-reverse sm:flex-row items-center gap-4 min-h-[350px] sm:min-h-[400px]">
                    <div className="flex-1 w-full space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            <div className="space-y-2">
                                <div className="h-3 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                <div className="h-3 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            </div>
                        </div>
                        <div className="h-6 w-full max-w-[250px] bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="w-full sm:w-1/2 h-[200px] sm:h-[300px] bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    // Error State with Retry
    if (getAllProductsQuery.isError) {
        return (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
                <p className="text-red-500 dark:text-red-400 mb-4 text-center text-sm sm:text-base">Failed to load products</p>
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
    if (sliderProducts.length === 0) {
        return (
            <div className="flex items-center justify-center py-16 sm:py-24 px-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">No featured products available</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden">
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                modules={[Autoplay, Pagination]}
                className="hero-carousel"
            >
                {sliderProducts.map((product: any) => {
                    const featuredImage = product?.product_attachments?.find((att: any) => att.featured);
                    const imageUrl = featuredImage?.file_path || product?.product_attachments?.[0]?.file_path;
                    const discount = product?.discount || 0;
                    const originalPrice = product?.price;
                    const discountedPrice = originalPrice - (originalPrice * discount) / 100;

                    return (
                        <SwiperSlide key={product.id}>
                            <div className="flex flex-col-reverse sm:flex-row items-center p-10 sm:p-8 lg:p-8 gap-4 sm:gap-6">
                                <div className="flex-1 w-full">
                                    {discount > 0 && (
                                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                            <span className="block font-semibold text-3xl sm:text-4xl lg:text-5xl text-primary">
                                                {discount}%
                                            </span>
                                            <span className="block text-dark dark:text-white text-xs sm:text-sm leading-tight">
                                                Sale
                                                <br />
                                                Off
                                            </span>
                                        </div>
                                    )}

                                    <h1 className="font-semibold text-dark dark:text-white text-lg sm:text-xl lg:text-2xl xl:text-3xl mb-2 sm:mb-3 line-clamp-2">
                                        <Link href={`/shop/product/${product.id}`} className="hover:text-primary transition-colors">
                                            {product.name}
                                        </Link>
                                    </h1>

                                    <p className="text-body-color dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                                        {product.description || "Discover amazing features and quality in this product."}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
                                        {discount > 0 ? (
                                            <>
                                                <span className="font-bold text-lg sm:text-xl lg:text-2xl text-primary">
                                                    UGX {discountedPrice.toLocaleString()}
                                                </span>
                                                <span className="font-medium text-sm sm:text-base text-gray-400 line-through">
                                                    UGX {originalPrice.toLocaleString()}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="font-bold text-lg sm:text-xl lg:text-2xl text-dark dark:text-white">
                                                UGX {originalPrice.toLocaleString()}
                                            </span>
                                        )}
                                    </div>

                                    <Link
                                        href={`/shop/product/${product.id}`}
                                        className="inline-flex items-center gap-2 font-medium text-white text-xs sm:text-sm rounded-md bg-dark dark:bg-primary py-2.5 sm:py-3 px-5 sm:px-9 transition-all duration-200 hover:bg-primary dark:hover:bg-opacity-90"
                                    >
                                        <FiShoppingCart className="text-base sm:text-lg" />
                                        Shop Now
                                    </Link>
                                </div>

                                <div className="relative w-full max-w-full h-[200px] sm:h-[250px] lg:h-[320px] sm:w-1/2 flex-shrink-0 overflow-hidden">
                                    {imageUrl ? (
                                        <Image
                                            src={imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 640px) 100vw, 50vw"
                                            priority
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                            <span className="text-gray-400 text-sm">No Image</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>

    );
};

export default HeroCarousel;