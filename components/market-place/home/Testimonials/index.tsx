"use client";

import React, { useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useQuery } from "@tanstack/react-query";
import { FiChevronLeft, FiChevronRight, FiRefreshCw } from "react-icons/fi";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { getAllTestimonials } from "@/services/testimonials/testimonials-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";
import SingleItem from "./SingleItem";

import "swiper/css/navigation";
import "swiper/css";

const Testimonials = () => {
    const sliderRef = useRef<any>(null);

    const getTestimonialsQuery = useQuery({
        queryKey: ["testimonials"],
        queryFn: (params) => getAllTestimonials({ ...params }),
    });

    useHandleQueryError(getTestimonialsQuery);

    const testimonials = getTestimonialsQuery?.data?.data?.data || [];

    const handlePrev = useCallback(() => {
        if (!sliderRef.current) return;
        sliderRef.current.swiper.slidePrev();
    }, []);

    const handleNext = useCallback(() => {
        if (!sliderRef.current) return;
        sliderRef.current.swiper.slideNext();
    }, []);

    // Skeleton Loader
    if (getTestimonialsQuery.isPending) {
        return (
            <section className="overflow-hidden pb-16">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="mb-10 flex items-center justify-between">
                        <div className="space-y-2 animate-pulse">
                            <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="flex items-center gap-3 animate-pulse">
                            <div className="w-9 h-9 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                            <div className="w-9 h-9 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="animate-pulse rounded-[10px] bg-gray-300 dark:bg-gray-700 h-[200px]"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Error State with Retry
    if (getTestimonialsQuery.isError) {
        return (
            <section className="overflow-hidden pb-16">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
                        <p className="text-red-500 dark:text-red-400 mb-4 text-center text-sm sm:text-base">
                            Failed to load testimonials
                        </p>
                        <button
                            onClick={() => getTestimonialsQuery.refetch()}
                            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white text-sm rounded-md hover:bg-opacity-90 transition-all"
                        >
                            <FiRefreshCw className={getTestimonialsQuery.isRefetching ? "animate-spin" : ""} />
                            {getTestimonialsQuery.isRefetching ? "Retrying..." : "Retry"}
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Empty State
    if (testimonials.length === 0) {
        return (
            <section className="overflow-hidden pb-16">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="flex items-center justify-center py-16 sm:py-24 px-4">
                        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                            No testimonials yet
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="overflow-hidden pb-16">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                <div className="p-2 sm:p-5">
                    {/* Section Title */}
                    <div className="mb-10 flex items-center justify-between">
                        <div>
                            <span className="flex items-center gap-2.5 font-medium text-dark dark:text-white mb-1.5">
                                <HiOutlineChatBubbleLeftRight className="text-xl text-primary" />
                                Testimonials
                            </span>
                            <h2 className="font-semibold text-xl xl:text-2xl text-dark dark:text-white">
                                User Feedbacks
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handlePrev}
                                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-600 text-dark dark:text-white hover:bg-primary hover:text-white hover:border-primary transition-all"
                                aria-label="Previous testimonials"
                            >
                                <FiChevronLeft className="text-lg" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-600 text-dark dark:text-white hover:bg-primary hover:text-white hover:border-primary transition-all"
                                aria-label="Next testimonials"
                            >
                                <FiChevronRight className="text-lg" />
                            </button>
                        </div>
                    </div>

                    {/* Testimonials Carousel */}
                    <Swiper
                        ref={sliderRef}
                        slidesPerView={3}
                        spaceBetween={20}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                                spaceBetween: 12,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 16,
                            },
                            1200: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                        }}
                    >
                        {testimonials.map((item: any) => (
                            <SwiperSlide key={item.id} className="h-auto">
                                <SingleItem testimonial={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;