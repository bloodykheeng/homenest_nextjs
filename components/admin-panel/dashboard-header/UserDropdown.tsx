"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "nextjs-toploader/app";
import {
  RxPerson,
  RxGear,
  RxQuestionMarkCircled,
  RxExit,
  RxChevronDown,
  RxPencil2,
  RxEyeOpen,
} from "react-icons/rx";
import { Dropdown } from "../../ui/dropdown/Dropdown";
import { DropdownItem } from "../../ui/dropdown/DropdownItem";
import useAuthContext from "@/providers/AuthProvider";
import ProfileSidebar from "./ProfileSidebar";

import { Avatar } from "primereact/avatar";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileSidebarVisible, setProfileSidebarVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { getUserQuery, logoutMutation } = useAuthContext();
  const loggedInUserData = getUserQuery?.data?.data;
  const router = useRouter();

  function closeDropdown() {
    setIsOpen(false);
  }

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation(); // ✅ prevent bubbling
    setIsOpen((prev) => !prev); // ✅ true toggle
  }

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!logoutMutation.isPending) {
      logoutMutation.mutate();
      closeDropdown();
    }
  };

  const handleViewProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    setProfileSidebarVisible(true);
    closeDropdown();
  };

  const handleEditProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/dashboard/profile/edit");
    closeDropdown();
  };

  // Get user display data with fallbacks
  const userName =
    loggedInUserData?.name || loggedInUserData?.username || "Admin";
  const userEmail = loggedInUserData?.email || "admin@example.com";
  const userAvatar = loggedInUserData?.photo_url ?? "";
  const userRole = loggedInUserData?.role;

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Profile Button / Logout State */}
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
        >
          {logoutMutation.isPending ? (
            // Logging out state
            <div className="flex items-center gap-2 text-red-500">
              <RxExit className="animate-pulse" />
              <span className="font-medium">Logging out...</span>
            </div>
          ) : (
            // Normal profile button
            <>
              {/* <span className="mr-3 overflow-hidden rounded-full h-11 w-11 border-2 border-gray-200 dark:border-gray-600">
                <Image
                  width={44}
                  height={44}
                  src={userAvatar}
                  alt={userName}
                  className="object-cover"
                />
              </span> */}

              <div className="relative inline-block mr-3">
                {userAvatar ? (
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                    <Image
                      // src={userAvatar}
                      src="http://127.0.0.1:8000/storage/user_photos/uhrc-short-logo_693b0cd3a97ff.png"
                      alt="Profile"
                      className="object-cover"
                      width={120}
                      height={120}
                    />
                  </div>
                ) : (
                  <Avatar
                    label={userName?.charAt(0).toUpperCase() || "U"}
                    shape="circle"
                    style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
                  />
                )}
              </div>

              <span className="mr-2 font-medium text-theme-sm hidden sm:block">
                {userName?.length > 10
                  ? `${userName.substring(0, 10)}...`
                  : userName}
              </span>
              <RxChevronDown
                className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                  }`}
                size={12}
              />
            </>
          )}
        </button>

        {/* Dropdown Menu */}
        {!logoutMutation.isPending && (
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="absolute right-0 mt-[17px] flex w-[280px] flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
          >
            {/* User Info Header */}
            <div className="pb-4">
              <div className="flex items-center gap-3">
                <div className="relative inline-block">
                  {userAvatar ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                      <Image
                        src={userAvatar}
                        alt="Profile"
                        className="object-cover"
                        width={120}
                        height={120}
                      />
                    </div>
                  ) : (
                    <Avatar
                      label={userName?.charAt(0).toUpperCase() || "U"}
                      shape="circle"
                      style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-300 truncate">
                    {userName}
                  </span>
                  <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400 truncate">
                    {userRole}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <ul className="flex flex-col gap-1 pb-4 border-b border-gray-200 dark:border-gray-800">
              <li>
                <DropdownItem
                  onItemClick={handleViewProfile}
                  tag="button"
                  className="flex items-center gap-3 px-3 py-2.5 w-full font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <RxEyeOpen className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                  View profile
                </DropdownItem>
              </li>
              <li>
                <DropdownItem
                  onItemClick={handleEditProfile}
                  tag="button"
                  className="flex items-center gap-3 px-3 py-2.5 w-full font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <RxPencil2 className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                  Edit profile
                </DropdownItem>
              </li>
            </ul>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="flex items-center gap-3 px-3 py-2.5 mt-3 w-full font-medium text-red-600 rounded-lg group text-theme-sm hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/10 dark:hover:text-red-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RxExit className="text-red-500 group-hover:text-red-700 dark:text-red-400 dark:group-hover:text-red-300" />
              Sign out
            </button>
          </Dropdown>
        )}
      </div>

      {/* Profile Sidebar */}
      <ProfileSidebar
        visible={profileSidebarVisible}
        onHide={() => setProfileSidebarVisible(false)}
        user={loggedInUserData}
      />
    </>
  );
}
