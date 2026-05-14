import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        laravelAccessToken?: string;
        laravelRefreshToken?: string;
        laravelUser?: Record<string, any>;
        socialLoginError?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        laravelAccessToken?: string;
        laravelRefreshToken?: string;
        laravelUser?: Record<string, any>;
        socialLoginError?: string;
    }
}
