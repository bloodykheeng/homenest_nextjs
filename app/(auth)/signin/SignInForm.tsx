"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { postTologin } from "@/services/auth/auth-service";
import useHandleMutationError from "@/hooks/useHandleMutationError";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";

import { Button } from "primereact/button";

// Schema validation
const signInSchema = z.object({
    email: z
        .string()
        .refine(
            (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const phoneRegex = /^\d{12}$/; // e.g., 256700000000
                return emailRegex.test(value) || phoneRegex.test(value);
            },
            "Invalid email or phone number. Use format: test@example.com or 256123123123"
        ),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    rememberMe: z.boolean().optional(),
});

type SignInFormInputs = z.infer<typeof signInSchema>;

export default function SignInForm() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormInputs>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const signInMutation = useMutation({
        mutationFn: (variables: SignInFormInputs) => postTologin(variables),
        onSuccess: () => {
            queryClient.invalidateQueries();
            queryClient.invalidateQueries({ queryKey: ["logged-in-user"] });
            router.push("/");
        },
    });

    useHandleMutationError(signInMutation?.error);

    const onSubmit = (data: SignInFormInputs) => {
        signInMutation.mutate(data);
    };

    return (
        <div className="w-full px-6 py-10 sm:px-8 sm:py-12 max-w-md">
            {/* Brand / Back to Home */}
            <div className="mb-6 text-center">
                <Link href="/" className="inline-block">
                    <Image
                        src="/logos/homenest_light.png"
                        alt="HomeNest"
                        width={140}
                        height={40}
                        className="w-auto h-10 dark:hidden"
                    />
                    <Image
                        src="/logos/homenest_dark.png"
                        alt="HomeNest"
                        width={140}
                        height={40}
                        className="hidden w-auto h-10 dark:block"
                    />
                </Link>
            </div>

            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                    Welcome Back
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
                    Sign in to continue shopping at HomeNest
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email/Phone Input */}
                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Email or Phone Number
                    </label>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <input
                                    {...field}
                                    id="email"
                                    type="text"
                                    placeholder="Enter your email or phone"
                                    className={`w-full rounded-lg border py-3 pl-10 pr-4 text-gray-900 transition-colors placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 ${errors.email
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                        : "border-gray-300 dark:border-gray-700"
                                        }`}
                                />
                            </div>
                        )}
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
                    )}
                </div>

                {/* Password Input */}
                <div>
                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Password
                    </label>
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <input
                                    {...field}
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className={`w-full rounded-lg border py-3 pl-10 pr-12 text-gray-900 transition-colors placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 ${errors.password
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                        : "border-gray-300 dark:border-gray-700"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <FiEyeOff className="h-5 w-5" />
                                    ) : (
                                        <FiEye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        )}
                    />
                    {errors.password && (
                        <p className="mt-1.5 text-xs text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <Controller
                        name="rememberMe"
                        control={control}
                        render={({ field }) => (
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="h-4 w-4 rounded border-gray-300 text-primary transition-colors focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Remember me
                                </span>
                            </label>
                        )}
                    />
                    <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center w-full">
                    <Button
                        type="submit"
                        label={signInMutation.isPending ? "Signing in..." : "Sign In"}
                        icon={<FiLogIn className="h-5 w-5" />}
                        loading={signInMutation.isPending}
                        disabled={signInMutation.isPending || isSubmitting}
                        className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition-all hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
            </form>

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                    href="/signup"
                    className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
                >
                    Sign up
                </Link>
            </p>

            {/* Footer Info */}
            <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                <p className="text-center text-xs text-gray-600 dark:text-gray-400">
                    By signing in, you agree to HomeNest&apos;s Terms of Service and Privacy Policy.
                    Your data is protected and secure.
                </p>
            </div>
        </div>
    );
}