"use client";

import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { Chip } from "primereact/chip";
import { useRouter } from "nextjs-toploader/app";
import {
  FaTimes,
  FaEdit,
  FaCog,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUserTag,
  FaCalendarAlt,
} from "react-icons/fa";
import Image from "next/image";


interface Territory {
  id: number;
  name: string;
}

interface Agent {
  id: number;
  name: string;
  code?: string;
}

interface Region {
  id: number;
  name: string;
}

interface Channel {
  id: number;
  name: string;
}

interface LoggedInUser {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  gender?: string;
  status?: string;
  photo_url?: string;
  lastlogin?: string;
  created_at?: string;
  channel?: Channel;
  regions?: Region[]; // Changed to array for 1-to-many
  territories?: Territory[];
  agents?: Agent[];
}

interface ProfileSidebarProps {
  visible: boolean;
  onHide: () => void;
  user: LoggedInUser | null;
}

export default function ProfileSidebar({
  visible,
  onHide,
  user,
}: ProfileSidebarProps) {
  const router = useRouter();

  return (
    <Sidebar
      visible={visible}
      position="right"
      onHide={onHide}
      className="!w-full sm:!w-96"
      header={
        <div className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Profile
          </h2>
        </div>
      }
      pt={{
        header: {
          className: "px-6 py-4 border-b border-gray-200 dark:border-gray-700",
        },
        content: { className: "px-0 py-0" },
      }}
    >
      {/* Content */}
      <div className="p-6">
        {/* Avatar & Basic Info */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            {user?.photo_url ? (
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                <Image
                  src={user.photo_url}
                  alt="Profile"
                  className="object-cover"
                  width={120}
                  height={120}
                />
              </div>
            ) : (
              <Avatar
                label={user?.name?.charAt(0).toUpperCase() || "U"}
                size="xlarge"
                shape="circle"
                style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
              />
            )}
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
            {user?.name || "Unknown User"}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              {user?.role || "User"}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user?.status === "active"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                }`}
            >
              {user?.status || "Inactive"}
            </span>
          </div>
        </div>

        <Divider />

        {/* Personal Information */}
        <div className="space-y-3 mt-4">
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Personal Information
          </h4>

          <CompactDetail
            icon={<FaUserTag className="text-gray-500 w-4 h-4" />}
            label="Full Name"
            value={user?.name || "N/A"}
          />

          <CompactDetail
            icon={<FaEnvelope className="text-gray-500 w-4 h-4" />}
            label="Email"
            value={user?.email || "No email"}
          />

          <CompactDetail
            icon={<FaPhone className="text-gray-500 w-4 h-4" />}
            label="Phone"
            value={user?.phone || "Not provided"}
          />

          <CompactDetail
            icon={<FaCalendarAlt className="text-gray-500 w-4 h-4" />}
            label="Gender"
            value={
              user?.gender
                ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                : "Not specified"
            }
          />

          <CompactDetail
            icon={<FaCalendarAlt className="text-gray-500 w-4 h-4" />}
            label="Last Login"
            value={
              user?.lastlogin
                ? new Date(user.lastlogin).toLocaleDateString()
                : "N/A"
            }
          />
        </div>

        <Divider />

        {/* Assignments */}
        <div className="space-y-3 mt-4">
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Assignments
          </h4>

          <CompactDetail
            icon={<FaMapMarkerAlt className="text-gray-500 w-4 h-4" />}
            label="Channel"
            value={user?.channel?.name || "Not assigned"}
          />

          {/* Regions - Now as chips for 1-to-many */}
          <div className="flex items-start gap-2 py-1">
            <FaMapMarkerAlt className="text-gray-500 w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Regions:
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {user?.regions && user.regions.length > 0 ? (
                  user.regions.map((region) => (
                    <Chip
                      key={region.id}
                      label={region.name}
                      className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 text-xs"
                    />
                  ))
                ) : (
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Not assigned</span>
                )}
              </div>
            </div>
          </div>

          {/* Territories */}
          {user?.territories && user.territories.length > 0 && (
            <div className="flex items-start gap-2 py-1">
              <FaMapMarkerAlt className="text-gray-500 w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Territories:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.territories.map((territory) => (
                    <Chip
                      key={territory.id}
                      label={territory.name}
                      className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 text-xs"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Agents */}
          {/* {user?.agents && user.agents.length > 0 && (
            <div className="flex items-start gap-2 py-1">
              <FaUserTag className="text-gray-500 w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Agents:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.agents.map((agent) => (
                    <Chip
                      key={agent.id}
                      label={`${agent.name}${agent.code ? ` (${agent.code})` : ""
                        }`}
                      className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100 text-xs"
                    />
                  ))}
                </div>
              </div>
            </div>
          )} */}


        </div>

        <Divider className="my-4" />

        {/* Actions */}
        <div className="space-y-2 flex flex-col gap-2">
          <Button
            label="Edit Profile"
            icon={<FaEdit />}
            onClick={() => {
              onHide();
              router.push("/dashboard/profile/edit");
            }}
            className="w-full"
            size="small"
          />
          {/* <Button
            label="Account Settings"
            icon={<FaCog />}
            onClick={() => {
              onHide();
              router.push("/settings");
            }}
            className="w-full p-button-outlined"
            size="small"
          /> */}
        </div>
      </div>
    </Sidebar>
  );
}

function CompactDetail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 py-1">
      {icon}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">
        {label}:
      </span>
      <span className="text-sm text-gray-900 dark:text-white flex-1 min-w-0 truncate">
        {value}
      </span>
    </div>
  );
}