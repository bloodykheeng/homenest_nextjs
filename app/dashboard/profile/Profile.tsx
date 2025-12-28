"use client";

import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Chip } from "primereact/chip";
import {
    FaEdit,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaUserTag,
    FaCalendarAlt,
    FaBuilding,
    FaCheckCircle,
    FaTimesCircle,
    FaBell,
    FaGlobe
} from "react-icons/fa";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import useAuthContext from "@/providers/AuthProvider";

interface CSO {
    id: number;
    name: string;
}

interface OversightInstitution {
    id: number;
    name: string;
}

interface AreaOfOperation {
    id: number;
    name: string;
}

interface Location {
    id: number;
    name: string;
}

interface LoggedInUser {
    id: number;
    name?: string;
    email?: string;
    phone?: string;
    username?: string;
    role?: string;
    status?: string;
    photo_url?: string;
    lastlogin?: string;
    created_at?: string;
    allow_notifications?: boolean;
    cso?: CSO;
    oversight_institution?: OversightInstitution;
    areas_of_operation?: AreaOfOperation[];
    state?: Location;
    region?: Location;
    district?: Location;
    ward?: Location;
    village?: Location;
}

const Profile = () => {
    const router = useRouter();
    const { user, getUserQuery, isLoading, logout } = useAuthContext();
    const loggedInUserData = getUserQuery?.data?.data as LoggedInUser;

    const handleEdit = () => {
        router.push(`/dashboard/profile/edit`);
    };

    const formatDate = (dateString?: string): string => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    const hasRoleAssignments =
        !!loggedInUserData?.cso ||
        !!loggedInUserData?.oversight_institution ||
        (loggedInUserData?.areas_of_operation?.length ?? 0) > 0 ||
        !!loggedInUserData?.state;


    return (
        <div className="p-4 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-6">
                <Card className="shadow-lg bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="flex flex-col md:flex-row items-center gap-6 p-6">
                        {/* Profile Picture */}
                        <div className="relative">
                            {loggedInUserData?.photo_url ? (
                                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <Image
                                        src={loggedInUserData.photo_url}
                                        alt="Profile"
                                        className="object-cover"
                                        width={120}
                                        height={120}
                                    />
                                </div>
                            ) : (
                                <Avatar
                                    label={loggedInUserData?.name?.charAt(0).toUpperCase() || "U"}
                                    size="xlarge"
                                    shape="circle"
                                    className="w-24 h-24 text-2xl"
                                    style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
                                />
                            )}
                            {/* Status indicator */}
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center ${loggedInUserData?.status === "active" ? "bg-green-500" : "bg-red-500"
                                }`}>
                                {loggedInUserData?.status === "active" ? (
                                    <FaCheckCircle className="text-white text-xs" />
                                ) : (
                                    <FaTimesCircle className="text-white text-xs" />
                                )}
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                {loggedInUserData?.name || "Unknown User"}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                                <Chip
                                    label={loggedInUserData?.role || "User"}
                                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                />
                                <Chip
                                    label={loggedInUserData?.status || "Inactive"}
                                    className={`${loggedInUserData?.status === "active"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                        }`}
                                />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2">
                                <FaCalendarAlt className="text-sm" />
                                Last login: {formatDate(loggedInUserData?.lastlogin)}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                            <Button
                                label="Edit Profile"
                                icon={<FaEdit className="mr-2" />}
                                onClick={handleEdit}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                            />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Section - Personal Information */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-md">
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FaUserTag className="text-blue-600 text-xl" />
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Personal Information</h3>
                            </div>
                            <Divider />
                            <div className="mt-6">
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Welcome to WAJIBU CMS! Manage your profile and contribute to transparency and accountability.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InfoField icon={<FaUserTag />} label="Full Name" value={loggedInUserData?.name} />
                                    <InfoField icon={<FaUserTag />} label="Username" value={loggedInUserData?.username} />
                                    <InfoField icon={<FaEnvelope />} label="Email" value={loggedInUserData?.email} />
                                    <InfoField icon={<FaPhone />} label="Phone" value={loggedInUserData?.phone} />
                                    <InfoField
                                        icon={<FaCalendarAlt />}
                                        label="Member Since"
                                        value={formatDate(loggedInUserData?.created_at)}
                                    />
                                    <InfoField
                                        icon={<FaCheckCircle />}
                                        label="Status"
                                        value={loggedInUserData?.status ? loggedInUserData.status.charAt(0).toUpperCase() + loggedInUserData.status.slice(1) : "N/A"}
                                    />
                                    <InfoField
                                        icon={<FaBell />}
                                        label="Notifications"
                                        value={loggedInUserData?.allow_notifications ? "Enabled" : "Disabled"}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Role-Specific Assignments */}
                    {hasRoleAssignments && (
                        <Card className="shadow-md">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <FaBuilding className="text-green-600 text-xl" />
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Role Assignments</h3>
                                </div>
                                <Divider />

                                <div className="mt-6 space-y-6">
                                    {/* CSO - for CSO Reviewer & Community Accountability Champion */}
                                    {loggedInUserData?.cso && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                <FaBuilding className="inline mr-2" />
                                                CSO Organization
                                            </label>
                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                {loggedInUserData.cso.name}
                                            </div>
                                        </div>
                                    )}

                                    {/* Oversight Institution - for Oversight Institution Admin */}
                                    {loggedInUserData?.oversight_institution && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                <FaBuilding className="inline mr-2" />
                                                Oversight Institution
                                            </label>
                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                {loggedInUserData.oversight_institution.name}
                                            </div>
                                        </div>
                                    )}

                                    {/* Areas of Operation - for Community Accountability Champion */}
                                    {loggedInUserData?.areas_of_operation && loggedInUserData.areas_of_operation.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                <FaGlobe className="inline mr-2" />
                                                Areas of Operation ({loggedInUserData.areas_of_operation.length})
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {loggedInUserData.areas_of_operation.map((area) => (
                                                    <Chip
                                                        key={area.id}
                                                        label={area.name}
                                                        className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Location Hierarchy - for Community Accountability Champion */}
                                    {loggedInUserData?.state && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                <FaMapMarkerAlt className="inline mr-2" />
                                                Area of Work
                                            </label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {loggedInUserData.state && (
                                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                                        <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">State</span>
                                                        <p className="text-purple-900 dark:text-purple-100">{loggedInUserData.state.name}</p>
                                                    </div>
                                                )}
                                                {loggedInUserData.region && (
                                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                                        <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Region</span>
                                                        <p className="text-purple-900 dark:text-purple-100">{loggedInUserData.region.name}</p>
                                                    </div>
                                                )}
                                                {loggedInUserData.district && (
                                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                                        <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">District</span>
                                                        <p className="text-purple-900 dark:text-purple-100">{loggedInUserData.district.name}</p>
                                                    </div>
                                                )}
                                                {loggedInUserData.ward && (
                                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                                        <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Ward</span>
                                                        <p className="text-purple-900 dark:text-purple-100">{loggedInUserData.ward.name}</p>
                                                    </div>
                                                )}
                                                {loggedInUserData.village && (
                                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                                        <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Village</span>
                                                        <p className="text-purple-900 dark:text-purple-100">{loggedInUserData.village.name}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}

                </div>

                {/* Right Section - WAJIBU Info */}
                <div className="lg:col-span-1">
                    <Card className="shadow-md h-fit">
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FaBuilding className="text-purple-600 text-xl" />
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">WAJIBU - IPA</h3>
                            </div>
                            <Divider />

                            <div className="mt-6">
                                <div className="text-center mb-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaBuilding className="text-white text-2xl" />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 dark:text-white">Institute of Public Accountability</h4>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                        <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Mission</h5>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            Empowering transparency and accountability in public financial monitoring across Tanzania.
                                        </p>
                                    </div>

                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                        <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2">Your Role</h5>
                                        <p className="text-sm text-green-700 dark:text-green-300">
                                            As a {loggedInUserData?.role || "team member"}, you contribute to contract oversight, procurement transparency, and good governance.
                                        </p>
                                    </div>

                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                                        <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Impact</h5>
                                        <div className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                                            <div>✓ 10,000+ Youth Empowered</div>
                                            <div>✓ 100+ Organizations Engaged</div>
                                            <div>✓ Fostering Transparency</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

interface InfoFieldProps {
    icon: React.ReactNode;
    label: string;
    value?: string;
}

const InfoField: React.FC<InfoFieldProps> = ({ icon, label, value }) => {
    return (
        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-gray-500 mt-1 flex-shrink-0">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                </div>
                <div className="text-gray-900 dark:text-white truncate">
                    {value || "N/A"}
                </div>
            </div>
        </div>
    );
};

export default Profile;