import { Metadata } from "next";
import FaqsListing from "./FaqsListing";

export const metadata: Metadata = {
    title: "FAQs - HomeNest | Your Home, Made Comfortable",
    description:
        "Find answers to common questions about shopping on HomeNest — orders, delivery, returns, payments, and more.",
};

const FaqsPage = () => {
    return <FaqsListing />;
};

export default FaqsPage;
