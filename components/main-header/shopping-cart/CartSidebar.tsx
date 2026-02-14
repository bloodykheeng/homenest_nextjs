"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "primereact/sidebar";
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { useShoppingCart } from "@/providers/ShoppingCartProvider";

interface CartSidebarProps {
    visible: boolean;
    onHide: () => void;
}

const CartSidebar = ({ visible, onHide }: CartSidebarProps) => {
    const {
        cartItems,
        cartCount,
        cartTotal,
        isCartLoading,
        removeFromCart,
        updateCartItemQuantity,
    } = useShoppingCart();

    const getImageUrl = (item: any) => {
        const featuredImage = item?.product_attachments?.find((att: any) => att.featured);
        return featuredImage?.file_path || item?.product_attachments?.[0]?.file_path;
    };

    const getItemPrice = (item: any) => {
        const discount = item?.discount || 0;
        const price = item?.price || 0;
        return price - (price * discount) / 100;
    };

    return (
        <Sidebar
            visible={visible}
            position="right"
            onHide={onHide}
            className="w-full sm:w-[420px] lg:w-[480px]"
            showCloseIcon={false}
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <FiShoppingCart className="text-xl text-primary" />
                        <h2 className="font-semibold text-lg sm:text-xl text-dark dark:text-white">
                            Cart View
                        </h2>
                        {cartCount > 0 && (
                            <span className="bg-primary text-white text-xs font-medium rounded-full px-2 py-0.5">
                                {cartCount}
                            </span>
                        )}
                    </div>
                </div>
            }
        >
            <div className="flex flex-col h-full">
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto -mx-4 px-4">
                    {isCartLoading ? (
                        /* Skeleton */
                        <div className="flex flex-col gap-5">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-4 animate-pulse">
                                    <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : cartItems.length === 0 ? (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                                <FiShoppingCart className="text-4xl text-gray-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Your cart is empty!
                            </p>
                            <Link
                                href="/shop"
                                onClick={onHide}
                                className="inline-flex items-center gap-2 font-medium text-sm text-white bg-dark dark:bg-primary py-3 px-8 rounded-md hover:bg-opacity-90 transition-all"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        /* Cart Items List */
                        <div className="flex flex-col gap-5">
                            {cartItems.map((item: any) => {
                                const imageUrl = getImageUrl(item);
                                const unitPrice = getItemPrice(item);

                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-start gap-4 pb-5 border-b border-gray-100 dark:border-gray-700 last:border-0"
                                    >
                                        {/* Image */}
                                        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={item.name}
                                                    width={80}
                                                    height={80}
                                                    className="object-contain"
                                                />
                                            ) : (
                                                <span className="text-gray-400 text-xs">No Image</span>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-dark dark:text-white text-sm mb-1 line-clamp-2">
                                                <Link
                                                    href={`/product/${item.id}`}
                                                    onClick={onHide}
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    {item.name}
                                                </Link>
                                            </h3>

                                            <p className="text-primary font-medium text-sm mb-2">
                                                UGX {unitPrice.toLocaleString()}
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-md">
                                                    <button
                                                        onClick={() =>
                                                            updateCartItemQuantity(
                                                                item.id,
                                                                item.selected_quantity - 1
                                                            )
                                                        }
                                                        disabled={item.selected_quantity <= 1}
                                                        className="w-7 h-7 flex items-center justify-center text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-l-md disabled:opacity-40"
                                                    >
                                                        <FiMinus className="text-xs" />
                                                    </button>
                                                    <span className="w-8 h-7 flex items-center justify-center text-xs font-medium text-dark dark:text-white border-x border-gray-200 dark:border-gray-600">
                                                        {item.selected_quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateCartItemQuantity(
                                                                item.id,
                                                                item.selected_quantity + 1
                                                            )
                                                        }
                                                        className="w-7 h-7 flex items-center justify-center text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-r-md"
                                                    >
                                                        <FiPlus className="text-xs" />
                                                    </button>
                                                </div>

                                                <span className="text-xs text-gray-400">
                                                    = UGX {(unitPrice * item.selected_quantity).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            aria-label={`Remove ${item.name} from cart`}
                                            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 hover:text-red-500 transition-colors"
                                        >
                                            <FiTrash2 className="text-sm" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer - Subtotal & Actions */}
                {cartItems.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-5 mt-5 -mx-4 px-4">
                        <div className="flex items-center justify-between gap-4 mb-5">
                            <p className="font-semibold text-lg text-dark dark:text-white">
                                Subtotal:
                            </p>
                            <p className="font-semibold text-lg text-primary">
                                UGX {cartTotal.toLocaleString()}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/cart"
                                onClick={onHide}
                                className="w-full flex justify-center font-medium text-sm text-white bg-primary py-3 px-6 rounded-md hover:bg-opacity-90 transition-all"
                            >
                                View Cart
                            </Link>

                            <Link
                                href="/checkout"
                                onClick={onHide}
                                className="w-full flex justify-center font-medium text-sm text-white bg-dark dark:bg-gray-700 py-3 px-6 rounded-md hover:bg-opacity-90 transition-all"
                            >
                                Checkout
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </Sidebar>
    );
};

export default CartSidebar;