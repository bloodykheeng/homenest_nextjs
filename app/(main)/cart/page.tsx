import React from "react";
import Cart from "@/components/market-place/Cart";

import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Cart | Home Nest",
    description: "Your shopping cart - Home Nest",
};

const CartPage = () => {
    return (
        <>
            <Cart />
        </>
    );
};

export default CartPage;