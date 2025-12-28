import React from "react";
import RolesSyncPage from "./RolesSyncPage";
import PageBreadcrumb from "@/components/admin-panel/common/PageBreadCrumb";

function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Roles" />
      <RolesSyncPage />
    </div>
  );
}

export default Page;
