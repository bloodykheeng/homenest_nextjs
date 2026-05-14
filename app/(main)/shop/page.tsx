import { Suspense } from "react";
import Shop from "@/components/market-place/Shop";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shop | HomeNest - Your Home, Made Comfortable",
    description: "Browse our collection of quality household essentials, home décor, and everyday comfort items.",
};

const ShopPage = () => {
    return (
        <main>
            <Suspense>
                <Shop />
            </Suspense>
        </main>
    );
};

export default ShopPage;