// components/Hero/index.tsx
"use client";

import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import FeaturedProducts from "./FeaturedProducts";

const Hero = () => {
  return (
    <section className="w-full overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-30 sm:pt-30 lg:pt-30 bg-gray-50 dark:bg-gray-900">
      <div className="xl:max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          {/* Main Carousel */}
          <div className=" w-full max-w-[330px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[757px]">
            <div className="relative z-1 rounded-[10px] bg-white dark:bg-gray-800 overflow-hidden shadow-lg">
              <HeroCarousel />
            </div>
          </div>

          {/* Featured Products */}
          <div className="xl:max-w-[30%] w-full">
            <FeaturedProducts />
          </div>
        </div>
      </div>

      {/* Hero features */}
      <HeroFeature />
    </section>
  );
};

export default Hero;