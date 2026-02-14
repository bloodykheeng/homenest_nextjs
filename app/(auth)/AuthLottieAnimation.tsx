"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
import Image from "next/image";

export default function AuthLottieAnimation() {
    const pathname = usePathname();

    // Function to get the appropriate DotLottie animation path based on route
    const getDotLottieAnimationPath = () => {
        if (pathname.includes("signin")) {
            return "/dot-lottie-files/login-leady.lottie";
        } else if (pathname.includes("signup")) {
            return "/dot-lottie-files/login-leady.lottie";
        } else if (
            pathname.includes("forgot-password") ||
            pathname.includes("reset")
        ) {
            return "/dot-lottie-files/password-authentication.lottie";
        }
        // Default animation
        return "/dot-lottie-files/shopping.lottie";
    };

    // Function to get animation description based on path
    const getAnimationDescription = () => {
        if (pathname.includes("signin")) {
            return "Welcome back! Sign in to access your HomeNest account — browse quality household essentials, home décor, and everyday comfort items.";
        } else if (pathname.includes("signup")) {
            return "Join HomeNest! Create your account to start shopping for quality household essentials and home comfort items.";
        } else if (pathname.includes("forgot-password")) {
            return "Reset your password to regain access to your HomeNest account and continue shopping.";
        } else if (pathname.includes("reset")) {
            return "Create a new password to secure your account and get back to browsing HomeNest.";
        }
        return "Welcome to HomeNest — Your Home, Made Comfortable. Quality household essentials, home décor, and everyday comfort items.";
    };

    // Function to get page title based on path
    const getPageTitle = () => {
        if (pathname.includes("signin")) {
            return "Sign Into HomeNest";
        } else if (pathname.includes("signup")) {
            return "Join HomeNest";
        } else if (pathname.includes("forgot-password")) {
            return "Recover Your Account";
        } else if (pathname.includes("reset")) {
            return "Reset Password";
        }
        return "Welcome to HomeNest";
    };

    return (
        <>
            {/* HomeNest Logo */}
            <div className="mb-6 flex justify-center sm:mb-8">
                <Link href="/" className="block">
                    {/* Light Mode Logo */}
                    <Image
                        width={300}
                        height={100}
                        src="/logos/homenest_dark.png"
                        alt="HomeNest"
                        className="h-16 w-auto dark:hidden sm:h-20 md:h-24 lg:h-28"
                        priority
                    />

                    {/* Dark Mode Logo */}
                    <Image
                        width={300}
                        height={100}
                        src="/logos/homenest_dark.png"
                        alt="HomeNest"
                        className="hidden h-16 w-auto dark:block sm:h-20 md:h-24 lg:h-28"
                        priority
                    />
                </Link>
            </div>

            {/* Page Title */}
            <h1 className="mb-6 text-center text-2xl font-bold text-white dark:text-gray-100 sm:text-3xl lg:text-4xl">
                {getPageTitle()}
            </h1>

            {/* DotLottie Animation */}
            <div className="flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72 lg:h-80 lg:w-80">
                <DotLottieReact
                    src={getDotLottieAnimationPath()}
                    loop
                    autoplay
                    className="h-full w-full"
                />
            </div>

            {/* Description Text */}
            <p className="text-center text-sm leading-relaxed text-gray-300 dark:text-white/70 sm:text-base lg:max-w-lg">
                {getAnimationDescription()}
            </p>

            {/* HomeNest Branding */}
            <div className="mt-4 text-center">
                <p className="text-xs font-medium tracking-wide text-gray-400 dark:text-white/50 sm:text-sm">
                    Your Home, Made Comfortable
                </p>
            </div>
        </>
    );
}