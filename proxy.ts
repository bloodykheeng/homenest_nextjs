import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define role-based route groups
const routeGroups = {
  // Public routes that don't require authentication
  public: [
    "/",
    "/signin",
    "/signup",
    "/forgot-password",
    "/dashboard",
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
  regionalManagerAndSalesAssoc: [

    "/dashboard/customer-visits",
    "/dashboard/sellout-orders",
    "/dashboard/sellout-order-transactions",
    "/dashboard/customer-stock-counts",
    "/dashboard/sellout-journey-plans",
    "/dashboard/customer-merchandises",

  ],

  // Routes for sellin roles
  sellinOnly: [

  ],
  // Routes accessible only by system admin
  systemAdminOnly: [

    "/dashboard/districts",
    "/dashboard/counties",
    "/dashboard/subcounties",
    "/dashboard/parishes",
    "/dashboard/villages",


    "/dashboard/roles",
    "/dashboard/queues",
    "/dashboard/audit-trail"
  ],
  // Routes specific to CSO roles

};

export function proxy(req: NextRequest) {
  // Get profile from cookies
  const profileCookie = req.cookies.get("profile")?.value ?? "";
  console.log("🚀 ~ middleware ~ profileCookie:", profileCookie)

  //   Parse the profile to get the user role
  let profile;
  try {
    profile = JSON.parse(profileCookie);
  } catch (error) {
    // // Invalid cookie format, redirect to not found
    // return NextResponse.rewrite(new URL("/not-found", req.url));
    console.log("Invalid profile JSON in cookie:", error);
    profile = null; // fallback if JSON parsing fails
  }

  const loggedInUserRole = profile?.role;

  // Define role groups
  const systemAdminRoles = ["System Admin"];



  // Get current path
  const currentPath = req.nextUrl.pathname;
  console.log("🚀 ~ middleware ~ currentPath:", currentPath);
  const searchParams = req.nextUrl.searchParams;

  if (!profile) {
    // Check if it's a public route that doesn't require authentication
    if (routeGroups.public.includes(currentPath)) {
      return NextResponse.next();
    }

    // // If on home page "/", go to signin
    // if (currentPath === "/") {
    //   return NextResponse.redirect(new URL("/signin", req.url));
    // }

    // //if no match just give not found
    // return NextResponse.rewrite(new URL("/signin", req.url));

    return NextResponse.redirect(new URL("/", req.url));
  }

  if (profile) {

    // If on home page "/", go to dashboard
    if (currentPath === "/") {
      // return NextResponse.redirect(new URL("/dashboard", req.url));
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Check if path is in authenticated routes (accessible by all authenticated users)
    if (routeGroups.authenticated.includes(currentPath)) {
      return NextResponse.next();
    }




    // Check System Admin-only routes
    if (routeGroups.systemAdminOnly.includes(currentPath)) {
      if (systemAdminRoles.includes(loggedInUserRole)) {
        return NextResponse.next();
      } else {
        return NextResponse.rewrite(new URL("/not-found", req.url));
      }
    }



    // If the path is not one of the expected ones, rewrite to not-found
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}



export const config = {
  matcher: ["/", "/dashboard/:path*"], // applies to ALL routes
};