"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft, Send } from "lucide-react";

const sendOtpSchema = z.object({
  email: z.string().refine(
    (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{12}$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    },
    "Invalid email or phone number. Use format: test@example.com or 256123123123"
  ),
});

type GetOtpFormData = z.infer<typeof sendOtpSchema>;

interface GetOtpFormProps {
  onSuccess: (data: GetOtpFormData) => void;
  formMutation: any;
}

const GetOtpForm: React.FC<GetOtpFormProps> = ({ onSuccess, formMutation }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<GetOtpFormData>({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: { email: "" },
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<GetOtpFormData | null>(null);

  const onSubmit = (data: GetOtpFormData) => {
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
      {/* Logo */}
      {/* <div className="mb-6 flex justify-center sm:mb-8">
        <Link href="/" className="block">
          <Image
            width={300}
            height={100}
            src="/logos/uhrc-complete-logo.png"
            alt="Uganda Human Rights Commission"
            className="h-16 w-auto dark:hidden sm:h-20 md:h-24"
            priority
          />
          <Image
            width={300}
            height={100}
            src="/logos/uhrc-complete-logo.png"
            alt="Uganda Human Rights Commission"
            className="hidden h-16 w-auto dark:block sm:h-20 md:h-24"
            priority
          />
        </Link>
      </div> */}

      {/* Back Button */}
      <Link
        href="/signin"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sign In
      </Link>

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Forgot Password?
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
          Enter your email or phone number to receive a verification code
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={formMutation?.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 font-semibold text-white transition-all hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50"
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
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Send Verification Code</span>
            </>
          )}
        </button>
      </form>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Confirm Password Reset
            </h3>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to reset your password? If yes, a verification code will be sent to:
            </p>
            <div className="mb-6 rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
              <strong className="text-gray-800 dark:text-white">
                {pendingData?.email}
              </strong>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onConfirmSubmit}
                className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white hover:bg-brand-600"
              >
                Yes, Send Code
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

export default GetOtpForm;