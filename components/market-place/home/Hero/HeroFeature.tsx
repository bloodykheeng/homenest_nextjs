// components/Hero/HeroFeature.tsx
import React from "react";
import { FiTruck, FiRefreshCw, FiShield, FiHeadphones } from "react-icons/fi";

const featureData = [
    {
        icon: FiTruck,
        title: "Free Shipping",
        description: "For all orders UGX 200,000",
    },
    {
        icon: FiRefreshCw,
        title: "Easy Returns",
        description: "Hassle-free returns",
    },
    {
        icon: FiShield,
        title: "100% Secure Payments",
        description: "Guarantee secure payments",
    },
    {
        icon: FiHeadphones,
        title: "24/7 Support",
        description: "Anywhere & anytime",
    },
];

const HeroFeature = () => {
    return (
        <div className="max-w-[1060px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex flex-wrap items-center gap-7.5 xl:gap-12.5 mt-10">
                {featureData.map((item, key) => {
                    const Icon = item.icon;
                    return (
                        <div className="flex items-center gap-4" key={key}>
                            <div className="w-10 h-10 flex items-center justify-center text-primary">
                                <Icon className="w-10 h-10" />
                            </div>

                            <div>
                                <h3 className="font-medium text-lg text-dark dark:text-white">{item.title}</h3>
                                <p className="text-sm text-body-color dark:text-gray-400">{item.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HeroFeature;