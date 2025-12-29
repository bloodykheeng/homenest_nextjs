import React from "react";
import RecordsList from "./RecordsList";
import PageBreadcrumb from "@/components/admin-panel/common/PageBreadCrumb";

interface PageProps {
  params: Promise<{ productCategoryId?: string }>;
  searchParams: Promise<{ productCategoryId?: string }>;
}

async function Page({ params, searchParams }: PageProps) {
  const { productCategoryId } = await searchParams;
  // const productCategoryId = await searchParams?.productCategoryId; // Fallback to params
  // const regionId = await searchParams?.regionId;

  console.log("🚀 ~ Page ~ productCategoryId:", productCategoryId);
  return (
    <div>
      <PageBreadcrumb pageTitle="Product Sub Categories" />
      <RecordsList productCategoryId={productCategoryId} />
    </div>
  );
}

export default Page;
