import React from "react";
import RecordsList from "./RecordsList";
import PageBreadCrumb from "@/components/admin-panel/common/PageBreadCrumb";

interface PageProps {
    params: Promise<{ transactionId?: string }>;
    searchParams: Promise<{
        orderId?: string;
        create?: string;
    }>;
}

async function Page({ params, searchParams }: PageProps) {
    const { orderId, create } = await searchParams;

    return (
        <div>
            <PageBreadCrumb pageTitle="Transactions" />
            <RecordsList
                preselectedOrderId={orderId ? parseInt(orderId) : undefined}
            // openCreateDialog={create === "true" ? true : false}
            />
        </div>
    );
}

export default Page;
