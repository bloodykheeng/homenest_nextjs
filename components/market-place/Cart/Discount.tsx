"use client";

import React, { useState } from "react";
import { FiTag } from "react-icons/fi";

const Discount = () => {
    const [couponCode, setCouponCode] = useState("");

    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Integrate with coupon/discount API
        console.log("Applying coupon:", couponCode);
    };

    return (
        <div className="lg:max-w-[670px] w-full">
            <form onSubmit={handleApplyCoupon}>
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
                    <div className="border-b border-gray-200 dark:border-gray-700 py-5 px-4 sm:px-5.5">
                        <div className="flex items-center gap-2">
                            <FiTag className="text-primary" />
                            <h3 className="text-dark dark:text-white text-sm font-medium">
                                Have a discount code?
                            </h3>
                        </div>
                    </div>

                    <div className="py-8 px-4 sm:px-8.5">
                        <div className="flex flex-wrap gap-4 xl:gap-5.5">
                            <div className="max-w-[426px] w-full">
                                <input
                                    type="text"
                                    name="coupon"
                                    id="coupon"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="Enter coupon code"
                                    className="rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 placeholder:text-gray-400 text-dark dark:text-white w-full py-2.5 px-5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                className="inline-flex font-medium text-white bg-primary py-3 px-8 rounded-md text-sm ease-out duration-200 hover:bg-opacity-90"
                            >
                                Apply Code
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Discount;