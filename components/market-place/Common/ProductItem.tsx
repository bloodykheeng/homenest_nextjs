"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "primereact/dialog";
import { FiShoppingCart, FiEye, FiHeart, FiMinus, FiPlus, FiX, FiShare2 } from "react-icons/fi";
import { useShoppingCart } from "@/providers/ShoppingCartProvider";
import { useFavourites } from "@/providers/FavouritesProvider";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";

const ProductItem = ({ item }: { item: any }) => {
    const [quickViewVisible, setQuickViewVisible] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const { addToCart } = useShoppingCart();
    const { isFavourite, addToFavourites, removeFromFavourites } = useFavourites();
    const primeReactToast = usePrimeReactToast();
    const favourited = isFavourite(item.id);

    const handleShare = () => {
        const url = `${window.location.origin}/shop/product/${item.id}`;
        if (navigator.share) {
            navigator.share({ title: item.name, url });
        } else {
            navigator.clipboard.writeText(url).then(() => {
                primeReactToast.success("Link copied!");
            });
        }
    };

    const featuredImage = item?.product_attachments?.find((att: any) => att.featured);
    const imageUrl = featuredImage?.file_path || item?.product_attachments?.[0]?.file_path;
    const discount = item?.discount || 0;
    const originalPrice = item?.price;
    const discountedPrice = originalPrice - (originalPrice * discount) / 100;

    const handleAddToCart = () => {
        addToCart({
            ...item,
            selected_quantity: 1,
        });
    };

    const handleQuickViewAddToCart = () => {
        addToCart({
            ...item,
            selected_quantity: selectedQuantity,
        });
        setQuickViewVisible(false);
        setSelectedQuantity(1);
    };

    return (
        <>
            <div className="group">
                {/* Image Container */}
                <div className="relative overflow-hidden flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 min-h-[220px] sm:min-h-[270px] mb-4">
                    {discount > 0 && (
                        <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                            -{discount}%
                        </span>
                    )}

                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={item.name}
                            width={250}
                            height={250}
                            className="object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400 dark:text-gray-500 text-sm">No Image</span>
                        </div>
                    )}

                    {/* Hover Actions */}
                    <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 transition-transform duration-200 ease-linear group-hover:translate-y-0">
                        <button
                            onClick={() => {
                                setQuickViewVisible(true);
                                setSelectedQuantity(1);
                            }}
                            aria-label="Quick view"
                            className="flex items-center justify-center w-9 h-9 rounded-md shadow-md bg-white dark:bg-gray-700 text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
                        >
                            <FiEye className="text-base" />
                        </button>

                        <button
                            onClick={handleAddToCart}
                            className="inline-flex items-center gap-1.5 font-medium text-sm py-2 px-4 rounded-md bg-primary text-white hover:bg-opacity-90 transition-all"
                        >
                            <FiShoppingCart className="text-sm" />
                            Add to cart
                        </button>

                        <button
                            aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
                            onClick={() => favourited ? removeFromFavourites(item.id) : addToFavourites(item)}
                            className={`flex items-center justify-center w-9 h-9 rounded-md shadow-md bg-white dark:bg-gray-700 transition-colors ${favourited ? "text-red-500 dark:text-red-400" : "text-dark dark:text-white hover:text-red-500 dark:hover:text-red-400"}`}
                        >
                            <FiHeart className={`text-base ${favourited ? "fill-current" : ""}`} />
                        </button>

                        <button
                            onClick={handleShare}
                            aria-label="Share product"
                            className="flex items-center justify-center w-9 h-9 rounded-md shadow-md bg-white dark:bg-gray-700 text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
                        >
                            <FiShare2 className="text-base" />
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <h3 className="font-medium text-dark dark:text-white hover:text-primary dark:hover:text-primary transition-colors mb-1.5 line-clamp-2">
                    <Link href={`/shop/product/${item.id}`}>{item.name}</Link>
                </h3>

                <div className="flex items-center gap-2 font-medium text-lg">
                    {discount > 0 ? (
                        <>
                            <span className="text-primary">UGX {discountedPrice.toLocaleString()}</span>
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
            </div>

            {/* ── Quick View Dialog (PrimeReact) ─────────────────────────────── */}
            <Dialog
                visible={quickViewVisible}
                onHide={() => setQuickViewVisible(false)}
                header={null}
                closable={false}
                dismissableMask
                className="w-[95vw] max-w-[800px]"
                contentClassName="!p-0"
                showHeader={false}
            >
                <div className="relative">
                    {/* Close button */}
                    <button
                        onClick={() => setQuickViewVisible(false)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-dark dark:text-white hover:bg-red-500 hover:text-white transition-colors"
                        aria-label="Close quick view"
                    >
                        <FiX className="text-lg" />
                    </button>

                    <div className="flex flex-col sm:flex-row gap-6 p-6">
                        {/* Product Image */}
                        <div className="w-full sm:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-[250px]">
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt={item.name}
                                    width={350}
                                    height={350}
                                    className="object-contain"
                                />
                            ) : (
                                <span className="text-gray-400 text-sm">No Image</span>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="w-full sm:w-1/2 flex flex-col justify-center">
                            {discount > 0 && (
                                <span className="inline-block w-fit bg-red-500 text-white text-xs font-medium px-2 py-1 rounded mb-3">
                                    {discount}% OFF
                                </span>
                            )}

                            <h2 className="font-semibold text-xl sm:text-2xl text-dark dark:text-white mb-2">
                                {item.name}
                            </h2>

                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                                {item.description || "Discover amazing features and quality in this product."}
                            </p>

                            {/* Price */}
                            <div className="flex items-center gap-3 mb-6">
                                {discount > 0 ? (
                                    <>
                                        <span className="font-bold text-2xl text-primary">
                                            UGX {discountedPrice.toLocaleString()}
                                        </span>
                                        <span className="font-medium text-base text-gray-400 line-through">
                                            UGX {originalPrice.toLocaleString()}
                                        </span>
                                    </>
                                ) : (
                                    <span className="font-bold text-2xl text-dark dark:text-white">
                                        UGX {originalPrice.toLocaleString()}
                                    </span>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-sm font-medium text-dark dark:text-white">Qty:</span>
                                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-md">
                                    <button
                                        onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                                        className="w-9 h-9 flex items-center justify-center text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-l-md"
                                    >
                                        <FiMinus className="text-sm" />
                                    </button>
                                    <span className="w-12 h-9 flex items-center justify-center text-sm font-medium text-dark dark:text-white border-x border-gray-200 dark:border-gray-600">
                                        {selectedQuantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            setSelectedQuantity((q) =>
                                                item.quantity ? Math.min(item.quantity, q + 1) : q + 1
                                            )
                                        }
                                        className="w-9 h-9 flex items-center justify-center text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-r-md"
                                    >
                                        <FiPlus className="text-sm" />
                                    </button>
                                </div>

                                {item.quantity && (
                                    <span className="text-xs text-gray-400">
                                        {item.quantity} available
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    onClick={handleQuickViewAddToCart}
                                    className="inline-flex items-center gap-2 font-medium text-sm py-3 px-6 rounded-md bg-primary text-white hover:bg-opacity-90 transition-all"
                                >
                                    <FiShoppingCart className="text-base" />
                                    Add to Cart
                                </button>

                                <Link
                                    href={`/shop/product/${item.id}`}
                                    onClick={() => setQuickViewVisible(false)}
                                    className="inline-flex items-center gap-2 font-medium text-sm py-3 px-6 rounded-md border border-gray-200 dark:border-gray-600 text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default ProductItem;