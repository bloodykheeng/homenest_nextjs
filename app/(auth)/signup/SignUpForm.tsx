"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { postToRegister } from "@/services/auth/auth-service";
import useHandleMutationError from "@/hooks/useHandleMutationError";
import { Mail, Lock, Eye, EyeOff, User, UserPlus } from "lucide-react";

import { Button } from 'primereact/button';

// Schema validation
const signUpSchema = z
    .object({
        fullName: z
            .string()
            .min(2, "Full name must be at least 2 characters")
            .max(100, "Full name must be less than 100 characters"),
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
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Password must contain at least one uppercase letter, one lowercase letter, and one number"
            ),
        confirmPassword: z.string(),
        agreeToTerms: z
            .boolean()
            .refine((val) => val === true, "You must agree to the terms and conditions"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type SignUpFormInputs = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormInputs>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            agreeToTerms: false,
        },
    });

    const signUpMutation = useMutation({
        mutationFn: (variables: SignUpFormInputs) => postToRegister(variables),
        onSuccess: (data) => {
            queryClient.invalidateQueries();
            queryClient.invalidateQueries({ queryKey: ["logged-in-user"] });
            router.push("/dashboard");
        },
    });

    useHandleMutationError(signUpMutation?.error);

    const onSubmit = (data: SignUpFormInputs) => {
        signUpMutation.mutate(data);
    };

    return (
        <div className="w-full px-6 py-10 sm:px-8 sm:py-12 min-h-[400px]">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                    Create Your Account
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
                    Join HURIS to manage human rights cases efficiently
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Full Name Input */}
                    <div>
                        <label
                            htmlFor="fullName"
                            className="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Full Name
                        </label>
                        <Controller
                            name="fullName"
                            control={control}
                            render={({ field }) => (
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <input
                                        {...field}
                                        id="fullName"
                                        type="text"
                                        placeholder="Enter your full name"
                                        className={`w-full rounded-lg border py-3 pl-10 pr-4 text-gray-900 transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 ${errors.fullName
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                            : "border-gray-300 dark:border-gray-700"
                                            }`}
                                    />
                                </div>
                            )}
                        />
                        {errors.fullName && (
                            <p className="mt-1.5 text-xs text-red-500">{errors.fullName.message}</p>
                        )}
                    </div>

                    {/* Email/Phone Input */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Work Email or Phone Number
                        </label>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <input
                                        {...field}
                                        id="email"
                                        type="text"
                                        placeholder="Enter your email or phone"
                                        className={`w-full rounded-lg border py-3 pl-10 pr-4 text-gray-900 transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 ${errors.email
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
                            className="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Password
                        </label>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <input
                                        {...field}
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        className={`w-full rounded-lg border py-3 pl-10 pr-12 text-gray-900 transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 ${errors.password
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
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
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

                    {/* Confirm Password Input */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Confirm Password
                        </label>
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <input
                                        {...field}
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        className={`w-full rounded-lg border py-3 pl-10 pr-12 text-gray-900 transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 ${errors.confirmPassword
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                            : "border-gray-300 dark:border-gray-700"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                                        aria-label={
                                            showConfirmPassword ? "Hide password" : "Show password"
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            )}
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>
                </div>


                {/* Terms and Conditions Checkbox */}
                <div>
                    <Controller
                        name="agreeToTerms"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <label className="flex cursor-pointer items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={field.onChange}
                                        className={`mt-0.5 h-4 w-4 flex-shrink-0 rounded border-gray-300 text-brand-500 transition-colors focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 ${errors.agreeToTerms ? "border-red-500" : ""
                                            }`}
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        By creating an account, you agree to the{" "}
                                        <Link
                                            href="/terms"
                                            className="font-medium text-brand-500 hover:text-brand-600 hover:underline"
                                        >
                                            Terms and Conditions
                                        </Link>{" "}
                                        and{" "}
                                        <Link
                                            href="/privacy"
                                            className="font-medium text-brand-500 hover:text-brand-600 hover:underline"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </span>
                                </label>
                                {errors.agreeToTerms && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {errors.agreeToTerms.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    <Button
                        type="submit"
                        label={signUpMutation.isPending ? ' Creating account...' : ' Create Account'}
                        icon={signUpMutation.isPending ? 'pi pi-spin pi-spinner' : <UserPlus className="mr-2" />}
                        disabled={signUpMutation.isPending || isSubmitting}
                        className="p-3 font-semibold"
                    />
                </div>
            </form>

            {/* Sign In Link */}
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                    href="/signin"
                    className="font-medium text-brand-500 transition-colors hover:text-brand-600 hover:underline"
                >
                    Sign in
                </Link>
            </p>

            {/* Footer Info */}
            <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                <p className="text-center text-xs text-gray-600 dark:text-gray-400">
                    This system is for authorized users only. Unauthorized access is
                    prohibited and will be prosecuted.
                </p>
            </div>
        </div>
    );
}