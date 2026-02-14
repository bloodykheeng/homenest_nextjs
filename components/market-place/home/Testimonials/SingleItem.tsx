import React from "react";
import Image from "next/image";
import { FiStar } from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const SingleItem = ({ testimonial }: { testimonial: any }) => {
    const rating = testimonial?.rating || 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const authorImage =
        testimonial?.user?.photo_url ||
        testimonial?.user?.profile_photo ||
        testimonial?.authorImg;

    const authorName =
        testimonial?.user?.name ||
        testimonial?.authorName ||
        "Customer";

    const authorRole =
        testimonial?.user?.role ||
        testimonial?.authorRole ||
        "Verified Buyer";

    return (
        <div className="shadow-md bg-white dark:bg-gray-800 rounded-[10px] py-6 sm:py-7.5 px-4 sm:px-8 m-1 h-full flex flex-col">
            {/* Star Rating */}
            <div className="flex items-center gap-1 mb-4 sm:mb-5">
                {Array.from({ length: fullStars }).map((_, i) => (
                    <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
                ))}
                {hasHalfStar && <FaStarHalfAlt className="text-yellow-400 text-sm" />}
                {Array.from({ length: emptyStars }).map((_, i) => (
                    <FaRegStar key={`empty-${i}`} className="text-yellow-400 text-sm" />
                ))}
            </div>

            {/* Review Text */}
            <p className="text-dark dark:text-gray-300 text-sm sm:text-base mb-6 flex-1 line-clamp-4">
                {testimonial?.review || testimonial?.comment || testimonial?.message}
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                    {authorImage ? (
                        <Image
                            src={authorImage}
                            alt={authorName}
                            width={50}
                            height={50}
                            className="w-full h-full object-cover rounded-full"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary font-semibold text-lg">
                            {authorName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <div className="min-w-0">
                    <h3 className="font-medium text-dark dark:text-white text-sm sm:text-base truncate">
                        {authorName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                        {authorRole}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SingleItem;