"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import useHandleMutationError from "@/hooks/useHandleMutationError";
import {
  postToPasswordGetOtp,
  postToPasswordValidateOtp,
  postToPasswordResetWithOtp,
} from "@/services/forgot-password/forgot-password-service";

import GetOtpForm from "./widgets/GetOtpForm";
import ValidateOtpForm from "./widgets/ValidateOtpForm";
import ResetPasswordForm from "./widgets/ResetPasswordForm";
import SuccessDialog from "./widgets/SuccessDialog";

export default function HurisForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<"Get_OTP" | "VALIDATE_OTP" | "RESET_PASSWORD">("Get_OTP");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Send OTP Mutation
  const sendOtpMutation = useMutation({
    mutationFn: postToPasswordGetOtp,
    onSuccess: (res) => {
      setStep("VALIDATE_OTP");
    },
  });
  useHandleMutationError(sendOtpMutation.error);

  // Validate OTP Mutation
  const validateOtpMutation = useMutation({
    mutationFn: postToPasswordValidateOtp,
    onSuccess: (res) => {
      setStep("RESET_PASSWORD");
    },
  });
  useHandleMutationError(validateOtpMutation.error);

  // Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: postToPasswordResetWithOtp,
    onSuccess: (res) => {
      setShowSuccessDialog(true);
    },
  });
  useHandleMutationError(resetPasswordMutation.error);

  const handleBackToLogin = () => {
    setShowSuccessDialog(false);
    setStep("Get_OTP");
    setEmail("");
    setOtp("");
    router.push("/signin");
  };

  const handleCloseDialog = () => {
    setShowSuccessDialog(false);
    setStep("Get_OTP");
    setEmail("");
    setOtp("");
  };

  const handleResetProcess = () => {
    setStep("Get_OTP");
    setEmail("");
    setOtp("");
  };

  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="w-full px-6 py-10 sm:px-8 sm:py-12">
          {step === "Get_OTP" && (
            <GetOtpForm
              onSuccess={(formData) => {
                setEmail(formData.email);
                sendOtpMutation.mutate(formData);
              }}
              formMutation={sendOtpMutation}
            />
          )}

          {step === "VALIDATE_OTP" && (
            <ValidateOtpForm
              email={email}
              onSubmitFormData={(data) => {
                setOtp(data.otp);
                validateOtpMutation.mutate(data);
              }}
              formMutation={validateOtpMutation}
              handleResetProcess={handleResetProcess}
            />
          )}

          {step === "RESET_PASSWORD" && (
            <ResetPasswordForm
              email={email}
              otp={otp}
              onSuccess={(data) => {
                resetPasswordMutation.mutate(data);
              }}
              formMutation={resetPasswordMutation}
            />
          )}

          <SuccessDialog
            visible={showSuccessDialog}
            email={email}
            onBackToLogin={handleBackToLogin}
            onClose={handleCloseDialog}
          />
        </div>
      </div>
    </div>
  );
}