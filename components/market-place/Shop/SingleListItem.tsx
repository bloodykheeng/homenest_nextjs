"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart, FiEye, FiHeart } from "react-icons/fi";
import { useShoppingCart } from "@/providers/ShoppingCartProvider";

const SingleListItem = ({ item }: { item: any }) => {
    const { addToCart } = useShoppingCart();

    const featuredImage = item?.product_attachments?.find((att: any) => att.featured);
    const imageUrl = featuredImage?.file_path || item?.product_attachments?.[0]?.file_path;
    const discount = item?.discount || 0;
    const originalPrice = item?.price;
    const discountedPrice = originalPrice - (originalPrice * discount) / 100;

    const handleAddToCart = () => {
        addToCart({ ...item, selected_quantity: 1 });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            {/* Image */}
            <div className="relative w-full sm:w-[200px] h-[200px] flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                {discount > 0 && (
                    <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded">
                        -{discount}%
                    </span>
                )}

                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={item.name}
                        width={200}
                        height={200}
                        className="object-contain"
                    />
                ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                )}
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-medium text-dark dark:text-white text-base sm:text-lg hover:text-primary transition-colors mb-2">
                        <Link href={`/product/${item.id}`}>{item.name}</Link>
                    </h3>

                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {item.description || "Discover amazing features and quality in this product."}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                        {discount > 0 ? (
                            <>
                                <span className="font-bold text-lg text-primary">
                                    UGX {discountedPrice.toLocaleString()}
                                </span>
                                <span className="text-gray-400 line-through text-sm">
                                    UGX {originalPrice.toLocaleString()}
                                </span>
                            </>
                        ) : (
                            <span className="font-bold text-lg text-dark dark:text-white">
                                UGX {originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={handleAddToCart}
                        className="inline-flex items-center gap-1.5 font-medium text-sm py-2 px-4 rounded-md bg-primary text-white hover:bg-opacity-90 transition-all"
                    >
                        <FiShoppingCart className="text-sm" />
                        Add to Cart
                    </button>

                    <Link
                        href={`/product/${item.id}`}
                        className="flex items-center justify-center w-9 h-9 rounded-md border border-gray-200 dark:border-gray-600 text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
                    >
                        <FiEye className="text-base" />
                    </Link>

                    <button
                        aria-label="Add to wishlist"
                        className="flex items-center justify-center w-9 h-9 rounded-md border border-gray-200 dark:border-gray-600 text-dark dark:text-white hover:text-red-500 transition-colors"
                    >
                        <FiHeart className="text-base" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SingleListItem;