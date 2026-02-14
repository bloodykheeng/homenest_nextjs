"use client";

import React from "react";
import Image from "next/image";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { useShoppingCart } from "@/providers/ShoppingCartProvider";

interface SingleItemProps {
    item: {
        id: number | string;
        name: string;
        price: number;
        discount?: number;
        quantity: number;
        selected_quantity: number;
        product_attachments?: any[];
        [key: string]: any;
    };
}

const SingleItem = ({ item }: SingleItemProps) => {
    const { updateCartItemQuantity, removeFromCart } = useShoppingCart();

    const discount = item.discount || 0;
    const finalPrice = item.price - (item.price * discount) / 100;
    const subtotal = finalPrice * item.selected_quantity;

    const thumbnail =
        item.product_attachments?.[0]?.file_path || "/images/placeholder.png";

    const handleIncrease = () => {
        updateCartItemQuantity(item.id, item.selected_quantity + 1);
    };

    const handleDecrease = () => {
        if (item.selected_quantity > 1) {
            updateCartItemQuantity(item.id, item.selected_quantity - 1);
        }
    };

    const handleRemove = () => {
        removeFromCart(item.id);
    };

    return (
        <div className="flex items-center border-t border-gray-200 dark:border-gray-700 py-5 px-7.5">
            {/* Product */}
            <div className="min-w-[400px]">
                <div className="flex items-center gap-5.5">
                    <div className="flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 w-20 h-20 overflow-hidden flex-shrink-0">
                        <Image
                            width={80}
                            height={80}
                            src={thumbnail}
                            alt={item.name}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div>
                        <h3 className="text-dark dark:text-white text-sm font-medium hover:text-primary transition-colors">
                            {item.name}
                        </h3>
                        {discount > 0 && (
                            <p className="text-xs text-green-500 mt-1">
                                {discount}% off
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Price */}
            <div className="min-w-[180px]">
                <div className="flex flex-col">
                    <p className="text-dark dark:text-white text-sm">
                        UGX {finalPrice.toLocaleString()}
                    </p>
                    {discount > 0 && (
                        <p className="text-xs text-gray-400 line-through">
                            UGX {item.price.toLocaleString()}
                        </p>
                    )}
                </div>
            </div>

            {/* Quantity */}
            <div className="min-w-[275px]">
                <div className="w-max flex items-center rounded-md border border-gray-200 dark:border-gray-600">
                    <button
                        onClick={handleDecrease}
                        disabled={item.selected_quantity <= 1}
                        aria-label="Decrease quantity"
                        className="flex items-center justify-center w-10 h-10 text-dark dark:text-white hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <FiMinus className="text-sm" />
                    </button>

                    <span className="flex items-center justify-center w-14 h-10 border-x border-gray-200 dark:border-gray-600 text-dark dark:text-white text-sm">
                        {item.selected_quantity}
                    </span>

                    <button
                        onClick={handleIncrease}
                        disabled={item.selected_quantity >= item.quantity}
                        aria-label="Increase quantity"
                        className="flex items-center justify-center w-10 h-10 text-dark dark:text-white hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <FiPlus className="text-sm" />
                    </button>
                </div>
                {item.selected_quantity >= item.quantity && (
                    <p className="text-xs text-orange-500 mt-1">Max stock reached</p>
                )}
            </div>

            {/* Subtotal */}
            <div className="min-w-[200px]">
                <p className="text-dark dark:text-white text-sm font-medium">
                    UGX {subtotal.toLocaleString()}
                </p>
            </div>

            {/* Action */}
            <div className="min-w-[50px] flex justify-end">
                <button
                    onClick={handleRemove}
                    aria-label="Remove item from cart"
                    className="flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-dark dark:text-white hover:bg-red-50 hover:border-red-300 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:border-red-800 dark:hover:text-red-400 transition-colors"
                >
                    <FiTrash2 className="text-base" />
                </button>
            </div>
        </div>
    );
};

export default SingleItem;