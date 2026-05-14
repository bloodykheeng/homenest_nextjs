"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { useFavourites } from "@/providers/FavouritesProvider";
import { useShoppingCart } from "@/providers/ShoppingCartProvider";
import Breadcrumb from "../Common/Breadcrumb";

const Favourites = () => {
    const { favouriteItems, removeFromFavourites, clearFavourites } = useFavourites();
    const { addToCart } = useShoppingCart();

    return (
        <>
            <section>
                <Breadcrumb title="Favourites" pages={["Favourites"]} />
            </section>

            {favouriteItems.length > 0 ? (
                <section className="overflow-hidden py-20 bg-gray-50 dark:bg-gray-900">
                    <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                        <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
                            <h2 className="font-medium text-dark dark:text-white text-2xl">
                                Your Favourites
                            </h2>
                            <button
                                onClick={clearFavourites}
                                className="text-primary hover:underline text-sm"
                            >
                                Clear All
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {favouriteItems.map((item) => {
                                const featuredImage = item?.product_attachments?.find(
                                    (a: any) => a.featured
                                );
                                const imageUrl =
                                    featuredImage?.file_path ||
                                    item?.product_attachments?.[0]?.file_path;
                                const discount = item?.discount || 0;
                                const originalPrice = item?.price;
                                const discountedPrice =
                                    originalPrice - (originalPrice * discount) / 100;

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-md transition-shadow"
                                    >
                                        {/* Image */}
                                        <div className="relative flex items-center justify-center bg-gray-100 dark:bg-gray-700 min-h-[200px] p-4">
                                            {discount > 0 && (
                                                <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                                                    -{discount}%
                                                </span>
                                            )}
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={item.name}
                                                    width={180}
                                                    height={180}
                                                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500 text-sm">
                                                    No Image
                                                </span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-4 space-y-3">
                                            <h3 className="font-medium text-dark dark:text-white line-clamp-2 hover:text-primary dark:hover:text-primary transition-colors">
                                                <Link href={`/shop/product/${item.id}`}>{item.name}</Link>
                                            </h3>

                                            <div className="flex items-center gap-2 font-medium">
                                                {discount > 0 ? (
                                                    <>
                                                        <span className="text-primary">
                                                            UGX {discountedPrice.toLocaleString()}
                                                        </span>
                                                        <span className="text-gray-400 line-through text-sm">
                                                            UGX {originalPrice.toLocaleString()}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-dark dark:text-white">
                                                        UGX {originalPrice.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 pt-1">
                                                <button
                                                    onClick={() =>
                                                        addToCart({ ...item, quantity: item.quantity ?? 0, selected_quantity: 1 })
                                                    }
                                                    className="flex-1 inline-flex items-center justify-center gap-1.5 font-medium text-sm py-2 px-3 rounded-md bg-primary text-white hover:bg-opacity-90 transition-all"
                                                >
                                                    <FiShoppingCart className="text-sm" />
                                                    Add to Cart
                                                </button>
                                                <button
                                                    onClick={() => removeFromFavourites(item.id)}
                                                    aria-label="Remove from favourites"
                                                    className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-600 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                >
                                                    <FiTrash2 className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            ) : (
                <section className="py-20 bg-gray-50 dark:bg-gray-900">
                    <div className="flex flex-col items-center justify-center text-center px-4">
                        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-6">
                            <FiHeart className="text-4xl text-gray-400 dark:text-gray-500" />
                        </div>
                        <h2 className="text-xl font-medium text-dark dark:text-white mb-2">
                            No favourites yet
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Tap the heart icon on any product to save it here.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex justify-center font-medium text-white bg-primary py-3 px-8 rounded-md ease-out duration-200 hover:bg-opacity-90"
                        >
                            Browse Shop
                        </Link>
                    </div>
                </section>
            )}
        </>
    );
};

export default Favourites;
