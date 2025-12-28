"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";

import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { usePrimeReactToast } from "./PrimeReactToastProvider";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getUserService, postToLogout } from "@/services/auth/auth-service";

import Cookies from "js-cookie";

import useHandleQueryError from "@/hooks/useHandleQueryError";

const AuthContext = createContext<any>({});

export const AuthProvider = ({ children }: { children: any }) => {
  const primeReactToast = usePrimeReactToast();
  const queryClient = useQueryClient();

  const pathname = usePathname();
  // console.log("🚀 ~ AuthProvider ~ pathname:", pathname)

  const router = useRouter();

  // The signal is an instance of the AbortSignal interface provided by tanstack,
  // which is used to communicate with a AbortController to signal that an operation should be aborted.
  const getUserQuery: any = useQuery({
    queryKey: ["logged-in-user"],
    queryFn: getUserService,
    retry: false,
  });

  // console.log("🚀 ~ AuthProvider logged in User ~ getUserQuery:", getUserQuery);

  useHandleQueryError(getUserQuery);

  // Logout mutation function
  const logoutMutation = useMutation({
    mutationFn: postToLogout,
    onSuccess: () => {
      // Clear authentication cookies
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("profile");

      // Reset user state
      queryClient.resetQueries({ queryKey: ["logged-in-user"] });
      queryClient.removeQueries({ queryKey: ["logged-in-user"] });
      queryClient.clear();

      // // Redirect to login page
      // router.push("/login");
      router.push("/signin");
      // Show success toast
      // toast.success("Goodbye 👋");
      primeReactToast.success("Goodbye 👋");
    },
    onError: (error) => {
      console.log("Logout error:", error);

      // Clear cookies in case of error
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("profile");

      // Redirect to login page
      router.push("/signin");
      window.location.reload();
    },
  });

  return (
    <AuthContext.Provider
      value={{
        getUserQuery,
        logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuthContext() {
  return useContext(AuthContext);
}
