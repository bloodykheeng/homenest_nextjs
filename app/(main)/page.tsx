import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";

import ScrollUp from "@/components/common/ScrollUp";
import Hero from "@/components/market-place/home/Hero";
import Categories from "@/components/market-place/home/Categories";
import NewArrival from "@/components/market-place/home/NewArrivals";
import PromoBanner from "@/components/market-place/home/PromoBanner";
import BestSeller from "@/components/market-place/home/BestSeller";
import CounDown from "@/components/market-place/home/Countdown";
import Newsletter from "@/components/market-place/home/Newsletter";
import {
  serverFetchProducts,
  serverFetchProductCategories,
} from "@/services/server/server-fetcher";

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
    "Affordable Home Products",
  ],
  robots: "index, follow",
};

export default async function Home() {
  const queryClient = new QueryClient();

  // Prefetch all landing-page queries in parallel.
  // Using allSettled so a single failing endpoint doesn't block the page.
  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: ["products", "featured"],
      queryFn: () => serverFetchProducts({ featured: true }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["product-categories"],
      queryFn: () => serverFetchProductCategories(),
    }),
    queryClient.prefetchQuery({
      queryKey: ["products", "new-arrivals"],
      queryFn: () =>
        serverFetchProducts({ sort_by: "created_at", sort_order: "desc", per_page: 8 }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["products", "best-sellers"],
      queryFn: () => serverFetchProducts({ bestSeller: true, per_page: 6 }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["products", "deal-of-the-day"],
      queryFn: () => serverFetchProducts({ dealOfTheDay: true, per_page: 1 }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ScrollUp />
      <Hero />
      <Categories />
      <NewArrival />
      <PromoBanner />
      <BestSeller />
      <CounDown />
      {/* <Testimonials /> */}
      <Newsletter />
    </HydrationBoundary>
  );
}
