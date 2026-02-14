"use client";

import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useShoppingCart } from "@/providers/ShoppingCartProvider";
import CartSidebar from "./CartSidebar";
import numeral from "numeral"; // ✅ Import numeral

const ShoppingCartButton = () => {
    const [cartOpen, setCartOpen] = useState(false);
    const { cartCount, cartTotal } = useShoppingCart();

    return (
        <>
            <button
                onClick={() => setCartOpen(true)}
                className="flex items-center gap-2.5"
            >
                <span className="relative">
                    <FiShoppingCart className="text-primary text-2xl" />
                    {cartCount > 0 && (
                        <span className="flex items-center justify-center font-medium text-xs absolute -right-2 -top-2.5 bg-primary w-4.5 h-4.5 rounded-full text-white">
                            {cartCount > 99 ? "99+" : cartCount}
                        </span>
                    )}
                </span>

                <div>
                    <span className="block text-xs text-dark-4 dark:text-gray-400 uppercase">
                        cart
                    </span>
                    <p className="font-medium text-sm text-dark dark:text-white">
                        {/* ✅ Use numeral to format cartTotal */}
                        UGX {numeral(cartTotal).format("0.[0]a").toUpperCase()}
                        {/* Example: 1200 → 1.2K, 2500000 → 2.5M */}
                    </p>
                </div>
            </button>

            <CartSidebar visible={cartOpen} onHide={() => setCartOpen(false)} />
        </>
    );
};

export default ShoppingCartButton;
