"use client";

import React from "react";
import Link from "next/link";
import { useShoppingCart } from "@/providers/ShoppingCartProvider";

const OrderSummary = () => {
    const { cartItems, cartTotal } = useShoppingCart();

    return (
        <div className="lg:max-w-[455px] w-full">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <div className="border-b border-gray-200 dark:border-gray-700 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark dark:text-white">
                        Order Summary
                    </h3>
                </div>

                <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* Header */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-dark dark:text-white text-sm">
                            Product
                        </h4>
                        <h4 className="font-medium text-dark dark:text-white text-sm text-right">
                            Subtotal
                        </h4>
                    </div>

                    {/* Product items */}
                    {cartItems.map((item) => {
                        const discount = item.discount || 0;
                        const finalPrice =
                            item.price - (item.price * discount) / 100;
                        const subtotal = finalPrice * item.selected_quantity;

                        return (
                            <div
                                key={item.id}
                                className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700"
                            >
                                <div className="pr-4">
                                    <p className="text-dark dark:text-white text-sm">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        × {item.selected_quantity}
                                    </p>
                                </div>
                                <p className="text-dark dark:text-white text-sm text-right whitespace-nowrap">
                                    UGX {subtotal.toLocaleString()}
                                </p>
                            </div>
                        );
                    })}

                    {/* Total */}
                    <div className="flex items-center justify-between pt-5">
                        <p className="font-medium text-lg text-dark dark:text-white">
                            Total
                        </p>
                        <p className="font-medium text-lg text-dark dark:text-white text-right">
                            UGX {cartTotal.toLocaleString()}
                        </p>
                    </div>

                    {/* Checkout button */}
                    <Link
                        href="/checkout"
                        className="w-full flex justify-center font-medium text-white bg-primary py-3 px-6 rounded-md ease-out duration-200 hover:bg-opacity-90 mt-7.5"
                    >
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;