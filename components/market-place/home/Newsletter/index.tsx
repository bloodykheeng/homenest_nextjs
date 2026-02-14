"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FiSend, FiMail, FiCheck, FiLoader } from "react-icons/fi";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import { postNewsletterSubscription } from "@/services/newsletter/newsletter-service";

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const primeReactToast = usePrimeReactToast();

    const subscribeMutation = useMutation({
        mutationFn: postNewsletterSubscription,
        onSuccess: () => {
            primeReactToast.success("Subscribed successfully! 🎉");
            setEmail("");
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message || "Failed to subscribe. Please try again.";
            primeReactToast.error(message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            primeReactToast.warn("Please enter your email address.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            primeReactToast.warn("Please enter a valid email address.");
            return;
        }

        subscribeMutation.mutate({ email });
    };

    return (
        <section className="overflow-hidden">
            <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
                <div className="relative z-1 overflow-hidden rounded-xl bg-primary">
                    {/* Decorative elements */}
                    <div className="absolute -z-1 w-full h-full left-0 top-0 bg-gradient-to-r from-primary via-primary to-primary/80"></div>
                    <div className="absolute -z-1 top-0 right-0 w-1/2 h-full opacity-10">
                        <div className="absolute top-4 right-10 w-32 h-32 rounded-full border-2 border-white/30"></div>
                        <div className="absolute bottom-4 right-32 w-20 h-20 rounded-full border-2 border-white/20"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 right-48 w-48 h-48 rounded-full border border-white/10"></div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 px-4 sm:px-8 xl:pl-12 xl:pr-14 py-10 sm:py-12">
                        {/* Content */}
                        <div className="max-w-[491px] w-full">
                            <div className="flex items-center gap-2 mb-3">
                                <FiMail className="text-white/80 text-xl" />
                                <span className="text-white/80 text-sm font-medium">Newsletter</span>
                            </div>
                            <h2 className="max-w-[399px] text-white font-bold text-lg sm:text-xl xl:text-3xl mb-3">
                                Don&apos;t Miss Out Latest Trends &amp; Offers
                            </h2>
                            <p className="text-white/80 text-sm sm:text-base">
                                Register to receive news about the latest offers &amp; discount codes
                            </p>
                        </div>

                        {/* Form */}
                        <div className="max-w-[477px] w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    <div className="relative flex-1">
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            disabled={subscribeMutation.isPending}
                                            className="w-full bg-white dark:bg-gray-800 border border-transparent outline-none rounded-md text-dark dark:text-white placeholder:text-gray-400 py-3 pl-10 pr-5 focus:ring-2 focus:ring-white/30 transition-all disabled:opacity-60"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={subscribeMutation.isPending}
                                        className="inline-flex items-center justify-center gap-2 py-3 px-6 sm:px-7 text-primary bg-white font-medium rounded-md hover:bg-gray-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {subscribeMutation.isPending ? (
                                            <>
                                                <FiLoader className="text-base animate-spin" />
                                                Subscribing...
                                            </>
                                        ) : subscribeMutation.isSuccess ? (
                                            <>
                                                <FiCheck className="text-base" />
                                                Subscribed
                                            </>
                                        ) : (
                                            <>
                                                <FiSend className="text-base" />
                                                Subscribe
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                            <p className="text-white/50 text-xs mt-3">
                                We respect your privacy. Unsubscribe at any time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;