import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/providers/ThemeProvider";
import PrimeReactProvider from "@/providers/PrimeReactProvider";
import { PrimeReactToastProvider } from "@/providers/PrimeReactToastProvider";
import TanstackProvider from "@/providers/TanstackProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { SidebarProvider } from "@/providers/SidebarContextProvider";

import { FirebaseNotificationProvider } from "@/providers/FirebaseNotificationProvider"
import { ShoppingCartProvider } from "@/providers/ShoppingCartProvider";

import { cookies } from "next/headers";
import NextJsProgressBar from "@/utils/NextJsProgressBar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "HomeNest | Your Home, Made Comfortable",
  description:
    "HomeNest is an Ecommerce platform offering quality household essentials, home décor, and everyday comfort items — all in one trusted place.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const getCookie = async () => {
    const cookieStore = await cookies();
    return cookieStore.get("theme")?.value;
  };

  const defaultTheme = await getCookie();

  return (
    <html lang="en">
      <head>
        <link
          id="theme-link"
          rel="stylesheet"
          href="/themes/lara-light-blue/theme.css"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextJsProgressBar />
        <ThemeProvider defaultTheme={defaultTheme}>
          <PrimeReactProvider>
            <PrimeReactToastProvider>
              <TanstackProvider>
                <AuthProvider>
                  <FirebaseNotificationProvider>
                    <ShoppingCartProvider>
                      <SidebarProvider>{children}</SidebarProvider>
                    </ShoppingCartProvider>
                  </FirebaseNotificationProvider>
                </AuthProvider>
              </TanstackProvider>
            </PrimeReactToastProvider>
          </PrimeReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

