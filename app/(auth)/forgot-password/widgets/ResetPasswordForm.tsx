"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiKey,
  FiCheckCircle,
  FiCircle,
  FiAlertTriangle,
} from "react-icons/fi";

const resetPasswordSchema = z
  .object({
    email: z.string().min(1, "Email is required"),
    otp: z.string().min(1, "OTP is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    password_confirmation: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  email: string;
  otp: string;
  onSuccess: (data: ResetPasswordFormData) => void;
  formMutation: any;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  email,
  otp,
  onSuccess,
  formMutation,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email,
      otp,
      password: "",
      password_confirmation: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<ResetPasswordFormData | null>(null);

  const password = watch("password");

  const getPasswordStrength = (password: string) => {
    if (!password) return { level: 0, label: "Enter password", color: "text-gray-400" };
    if (password.length < 6) return { level: 1, label: "Weak", color: "text-red-500" };
    if (password.length < 8) return { level: 2, label: "Fair", color: "text-orange-500" };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { level: 4, label: "Strong", color: "text-green-500" };
    }
    return { level: 3, label: "Good", color: "text-blue-500" };
  };

  const passwordStrength = getPasswordStrength(password || "");

  const onSubmit = (data: ResetPasswordFormData) => {
    setPendingData(data);
    setShowConfirmDialog(true);
  };

  const onConfirmSubmit = () => {
    if (pendingData) {
      onSuccess(pendingData);
      setShowConfirmDialog(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Create New Password
        </h1>
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
          Create a strong password for:
        </p>
        <div className="mx-auto mb-4 max-w-sm rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
          <strong className="text-sm text-gray-800 dark:text-white">{email}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* New Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            New Password
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
                  placeholder="Create a strong password"
                  className={`w-full rounded-lg border py-3 pl-10 pr-12 text-gray-900 transition-colors placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 ${errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 dark:border-gray-700"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
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
            <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="password_confirmation"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Confirm Password
          </label>
          <Controller
            name="password_confirmation"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  {...field}
                  id="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={`w-full rounded-lg border py-3 pl-10 pr-12 text-gray-900 transition-colors placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 ${errors.password_confirmation
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 dark:border-gray-700"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            )}
          />
          {errors.password_confirmation && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        {/* Password Strength */}
        {password && (
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <small className={`font-medium ${passwordStrength.color}`}>
              Password Strength: {passwordStrength.label}
            </small>
          </div>
        )}

        {/* Password Requirements */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <small className="mb-3 block font-medium text-gray-600 dark:text-gray-400">
            Password requirements:
          </small>
          <ul className="space-y-2 text-sm">
            <li
              className={`flex items-center gap-2 ${password?.length >= 8 ? "text-green-600" : "text-gray-400"
                }`}
            >
              {password?.length >= 8 ? (
                <FiCheckCircle className="h-4 w-4" />
              ) : (
                <FiCircle className="h-4 w-4" />
              )}
              At least 8 characters long
            </li>
            <li
              className={`flex items-center gap-2 ${/[A-Z]/.test(password || "") ? "text-green-600" : "text-gray-400"
                }`}
            >
              {/[A-Z]/.test(password || "") ? (
                <FiCheckCircle className="h-4 w-4" />
              ) : (
                <FiCircle className="h-4 w-4" />
              )}
              Contains uppercase letter (recommended)
            </li>
            <li
              className={`flex items-center gap-2 ${/[0-9]/.test(password || "") ? "text-green-600" : "text-gray-400"
                }`}
            >
              {/[0-9]/.test(password || "") ? (
                <FiCheckCircle className="h-4 w-4" />
              ) : (
                <FiCircle className="h-4 w-4" />
              )}
              Contains number (recommended)
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={formMutation?.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-white transition-all hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {formMutation?.isPending ? (
            <>
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Resetting Password...</span>
            </>
          ) : (
            <>
              <FiKey className="h-5 w-5" />
              <span>Reset Password</span>
            </>
          )}
        </button>
      </form>

      {/* Navigation Links */}
      <div className="mt-6 flex items-center justify-between text-sm">
        <Link
          href="/signin"
          className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
        >
          Back to Sign In
        </Link>
        <Link
          href="/"
          className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
        >
          Back to Home
        </Link>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Confirm Password Reset
            </h3>
            <p className="mb-3 text-center text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to reset the password for:
            </p>
            <div className="mb-4 rounded-lg bg-gray-100 p-3 text-center dark:bg-gray-700">
              <strong className="text-gray-800 dark:text-white">
                {pendingData?.email}
              </strong>
            </div>
            <div className="mb-6 rounded-lg bg-orange-50 p-3 dark:bg-orange-900/20">
              <small className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                <FiAlertTriangle className="h-4 w-4 text-orange-500" />
                This action will permanently change your password.
              </small>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onConfirmSubmit}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 font-medium text-white hover:bg-primary/90"
              >
                Yes, Reset Password
              </button>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordForm;