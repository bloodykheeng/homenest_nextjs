"use client";

import React from "react";
import Image from "next/image";
import { Avatar } from "primereact/avatar";
import useAuthContext from "@/providers/AuthProvider";

export default function Welcome() {
    const { getUserQuery } = useAuthContext();
    const loggedInUserData = getUserQuery?.data?.data;

    const userName =
        loggedInUserData?.name || loggedInUserData?.username || "Admin";
    const userAvatar = loggedInUserData?.photo_url ?? "";

    return (
        <div className="flex items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">

            {/* Welcome Text */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Welcome back, {userName}.
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Manage your HomeNest store, products, and orders —
                    where comfort starts at home.
                </p>
            </div>

            {/* User Photo or Avatar */}
            {userAvatar ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                    <Image
                        src={userAvatar}
                        alt={userName}
                        width={64}
                        height={64}
                        className="object-cover"
                    />
                </div>
            ) : (
                <Avatar
                    label={userName.charAt(0).toUpperCase()}
                    shape="circle"
                    style={{ backgroundColor: "#F59E0B", color: "#ffffff" }} // warm HomeNest tone
                    size="large"
                />
            )}
        </div>
    );
}
