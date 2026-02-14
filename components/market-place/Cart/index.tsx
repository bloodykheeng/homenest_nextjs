"use client";

import React from "react";
import Discount from "./Discount";
import OrderSummary from "./OrderSummary";
import SingleItem from "./SingleItem";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import { useShoppingCart } from "@/providers/ShoppingCartProvider";
import { FiShoppingCart } from "react-icons/fi";

const Cart = () => {
    const { cartItems, clearCart, isCartLoading } = useShoppingCart();

    return (
        <>
            <section>
                <Breadcrumb title="Cart" pages={["Cart"]} />
            </section>

            {isCartLoading ? (
                <section className="overflow-hidden py-20 bg-gray-50 dark:bg-gray-900">
                    <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                        <div className="animate-pulse space-y-6">
                            <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-20 bg-gray-300 dark:bg-gray-700 rounded" />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            ) : cartItems.length > 0 ? (
                <section className="overflow-hidden py-20 bg-gray-50 dark:bg-gray-900">
                    <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                        <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
                            <h2 className="font-medium text-dark dark:text-white text-2xl">
                                Your Cart
                            </h2>
                            <button
                                onClick={clearCart}
                                className="text-primary hover:underline text-sm"
                            >
                                Clear Shopping Cart
                            </button>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                            <div className="w-full overflow-x-auto">
                                <div className="min-w-[1170px]">
                                    {/* Table header */}
                                    <div className="flex items-center py-5.5 px-7.5 border-b border-gray-200 dark:border-gray-700">
                                        <div className="min-w-[400px]">
                                            <p className="text-dark dark:text-white font-medium text-sm">
                                                Product
                                            </p>
                                        </div>
                                        <div className="min-w-[180px]">
                                            <p className="text-dark dark:text-white font-medium text-sm">
                                                Price
                                            </p>
                                        </div>
                                        <div className="min-w-[275px]">
                                            <p className="text-dark dark:text-white font-medium text-sm">
                                                Quantity
                                            </p>
                                        </div>
                                        <div className="min-w-[200px]">
                                            <p className="text-dark dark:text-white font-medium text-sm">
                                                Subtotal
                                            </p>
                                        </div>
                                        <div className="min-w-[50px]">
                                            <p className="text-dark dark:text-white font-medium text-sm text-right">
                                                Action
                                            </p>
                                        </div>
                                    </div>

                                    {/* Cart items */}
                                    {cartItems.map((item) => (
                                        <SingleItem item={item} key={item.id} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11 mt-9">
                            <Discount />
                            <OrderSummary />
                        </div>
                    </div>
                </section>
            ) : (
                <section className="py-20 bg-gray-50 dark:bg-gray-900">
                    <div className="flex flex-col items-center justify-center text-center px-4">
                        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-6">
                            <FiShoppingCart className="text-4xl text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Your cart is empty!
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex justify-center font-medium text-white bg-primary py-3 px-8 rounded-md ease-out duration-200 hover:bg-opacity-90"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </section>
            )}
        </>
    );
};

export default Cart;