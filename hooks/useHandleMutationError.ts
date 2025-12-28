"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "nextjs-toploader/app";
import { useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import Cookies from "js-cookie";

// const sampleData = {
//   "message": "Invalid agent visit",
//   "errors": {
//     "agent_visit_id": ["The check-in date must be before now."],
//     "order_date": ["The order date field is required."]
//   }
// }

interface ApiErrorResponse {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
      errors?: Record<string, string[]>; // Laravel-style validation errors
    };
  };
}

const useHandleMutationError = (error: ApiErrorResponse | Error | null) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const primeReactToast = usePrimeReactToast();

  // Memoize the error object
  const memoizedError = useMemo(() => error, [error]);

  // Utility function to check online status
  const checkInternetConnection = () => {
    if (typeof navigator !== "undefined" && "onLine" in navigator) {
      return navigator.onLine;
    }
    return true;
  };

  useEffect(() => {
    if (!memoizedError) return;

    const err = memoizedError as ApiErrorResponse;
    console.log("🚀 ~ useHandleMutationError ~ err:", err)
    const errorMessage = err?.response?.data?.message;
    const errorDetails = err?.response?.data?.errors;

    // Check if the user is offline
    const isOnline = checkInternetConnection();
    if (!isOnline) {
      primeReactToast.warn(
        "You are offline. Please check your internet connection."
      );
      return;
    }

    if (errorMessage === "Unauthenticated.") {
      // primeReactToast.warn("Session expired. Please log in again.");
      queryClient.resetQueries({ queryKey: ["logged-in-user"] });
      queryClient.removeQueries({ queryKey: ["logged-in-user"] });
      queryClient.clear();

      // Clear cookies in case of error
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("profile");

      router.push("/");
      return;
    }

    if (errorMessage || errorDetails) {
      if (errorMessage) {
        let additionalError = "";
        if (err?.response?.data?.error) {
          additionalError = `Error: ${err?.response?.data?.error}`;
        }
        primeReactToast.error(`${errorMessage} ${additionalError}`.trim());
      }


      if (errorDetails && !errorMessage) {
        const formattedErrors = Object.entries(errorDetails)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n");

        primeReactToast.error(formattedErrors);
      }

      return;
    }

    if (!err?.response) {
      primeReactToast.warn(
        "Unable to connect to the server. Please check your internet connection or contact the administrator."
      );
    } else {
      primeReactToast.error("An error occurred. Please contact admin.");
    }
  }, [memoizedError]);
};

export default useHandleMutationError;
