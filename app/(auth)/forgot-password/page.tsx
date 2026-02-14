import ForgotPasswordForm from "./ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | HomeNest",
  description:
    "Recover access to your HomeNest account by resetting your password.",
};

export default function ForgotPassword() {
  return <ForgotPasswordForm />;
}