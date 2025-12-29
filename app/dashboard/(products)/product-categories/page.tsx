import React from "react";
import RecordsList from "./RecordsList";
import PageBreadcrumb from "@/components/admin-panel/common/PageBreadCrumb";

interface PageProps {
  params: Promise<{ productCategoryId?: string }>;
  searchParams: Promise<{ productCategoryId?: string }>;
}

async function Page({ params, searchParams }: PageProps) {
  const { productCategoryId } = await searchParams;

  return (
    <div>
      <PageBreadcrumb pageTitle="Product Categories" />
      <RecordsList />
    </div>
  );
}

export default Page;
