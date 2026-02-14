"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { FiClock, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

const validateOtpSchema = z.object({
  email: z.string().min(1, "Email is required"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

type ValidateOtpFormData = z.infer<typeof validateOtpSchema>;

interface ValidateOtpFormProps {
  email: string;
  onSubmitFormData: (data: ValidateOtpFormData) => void;
  formMutation: any;
  handleResetProcess?: () => void;
}

const ValidateOtpForm: React.FC<ValidateOtpFormProps> = ({
  email,
  onSubmitFormData,
  formMutation,
  handleResetProcess,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidateOtpFormData>({
    resolver: zodResolver(validateOtpSchema),
    defaultValues: { email, otp: "" },
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<ValidateOtpFormData | null>(null);
  const [countdown, setCountdown] = useState<number>(600); // 10 minutes
  const [timerExpired, setTimerExpired] = useState<boolean>(false);
  const [timerActive, setTimerActive] = useState<boolean>(true);

  // Timer Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && !timerExpired) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setTimerExpired(true);
            setTimerActive(false);
            if (handleResetProcess) {
              handleResetProcess();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, timerExpired, handleResetProcess]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const onSubmit = (data: ValidateOtpFormData) => {
    if (timerExpired) return;
    setPendingData(data);
    setShowConfirmDialog(true);
  };

  const onConfirmSubmit = () => {
    if (timerExpired || !pendingData) return;
    onSubmitFormData(pendingData);
    setShowConfirmDialog(false);
  };

  return (
    <div>
      {/* Logo (visible on mobile) */}
      <div className="mb-6 flex justify-center lg:hidden">
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
          Enter Verification Code
        </h1>
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
          We&apos;ve sent a 6-digit code to:
        </p>
        <div className="mx-auto mb-4 max-w-sm rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
          <strong className="text-sm text-gray-800 dark:text-white">{email}</strong>
        </div>
      </div>

      {/* Timer Display */}
      <div className="mb-6">
        {!timerExpired ? (
          <div
            className={`rounded-lg p-3 text-center ${countdown <= 60
              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
              }`}
          >
            <div className="flex items-center justify-center gap-2 font-medium">
              <FiClock className="h-4 w-4" />
              Time remaining: {formatTime(countdown)}
            </div>
            {countdown <= 30 && (
              <div className="mt-1 flex items-center justify-center gap-1 text-sm text-red-600 dark:text-red-400">
                <FiAlertTriangle className="h-3 w-3" />
                Hurry! Code will expire soon
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg bg-red-100 p-3 text-center text-red-800 dark:bg-red-900/20 dark:text-red-400">
            <div className="mb-1 flex items-center justify-center gap-2 font-medium">
              <FiAlertTriangle className="h-4 w-4" />
              Code Expired
            </div>
            <div className="mb-2 text-sm">Please request a new verification code</div>
            <button
              onClick={handleResetProcess}
              className="text-sm font-medium text-primary hover:text-primary/80 hover:underline"
            >
              Request New Code
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* OTP Input */}
        <div>
          <label
            htmlFor="otp"
            className="mb-2 block text-center text-sm font-medium text-gray-900 dark:text-white"
          >
            6-Digit Verification Code
          </label>
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="otp"
                type="text"
                maxLength={6}
                placeholder="000000"
                disabled={timerExpired}
                className={`w-full rounded-lg border py-3 text-center text-2xl tracking-widest transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-gray-800 dark:text-white ${errors.otp
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : timerExpired
                    ? "border-gray-300 opacity-50 dark:border-gray-700"
                    : "border-gray-300 dark:border-gray-700"
                  }`}
              />
            )}
          />
          {errors.otp && (
            <p className="mt-1.5 text-center text-xs text-red-500">
              {errors.otp.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={formMutation?.isPending || timerExpired}
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
              <span>Validating...</span>
            </>
          ) : timerExpired ? (
            <>
              <FiAlertTriangle className="h-5 w-5" />
              <span>Code Expired</span>
            </>
          ) : (
            <>
              <FiCheckCircle className="h-5 w-5" />
              <span>Validate Code</span>
            </>
          )}
        </button>
      </form>

      {/* Navigation Links */}
      <div className="mt-6 flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={handleResetProcess}
          className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
        >
          Request New Code
        </button>
        <Link
          href="/signin"
          className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
        >
          Back to Sign In
        </Link>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Confirm Verification Code
            </h3>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to validate this code?
            </p>
            <div className="mb-3 rounded-lg bg-gray-100 p-3 text-center dark:bg-gray-700">
              <strong className="text-2xl text-gray-800 dark:text-white">
                {pendingData?.otp}
              </strong>
            </div>
            <div className="mb-4 text-center">
              <small className="text-gray-600 dark:text-gray-400">
                For account: <strong>{pendingData?.email}</strong>
              </small>
            </div>
            {!timerExpired && (
              <div className="mb-6 text-center">
                <small className="text-primary">
                  Time remaining: <strong>{formatTime(countdown)}</strong>
                </small>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={onConfirmSubmit}
                disabled={timerExpired}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 font-medium text-white hover:bg-primary/90 disabled:opacity-50"
              >
                Yes, Validate
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

export default ValidateOtpForm;