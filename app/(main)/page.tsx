import ScrollUp from "@/components/common/ScrollUp";
import Hero from "@/components/market-place/home/Hero";
import Categories from "@/components/market-place/home/Categories";
import NewArrival from "@/components/market-place/home/NewArrivals";
import PromoBanner from "@/components/market-place/home/PromoBanner";
import BestSeller from "@/components/market-place/home/BestSeller";
import CounDown from "@/components/market-place/home/Countdown";
import Testimonials from "@/components/market-place/home/Testimonials";
import Newsletter from "@/components/market-place/home/Newsletter";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "HomeNest | Premium Home Essentials & Décor Store",
  description:
    "HomeNest is a trusted eCommerce platform offering premium household essentials, stylish home décor, kitchenware, bedding, and everyday comfort products — all designed to make your home beautiful and comfortable.",
  keywords: [
    "HomeNest",
    "Home Essentials",
    "Home Décor",
    "Kitchenware",
    "Bedding",
    "Household Items",
    "Online Home Store",
    "Comfort Living",
    "Affordable Home Products"
  ],
  robots: "index, follow",
};



export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Categories />
      <NewArrival />
      <PromoBanner />
      <BestSeller />
      <CounDown />
      <Testimonials />
      <Newsletter />
    </>
  );
}
