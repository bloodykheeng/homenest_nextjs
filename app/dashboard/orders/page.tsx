import React from "react";
import RecordsList from "./RecordsList";
import PageBreadcrumb from "@/components/admin-panel/common/PageBreadCrumb";

function Page() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Orders" />
            <RecordsList />
        </div>
    );
}

export default Page;
