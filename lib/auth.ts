import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            // On first sign-in after OAuth, exchange for Sanctum tokens
            if (account && account.provider !== "credentials") {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                    const res = await fetch(`${apiUrl}/social-login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        body: JSON.stringify({
                            provider: account.provider,
                            provider_id: account.providerAccountId,
                            provider_access_token: account.access_token,
                            email: token.email,
                            name: token.name,
                            photo_url: token.picture,
                        }),
                    });

                    if (res.ok) {
                        const data = await res.json();
                        token.laravelAccessToken = data.access_token;
                        token.laravelRefreshToken = data.data?.refresh_token;
                        token.laravelUser = data.data;
                    } else {
                        token.socialLoginError = "Social login failed on the server";
                    }
                } catch (e) {
                    console.error("[NextAuth] Social login API error:", e);
                    token.socialLoginError = "Could not connect to auth server";
                }
            }
            return token;
        },
        async session({ session, token }) {
            (session as any).laravelAccessToken = token.laravelAccessToken;
            (session as any).laravelRefreshToken = token.laravelRefreshToken;
            (session as any).laravelUser = token.laravelUser;
            (session as any).socialLoginError = token.socialLoginError;
            return session;
        },
    },
    pages: {
        signIn: "/signin",
        error: "/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
