"use client";

import Link from "next/link";
import Image from "next/image";
import { FiEdit2, FiMail, FiPhone, FiMapPin, FiUser, FiBell, FiBellOff } from "react-icons/fi";
import { ProgressSpinner } from "primereact/progressspinner";
import useAuthContext from "@/providers/AuthProvider";

const DetailRow = ({ label, value }: { label: string; value?: string | null }) => {
    if (!value) return null;
    return (
        <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
            <p className="text-sm font-medium text-dark dark:text-white">{value}</p>
        </div>
    );
};

const ProfileViewPage = () => {
    const { getUserQuery } = useAuthContext();
    const user = getUserQuery?.data?.data;

    if (getUserQuery?.isPending) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="4" />
            </div>
        );
    }

    return (
        <section className="pb-20 pt-28 lg:pt-32 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-[860px] mx-auto px-4 sm:px-8 xl:px-0">

                {/* ── Header Card ─────────────────────────────────────── */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            {user?.photo_url ? (
                                <Image
                                    src={user.photo_url}
                                    alt={user.name ?? "Profile photo"}
                                    width={90}
                                    height={90}
                                    className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center border-2 border-primary/30">
                                    <FiUser className="text-primary text-3xl" />
                                </div>
                            )}
                        </div>

                        {/* Name / Email / Role */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-bold text-dark dark:text-white truncate">
                                {user?.name ?? "—"}
                            </h1>
                            {user?.username && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                            )}
                            <span className="inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                                {user?.role ?? "Customer"}
                            </span>
                        </div>

                        {/* Edit button */}
                        <Link
                            href="/profile/edit"
                            className="flex-shrink-0 inline-flex items-center gap-2 font-semibold text-sm py-2.5 px-5 rounded-lg bg-primary text-white hover:bg-opacity-90 transition-all"
                        >
                            <FiEdit2 className="text-base" />
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {/* ── Personal Info ────────────────────────────────────── */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-5">Personal Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                        <div className="flex items-start gap-3">
                            <FiMail className="text-primary text-lg mt-0.5 flex-shrink-0" />
                            <DetailRow label="Email" value={user?.email} />
                        </div>

                        <div className="flex items-start gap-3">
                            <FiPhone className="text-primary text-lg mt-0.5 flex-shrink-0" />
                            <DetailRow label="Phone" value={user?.phone ?? "Not set"} />
                        </div>

                        <div className="flex items-start gap-3">
                            <FiUser className="text-primary text-lg mt-0.5 flex-shrink-0" />
                            <DetailRow label="Gender" value={user?.gender ?? "Not set"} />
                        </div>

                        <div className="flex items-start gap-3">
                            {user?.allow_notifications ? (
                                <FiBell className="text-primary text-lg mt-0.5 flex-shrink-0" />
                            ) : (
                                <FiBellOff className="text-gray-400 text-lg mt-0.5 flex-shrink-0" />
                            )}
                            <div>
                                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Notifications</p>
                                <p className={`text-sm font-medium ${user?.allow_notifications ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
                                    {user?.allow_notifications ? "Enabled" : "Disabled"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Address ──────────────────────────────────────────── */}
                {(user?.citizenship || user?.city || user?.address || user?.postal_code) && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                        <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-5">Address</h2>
                        <div className="flex items-start gap-3">
                            <FiMapPin className="text-primary text-lg mt-0.5 flex-shrink-0" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                                <DetailRow label="Country / Citizenship" value={user?.citizenship} />
                                <DetailRow label="City" value={user?.city} />
                                <DetailRow label="Postal Code" value={user?.postal_code} />
                                <DetailRow label="Address" value={user?.address} />
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Empty address prompt ─────────────────────────────── */}
                {!user?.citizenship && !user?.city && !user?.address && !user?.postal_code && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-dashed border-gray-300 dark:border-gray-600 p-6 mb-6 text-center">
                        <FiMapPin className="text-gray-300 dark:text-gray-600 text-3xl mx-auto mb-2" />
                        <p className="text-sm text-gray-400 dark:text-gray-500">No address on file.</p>
                        <Link href="/profile/edit" className="text-sm text-primary hover:underline mt-1 inline-block">
                            Add your address
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProfileViewPage;
