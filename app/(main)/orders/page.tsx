import { Metadata } from "next";
import Orders from "@/components/market-place/Orders";

export const metadata: Metadata = {
    title: "My Orders | HomeNest",
    description: "View and track your orders - HomeNest",
};

const OrdersPage = () => {
    return <Orders />;
};

export default OrdersPage;
