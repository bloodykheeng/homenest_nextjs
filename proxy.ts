import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define role-based route groups - centralized access control
const routeGroups = {
  // Public routes that don't require authentication
  public: [
    "/",
    "/signin",
    "/signup",
    "/forgot-password",
  ],

  // Routes accessible by all authenticated users
  authenticated: [
    "/dashboard",
    "/dashboard/customers",
    "/dashboard/profile",
    "/dashboard/profile/edit",
    "/dashboard/users",
    "/dashboard/user-manual"
  ],


  // System Admin-only routes
  systemAdminOnly: [
    "/dashboard/product-categories",
    "/dashboard/product-subcategories",
    "/dashboard/products",
    "/dashboard/roles",
    "/dashboard/queues",
    "/dashboard/audit-trail"
  ],
};

// Define role groups for easy checking
const roleGroups = {
  systemAdmin: ["System Admin"],
  regionalManagerAndSalesAssoc: ["Regional Manager", "Sales Associate"],
  sellin: ["Sellin Manager", "Sellin Associate"], // Adjust as needed
};

export function proxy(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;
  console.log("🚀 ~ middleware ~ currentPath:", currentPath);

  // Generate nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Get API URL from environment variable
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";
  const connectSrc = apiUrl
    ? `'self' ${apiUrl} https: wss: ws:`
    : "'self' https: wss: ws:";

  const isDevelopment = process.env.NODE_ENV === "development";

  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' ${isDevelopment ? "'unsafe-inline'" : `'nonce-${nonce}'`} https://fonts.googleapis.com;
    img-src 'self' blob: data: ${isDevelopment ? "http: https:" : `https: ${apiUrl}`};
    font-src 'self' https://fonts.gstatic.com data:;
    connect-src ${connectSrc};
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    ${!isDevelopment ? "upgrade-insecure-requests;" : ""}
`;

  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  // Get and parse profile from cookies
  const profileCookie = req.cookies.get("profile")?.value;
  console.log("🚀 ~ middleware ~ profileCookie:", profileCookie);

  let profile = null;
  try {
    profile = profileCookie ? JSON.parse(profileCookie) : null;
  } catch (error) {
    console.log("Invalid profile JSON in cookie:", error);
    profile = null;
  }

  const loggedInUserRole = profile?.role;

  let response: NextResponse;

  // ===============================
  // 1️⃣ Public routes - allow everyone
  // ===============================
  if (routeGroups.public.includes(currentPath)) {
    response = NextResponse.next();
  }
  // ===============================
  // 2️⃣ NOT authenticated
  // ===============================
  else if (!profile) {
    // Redirect all protected routes to signin
    response = NextResponse.redirect(new URL("/signin", req.url));
  }
  // ===============================
  // 3️⃣ Authenticated - Role-based access
  // ===============================
  else if (profile) {
    // Redirect authenticated users from home to dashboard
    if (currentPath === "/") {
      response = NextResponse.redirect(new URL("/dashboard", req.url));
    }
    // Check authenticated routes (accessible by all authenticated users)
    else if (
      routeGroups.authenticated.includes(currentPath) ||
      currentPath.startsWith("/dashboard/profile")
    ) {
      response = NextResponse.next();
    }
    // Check System Admin-only routes
    else if (
      routeGroups.systemAdminOnly.includes(currentPath) ||
      currentPath.startsWith("/dashboard/product-") ||
      currentPath.startsWith("/dashboard/roles") ||
      currentPath.startsWith("/dashboard/queues") ||
      currentPath.startsWith("/dashboard/audit-")
    ) {
      if (roleGroups.systemAdmin.includes(loggedInUserRole)) {
        response = NextResponse.next();
      } else {
        response = NextResponse.rewrite(new URL("/not-found", req.url));
      }
    }
    // Unknown route - 404
    else {
      response = NextResponse.rewrite(new URL("/not-found", req.url));
    }
  }
  // ===============================
  // 4️⃣ Fallback - Not found
  // ===============================
  else {
    response = NextResponse.rewrite(new URL("/not-found", req.url));
  }

  // Add security headers to all responses
  response.headers.set("x-nonce", nonce);
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.delete("X-Powered-By");

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next|_vercel|.*\\..*).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};