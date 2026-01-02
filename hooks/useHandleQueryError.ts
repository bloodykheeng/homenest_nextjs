import { useEffect, useMemo } from "react";
import { useRouter } from "nextjs-toploader/app";
import { useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";

const useHandleQueryError = (query: any) => {
  const { isError, error } = query;

  const primeReactToast = usePrimeReactToast();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Memoize the error object
  const memoizedError = useMemo(() => error, [error]);

  // Utility function to check online status
  const checkInternetConnection = () => {
    if (typeof navigator !== "undefined" && "onLine" in navigator) {
      return navigator.onLine;
    }
    return true; // Assume online if unsupported
  };

  useEffect(() => {
    if (!isError || !memoizedError) return; // Avoid unnecessary execution

    console.log("Error fetching data:", memoizedError);

    const err: any = memoizedError;
    const errorMessage = err?.response?.data?.message;
    // const errorDetails = err?.response?.data?.errors;
    const errorDetails = err?.response?.data?.errors as Record<string, string[]>;

    // Check if the user is offline
    const isOnline = checkInternetConnection();
    if (!isOnline) {
      primeReactToast.warn(
        "You are offline. Please check your internet connection."
      );
      return;
    }

    // Handle unauthenticated case
    if (err?.response?.status === 401 && errorMessage === "Unauthenticated.") {

      // primeReactToast.warn("Session expired. Please log in again."); 
      // queryClient.resetQueries({ queryKey: ["logged-in-user"] }); 
      // queryClient.removeQueries({ queryKey: ["logged-in-user"] }); 
      // queryClient.clear();

      // Clear cookies
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("profile");

      // Define excluded paths
      const excludedPaths = ["/", "/signin", "/signup", "/forgot-password"];

      // Only redirect if not already on excluded paths
      if (!excludedPaths.includes(pathname)) {
        router.push("/signin");
      }
      return;
    }

    // 🔹 Show main error message (with optional "error")
    if (errorMessage) {
      let additionalError = "";
      if (err?.response?.data?.error) {
        additionalError = `Error: ${err.response.data.error}`;
      }
      primeReactToast.error(`${errorMessage} ${additionalError}`.trim());
    }

    // 🔹 Show validation errors (all combined in one toast)
    if (errorDetails && !errorMessage) {
      const formattedErrors = Object.entries(errorDetails)
        .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
        .join("\n");

      primeReactToast.error(formattedErrors);
    }

    // Fallback generic error
    if (!errorMessage && !errorDetails) {
      if (!err?.response) {
        primeReactToast.warn(
          "Unable to connect to the server. Please check your internet connection or contact the administrator."
        );
      } else {
        primeReactToast.error("An error occurred. Please contact admin.");
      }
    }
  }, [isError, memoizedError, pathname, queryClient, router, primeReactToast]);

  return;
};

export default useHandleQueryError;
