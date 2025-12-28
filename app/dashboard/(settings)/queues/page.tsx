import React from "react";
import QueuesTabsPage from "./QueueTabsPage";
import PageBreadcrumb from "@/components/admin-panel/common/PageBreadCrumb";

function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Queues" />
      <QueuesTabsPage />
    </div>
  );
}

export default Page;
