"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FiShoppingCart, FiHeart, FiMinus, FiPlus, FiRefreshCw, FiChevronRight, FiShare2 } from "react-icons/fi";
import { HiOutlineTag } from "react-icons/hi2";
import { getProductById, getAllProducts } from "@/services/products/products-service";
import { useShoppingCart } from "@/providers/ShoppingCartProvider";
import { useFavourites } from "@/providers/FavouritesProvider";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleQueryError from "@/hooks/useHandleQueryError";
import ProductItem from "../Common/ProductItem";

const ProductDetail = ({ id }: { id: string }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<"description" | "details">("description");

    const { addToCart } = useShoppingCart();
    const { isFavourite, addToFavourites, removeFromFavourites } = useFavourites();
    const primeReactToast = usePrimeReactToast();

    // ── Product query ─────────────────────────────────────────────────────────
    const productQuery = useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductById(id),
        enabled: !!id,
    });
    useHandleQueryError(productQuery);

    const product = productQuery?.data?.data;

    // ── Related products query ────────────────────────────────────────────────
    const relatedQuery = useQuery({
        queryKey: ["products", "related", product?.product_category?.id],
        queryFn: () =>
            getAllProducts({ product_category_id: product.product_category.id, per_page: 4 }),
        enabled: !!product?.product_category?.id,
    });

    const relatedProducts = (relatedQuery?.data?.data?.data || []).filter(
        (p: any) => p.id !== product?.id
    );

    // ── Derived values ────────────────────────────────────────────────────────
    const attachments: any[] = product?.product_attachments || [];
    const featuredAttachment = attachments.find((a) => a.featured) || attachments[0];
    const activeImage = selectedImage ?? featuredAttachment?.file_path ?? null;
    const discount = product?.discount || 0;
    const originalPrice = product?.price || 0;
    const discountedPrice = originalPrice - (originalPrice * discount) / 100;
    const stock = product?.quantity ?? 0;
    const favourited = product ? isFavourite(product.id) : false;

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({ ...product, quantity: stock, selected_quantity: quantity });
    };

    const handleToggleFavourite = () => {
        if (!product) return;
        favourited ? removeFromFavourites(product.id) : addToFavourites(product);
    };

    const handleShare = () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({ title: product?.name, url });
        } else {
            navigator.clipboard.writeText(url).then(() => {
                primeReactToast.success("Link copied!");
            });
        }
    };

    // ── Skeleton ──────────────────────────────────────────────────────────────
    if (productQuery.isPending) {
        return (
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="animate-pulse flex flex-col lg:flex-row gap-10">
                        <div className="w-full lg:w-1/2 space-y-4">
                            <div className="h-[420px] bg-gray-300 dark:bg-gray-700 rounded-lg" />
                            <div className="flex gap-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-lg" />
                                ))}
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 space-y-5">
                            <div className="h-8 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />
                            <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
                            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
                            <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded" />
                            <div className="h-12 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // ── Error ─────────────────────────────────────────────────────────────────
    if (productQuery.isError || !product) {
        return (
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 flex flex-col items-center justify-center text-center py-20">
                    <p className="text-red-500 dark:text-red-400 mb-4">
                        {productQuery.isError ? "Failed to load product." : "Product not found."}
                    </p>
                    {productQuery.isError && (
                        <button
                            onClick={() => productQuery.refetch()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm rounded-md hover:bg-opacity-90"
                        >
                            <FiRefreshCw className={productQuery.isRefetching ? "animate-spin" : ""} />
                            Retry
                        </button>
                    )}
                </div>
            </section>
        );
    }

    return (
        <>
            {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
            <div className="bg-gray-100 dark:bg-gray-800 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
                    <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                        <li>
                            <Link href="/" className="hover:text-primary dark:hover:text-primary transition-colors">
                                Home
                            </Link>
                        </li>
                        <li><FiChevronRight className="text-xs" /></li>
                        <li>
                            <Link href="/shop" className="hover:text-primary dark:hover:text-primary transition-colors">
                                Shop
                            </Link>
                        </li>
                        {product.product_category?.name && (
                            <>
                                <li><FiChevronRight className="text-xs" /></li>
                                <li className="hover:text-primary dark:hover:text-primary transition-colors cursor-pointer">
                                    {product.product_category.name}
                                </li>
                            </>
                        )}
                        <li><FiChevronRight className="text-xs" /></li>
                        <li className="text-dark dark:text-white font-medium line-clamp-1 max-w-[200px]">
                            {product.name}
                        </li>
                    </ol>
                </div>
            </div>

            {/* ── Main Detail ─────────────────────────────────────────────────── */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">

                        {/* Left: Image Gallery */}
                        <div className="w-full lg:w-1/2">
                            {/* Main Image */}
                            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center min-h-[380px] sm:min-h-[460px] mb-4 overflow-hidden">
                                {discount > 0 && (
                                    <span className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                                        -{discount}%
                                    </span>
                                )}
                                {activeImage ? (
                                    <Image
                                        src={activeImage}
                                        alt={product.name}
                                        width={480}
                                        height={480}
                                        className="object-contain transition-all duration-300"
                                        priority
                                    />
                                ) : (
                                    <span className="text-gray-400 dark:text-gray-500">No Image</span>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {attachments.length > 1 && (
                                <div className="flex flex-wrap gap-3">
                                    {attachments.map((att, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedImage(att.file_path)}
                                            className={`w-18 h-18 rounded-lg overflow-hidden border-2 flex items-center justify-center bg-gray-100 dark:bg-gray-800 transition-colors ${activeImage === att.file_path
                                                ? "border-primary"
                                                : "border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                                                }`}
                                        >
                                            <Image
                                                src={att.file_path}
                                                alt={`${product.name} view ${i + 1}`}
                                                width={72}
                                                height={72}
                                                className="object-contain"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Product Info */}
                        <div className="w-full lg:w-1/2 flex flex-col gap-5">
                            {/* Category */}
                            {product.product_category?.name && (
                                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                                    <HiOutlineTag className="text-base" />
                                    {product.product_category.name}
                                </span>
                            )}

                            {/* Name */}
                            <h1 className="font-bold text-2xl sm:text-3xl text-dark dark:text-white leading-snug">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="flex items-center gap-3">
                                {discount > 0 ? (
                                    <>
                                        <span className="font-bold text-3xl text-primary">
                                            UGX {discountedPrice.toLocaleString()}
                                        </span>
                                        <span className="font-medium text-lg text-gray-400 line-through">
                                            UGX {originalPrice.toLocaleString()}
                                        </span>
                                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                            Save {discount}%
                                        </span>
                                    </>
                                ) : (
                                    <span className="font-bold text-3xl text-dark dark:text-white">
                                        UGX {originalPrice.toLocaleString()}
                                    </span>
                                )}
                            </div>

                            {/* Stock */}
                            <div className="flex items-center gap-2">
                                <span
                                    className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full ${stock > 0
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                        : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                        }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
                                    {stock > 0 ? `${stock} in stock` : "Out of stock"}
                                </span>
                            </div>

                            <div className="w-full h-px bg-gray-200 dark:bg-gray-700" />

                            {/* Short description */}
                            {product.description && (
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base line-clamp-4">
                                    {product.description}
                                </p>
                            )}

                            {/* Quantity */}
                            <div className="flex items-center gap-4">
                                <span className="font-medium text-sm text-dark dark:text-white">Quantity:</span>
                                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        disabled={quantity <= 1}
                                        className="w-10 h-10 flex items-center justify-center text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
                                    >
                                        <FiMinus className="text-sm" />
                                    </button>
                                    <span className="w-14 h-10 flex items-center justify-center font-semibold text-dark dark:text-white border-x border-gray-200 dark:border-gray-600">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity((q) => (stock ? Math.min(stock, q + 1) : q + 1))}
                                        disabled={stock > 0 && quantity >= stock}
                                        className="w-10 h-10 flex items-center justify-center text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
                                    >
                                        <FiPlus className="text-sm" />
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={stock === 0}
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-8 rounded-lg bg-primary text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <FiShoppingCart className="text-base" />
                                    {stock === 0 ? "Out of Stock" : "Add to Cart"}
                                </button>

                                <button
                                    onClick={handleToggleFavourite}
                                    className={`inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-6 rounded-lg border transition-all ${favourited
                                        ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-500"
                                        : "border-gray-200 dark:border-gray-600 text-dark dark:text-white hover:border-red-300 hover:text-red-500"
                                        }`}
                                >
                                    <FiHeart className={`text-base ${favourited ? "fill-current" : ""}`} />
                                    {favourited ? "Saved" : "Save"}
                                </button>

                                <button
                                    onClick={handleShare}
                                    className="inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-6 rounded-lg border border-gray-200 dark:border-gray-600 text-dark dark:text-white hover:border-primary hover:text-primary transition-all"
                                >
                                    <FiShare2 className="text-base" />
                                    Share
                                </button>
                            </div>

                            {/* Meta info */}
                            {(product.product_category?.name || product.product_subcategory?.name) && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1 pt-2">
                                    {product.product_category?.name && (
                                        <p>
                                            <span className="font-medium text-dark dark:text-white">Category:</span>{" "}
                                            {product.product_category.name}
                                        </p>
                                    )}
                                    {product.product_subcategory?.name && (
                                        <p>
                                            <span className="font-medium text-dark dark:text-white">Sub-category:</span>{" "}
                                            {product.product_subcategory.name}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Description / Details Tabs ─────────────────────────────── */}
                    <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-10">
                        <div className="flex gap-6 border-b border-gray-200 dark:border-gray-700 mb-6">
                            {(["description", "details"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 font-medium text-sm capitalize border-b-2 transition-colors ${activeTab === tab
                                        ? "border-primary text-primary"
                                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-white"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeTab === "description" && (
                            <div className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
                                {product.description ? (
                                    <p className="whitespace-pre-line">{product.description}</p>
                                ) : (
                                    <p className="text-gray-400 dark:text-gray-500 italic">
                                        No description available for this product.
                                    </p>
                                )}
                            </div>
                        )}

                        {activeTab === "details" && (
                            <div className="max-w-2xl">
                                <table className="w-full text-sm">
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {[
                                            { label: "Product Name", value: product.name },
                                            { label: "Category", value: product.product_category?.name },
                                            { label: "Sub-category", value: product.product_subcategory?.name },
                                            { label: "Price", value: `UGX ${originalPrice.toLocaleString()}` },
                                            { label: "Discount", value: discount > 0 ? `${discount}%` : "None" },
                                            { label: "Stock", value: stock > 0 ? `${stock} units` : "Out of stock" },
                                        ]
                                            .filter((r) => r.value)
                                            .map((row) => (
                                                <tr key={row.label}>
                                                    <td className="py-3 pr-8 font-medium text-dark dark:text-white w-40">
                                                        {row.label}
                                                    </td>
                                                    <td className="py-3 text-gray-600 dark:text-gray-400">{row.value}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* ── Related Products ───────────────────────────────────────── */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-10">
                            <h2 className="font-semibold text-xl text-dark dark:text-white mb-8">
                                Related Products
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
                                {relatedProducts.slice(0, 4).map((item: any) => (
                                    <ProductItem item={item} key={item.id} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default ProductDetail;
