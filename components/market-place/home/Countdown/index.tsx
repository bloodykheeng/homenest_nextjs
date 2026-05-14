"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { FiRefreshCw, FiClock, FiArrowRight } from "react-icons/fi";
import { getAllProducts } from "@/services/products/products-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const CountDown = () => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const getDealOfTheDayQuery = useQuery({
        queryKey: ["products", "deal-of-the-day"],
        queryFn: (params) => getAllProducts({ ...params, dealOfTheDay: true, per_page: 1 }),
    });

    useHandleQueryError(getDealOfTheDayQuery);

    const dealProduct = getDealOfTheDayQuery?.data?.data?.data?.[0];

    // Get countdown deadline from product or fallback
    const deadline = dealProduct?.deal_end_date
        ? moment(dealProduct.deal_end_date)
        : moment().endOf("month"); // fallback: end of current month

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = moment();
            const duration = moment.duration(deadline.diff(now));

            if (duration.asSeconds() <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(duration.asDays()),
                hours: duration.hours(),
                minutes: duration.minutes(),
                seconds: duration.seconds(),
            });
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [deadline.valueOf()]);

    const formatTime = (value: number) => (value < 10 ? `0${value}` : `${value}`);

    const isExpired =
        timeLeft.days === 0 &&
        timeLeft.hours === 0 &&
        timeLeft.minutes === 0 &&
        timeLeft.seconds === 0;

    // Helper for image
    const getImageUrl = (product: any) => {
        const featuredImage = product?.product_attachments?.find((att: any) => att.featured);
        return featuredImage?.file_path || product?.product_attachments?.[0]?.file_path;
    };

    // Skeleton Loader
    if (getDealOfTheDayQuery.isPending) {
        return (
            <section className="overflow-hidden py-20">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="animate-pulse rounded-lg bg-gray-300 dark:bg-gray-700 h-[300px] sm:h-[400px]"></div>
                </div>
            </section>
        );
    }

    // Error State
    if (getDealOfTheDayQuery.isError) {
        return (
            <section className="overflow-hidden py-20">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
                        <p className="text-red-500 dark:text-red-400 mb-4 text-center text-sm sm:text-base">
                            Failed to load deal
                        </p>
                        <button
                            onClick={() => getDealOfTheDayQuery.refetch()}
                            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white text-sm rounded-md hover:bg-opacity-90 transition-all"
                        >
                            <FiRefreshCw className={getDealOfTheDayQuery.isRefetching ? "animate-spin" : ""} />
                            {getDealOfTheDayQuery.isRefetching ? "Retrying..." : "Retry"}
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Empty State
    if (!dealProduct) {
        return null;
    }

    const imageUrl = getImageUrl(dealProduct);
    const discount = dealProduct?.discount || 0;
    const originalPrice = dealProduct?.price;
    const discountedPrice = originalPrice - (originalPrice * discount) / 100;

    const timerBlocks = [
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hours" },
        { value: timeLeft.minutes, label: "Minutes" },
        { value: timeLeft.seconds, label: "Seconds" },
    ];

    return (
        <section className="overflow-hidden py-20">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                <div className="relative overflow-hidden z-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-8 lg:p-10 xl:p-16">
                    <div className="max-w-[460px] w-full">
                        {/* Badge */}
                        <span className="inline-flex items-center gap-2 font-medium text-base text-primary mb-2.5">
                            <FiClock className="text-lg" />
                            {isExpired ? "Deal Ended" : "Don't Miss!!"}
                        </span>

                        {/* Product Name */}
                        <h2 className="font-bold text-dark dark:text-white text-xl lg:text-3xl xl:text-4xl mb-3 line-clamp-2">
                            {dealProduct.name}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-2 line-clamp-2">
                            {dealProduct.description || "Limited time deal on this amazing product."}
                        </p>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-4">
                            {discount > 0 ? (
                                <>
                                    <span className="font-bold text-xl sm:text-2xl text-primary">
                                        UGX {discountedPrice.toLocaleString()}
                                    </span>
                                    <span className="font-medium text-sm sm:text-base text-gray-400 line-through">
                                        UGX {originalPrice.toLocaleString()}
                                    </span>
                                </>
                            ) : (
                                <span className="font-bold text-xl sm:text-2xl text-dark dark:text-white">
                                    UGX {originalPrice.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Countdown Timer */}
                        {!isExpired && (
                            <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6 mt-6">
                                {timerBlocks.map((block) => (
                                    <div key={block.label} className="text-center">
                                        <span className="min-w-[56px] sm:min-w-[64px] h-12 sm:h-14 font-semibold text-lg sm:text-xl lg:text-3xl text-dark dark:text-white rounded-lg flex items-center justify-center bg-white dark:bg-gray-800 shadow-md px-3 sm:px-4 mb-1.5">
                                            {formatTime(block.value)}
                                        </span>
                                        <span className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                            {block.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isExpired && (
                            <p className="text-red-500 dark:text-red-400 font-medium text-sm mt-4">
                                This deal has expired. Check back for new offers!
                            </p>
                        )}

                        {/* CTA */}
                        <Link
                            href={`/shop/product/${dealProduct.id}`}
                            className="inline-flex items-center gap-2 font-medium text-sm text-white bg-primary py-3 px-8 rounded-md hover:bg-opacity-90 transition-all mt-7"
                        >
                            {isExpired ? "View Product" : "Check it Out!"}
                            <FiArrowRight className="text-base" />
                        </Link>
                    </div>

                    {/* Product Image */}
                    {imageUrl && (
                        <Image
                            src={imageUrl}
                            alt={dealProduct.name}
                            className="hidden lg:block absolute right-4 xl:right-28 bottom-4 xl:bottom-10 -z-1"
                            width={411}
                            height={376}
                        />
                    )}
                </div>
            </div>
        </section>
    );
};

export default CountDown;