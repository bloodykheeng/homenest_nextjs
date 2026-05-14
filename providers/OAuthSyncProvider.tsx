"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import axiosAPI from "@/services/axiosApi";
import { usePrimeReactToast } from "./PrimeReactToastProvider";

export function OAuthSyncProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();

    useEffect(() => {
        const laravelToken = session?.laravelAccessToken;
        const error = session?.socialLoginError;

        if (error) {
            primeReactToast.error(error);
            return;
        }

        if (laravelToken && !Cookies.get("access_token")) {
            Cookies.set("access_token", laravelToken, { expires: 7 });

            const refreshToken = session?.laravelRefreshToken;
            if (refreshToken) Cookies.set("refresh_token", refreshToken, { expires: 7 });

            axiosAPI.defaults.headers.Authorization = `Bearer ${laravelToken}`;

            const user = session?.laravelUser;
            if (user) {
                Cookies.set(
                    "profile",
                    JSON.stringify({
                        id: user.id,
                        name: user.name,
                        role: user.role,
                        email: user.email,
                        access_token: laravelToken,
                    }),
                    { expires: 7 }
                );
            }

            queryClient.invalidateQueries({ queryKey: ["logged-in-user"] });
        }
    }, [session]);

    return <>{children}</>;
}
