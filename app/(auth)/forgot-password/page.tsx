import ForgotPasswordForm from "./ForgotPasswordForm";
import { Metadata } from "next";

// Forgot Password
export const metadata: Metadata = {
  title: "Forgot Password | Nice House of Plastics Dashboard",
  description:
    "Recover access to your Nice House of Plastics account by resetting your password.",
};

export default function SignUp() {
  return <ForgotPasswordForm />;
}
