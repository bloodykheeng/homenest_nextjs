import { Metadata } from "next";
import Checkout from "@/components/market-place/Checkout";

export const metadata: Metadata = {
    title: "Checkout | HomeNest",
    description: "Complete your order - HomeNest",
};

const CheckoutPage = () => {
    return <Checkout />;
};

export default CheckoutPage;
