"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllRolesAndModifiedPermissionsService } from "@/services/roles/roles-service";
import RoleForm from "./widgets/RowForm";
import useHandleQueryError from "@/hooks/useHandleQueryError";

import MaterialUiLoaderLottie from "@/public/lottie-files/material-ui-loading-lottie.json";
import SnailErrorLottie from "@/public/lottie-files/snail-error-lottie.json";
// import SateLiteLottie from "@/public/lottie-files/satelite-loading-lottie.json";
import FileLoadingLottie from "@/public/lottie-files/FileLoadingLottie.json";
import SkeletonLoadingLottie from "@/public/lottie-files/SkeletonLoadingLottie.json";
import NoDataLottie from "@/public/lottie-files/nodata.json";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Types
interface Role {
  role: string;
  permissions: Permission[];
}

interface Permission {
  name: string;
  value: boolean;
}

const RolesSyncPage: React.FC = () => {
  const getAllRolesAndModifiedPermissionsQuery = useQuery<{ data: Role[] }>({
    queryKey: ["roles-with-modified-permissions"],
    queryFn: getAllRolesAndModifiedPermissionsService,
  });

  // Use the custom hook to handle errors
  useHandleQueryError(getAllRolesAndModifiedPermissionsQuery);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">
        Control Roles and Permissions
      </h2>

      <div className="relative">
        {getAllRolesAndModifiedPermissionsQuery?.isPending ? (
          <div className="col-12">
            {/* <ProgressBar mode="indeterminate" style={{ height: "6px" }} /> */}
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ maxWidth: "100%" }}>
                <Lottie
                  animationData={FileLoadingLottie}
                  loop={true}
                  style={{ height: "300px" }}
                  autoplay={true}
                />
                <Lottie
                  animationData={MaterialUiLoaderLottie}
                  style={{ height: "50px" }}
                  loop={true}
                  autoplay={true}
                />
              </div>
            </div>
          </div>
        ) : getAllRolesAndModifiedPermissionsQuery?.isError ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ maxWidth: "400px" }}>
              <Lottie
                animationData={SnailErrorLottie}
                loop={true}
                autoplay={true}
              />
            </div>
          </div>
        ) : (
          <>
            {getAllRolesAndModifiedPermissionsQuery?.data?.data && (
              <RoleForm
                rolesAndModifiedPermissionData={
                  getAllRolesAndModifiedPermissionsQuery?.data.data
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RolesSyncPage;
