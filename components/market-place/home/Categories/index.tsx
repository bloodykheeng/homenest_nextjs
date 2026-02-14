"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiChevronLeft, FiChevronRight, FiRefreshCw } from "react-icons/fi";
import { HiOutlineTag } from "react-icons/hi2";
import { getAllProductCategories } from "@/services/products/product-categories-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";
import SingleItem from "./SingleItem";

import "swiper/css/navigation";
import "swiper/css";

const Categories = () => {
    const sliderRef = useRef<any>(null);

    const getAllCategoriesQuery = useQuery({
        queryKey: ["product-categories"],
        queryFn: (params) => getAllProductCategories({ ...params }),
    });

    useHandleQueryError(getAllCategoriesQuery);

    const categories = getAllCategoriesQuery?.data?.data?.data || [];

    const handlePrev = useCallback(() => {
        if (!sliderRef.current) return;
        sliderRef.current.swiper.slidePrev();
    }, []);

    const handleNext = useCallback(() => {
        if (!sliderRef.current) return;
        sliderRef.current.swiper.slideNext();
    }, []);

    // Skeleton Loader
    if (getAllCategoriesQuery.isPending) {
        return (
            <section className="overflow-hidden pt-17.5">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-200 dark:border-gray-700">
                    <div className="mb-10 flex items-center justify-between">
                        <div className="space-y-2 animate-pulse">
                            <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="flex items-center gap-3 animate-pulse">
                            <div className="w-9 h-9 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                            <div className="w-9 h-9 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center animate-pulse">
                                <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] lg:w-[130px] lg:h-[130px] rounded-full bg-gray-300 dark:bg-gray-700 mb-4"></div>
                                <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Error State with Retry
    if (getAllCategoriesQuery.isError) {
        return (
            <section className="overflow-hidden pt-17.5">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15">
                    <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
                        <p className="text-red-500 dark:text-red-400 mb-4 text-center text-sm sm:text-base">
                            Failed to load categories
                        </p>
                        <button
                            onClick={() => getAllCategoriesQuery.refetch()}
                            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white text-sm rounded-md hover:bg-opacity-90 transition-all"
                        >
                            <FiRefreshCw className={getAllCategoriesQuery.isRefetching ? "animate-spin" : ""} />
                            {getAllCategoriesQuery.isRefetching ? "Retrying..." : "Retry"}
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Empty State
    if (categories.length === 0) {
        return (
            <section className="overflow-hidden pt-17.5">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15">
                    <div className="flex items-center justify-center py-16 sm:py-24 px-4">
                        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                            No categories available
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="overflow-hidden pt-17.5">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-200 dark:border-gray-700">
                {/* Section Title */}
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <span className="flex items-center gap-2.5 font-medium text-dark dark:text-white mb-1.5">
                            <HiOutlineTag className="text-xl text-primary" />
                            Categories
                        </span>
                        <h2 className="font-semibold text-xl xl:text-2xl text-dark dark:text-white">
                            Browse by Category
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrev}
                            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-600 text-dark dark:text-white hover:bg-primary hover:text-white hover:border-primary transition-all"
                            aria-label="Previous categories"
                        >
                            <FiChevronLeft className="text-lg" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-600 text-dark dark:text-white hover:bg-primary hover:text-white hover:border-primary transition-all"
                            aria-label="Next categories"
                        >
                            <FiChevronRight className="text-lg" />
                        </button>
                    </div>
                </div>

                {/* Categories Carousel */}
                <Swiper
                    ref={sliderRef}
                    slidesPerView={6}
                    spaceBetween={20}
                    breakpoints={{
                        0: {
                            slidesPerView: 2,
                            spaceBetween: 12,
                        },
                        480: {
                            slidesPerView: 3,
                            spaceBetween: 16,
                        },
                        768: {
                            slidesPerView: 4,
                            spaceBetween: 16,
                        },
                        1200: {
                            slidesPerView: 6,
                            spaceBetween: 20,
                        },
                    }}
                >
                    {categories.map((item: any) => (
                        <SwiperSlide key={item.id}>
                            <SingleItem item={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default Categories;