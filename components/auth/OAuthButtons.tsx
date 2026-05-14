"use client";
import { signIn } from "next-auth/react";
import { FaGoogle, FaGithub, FaFacebook } from "react-icons/fa";
import { useState } from "react";

const providers = [
    {
        id: "google",
        label: "Continue with Google",
        Icon: FaGoogle,
        className: "border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-300",
        iconClass: "text-red-500",
    },
    {
        id: "github",
        label: "Continue with GitHub",
        Icon: FaGithub,
        className: "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700",
        iconClass: "text-gray-800 dark:text-white",
    },
    {
        id: "facebook",
        label: "Continue with Facebook",
        Icon: FaFacebook,
        className: "border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-300",
        iconClass: "text-blue-600",
    },
] as const;

export default function OAuthButtons({ callbackUrl = "/" }: { callbackUrl?: string }) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleSignIn = async (providerId: string) => {
        setLoading(providerId);
        await signIn(providerId, { callbackUrl });
        setLoading(null);
    };

    return (
        <div className="space-y-3">
            {providers.map(({ id, label, Icon, className, iconClass }) => (
                <button
                    key={id}
                    onClick={() => handleSignIn(id)}
                    disabled={!!loading}
                    className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
                >
                    {loading === id ? (
                        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    ) : (
                        <Icon className={`text-lg ${iconClass}`} />
                    )}
                    {label}
                </button>
            ))}
        </div>
    );
}
