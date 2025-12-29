import React from "react";
import RecordsList from "./RecordsList";
import PageBreadcrumb from "@/components/admin-panel/common/PageBreadCrumb";


interface PageProps {
  params: Promise<{ productSubCategoryId?: string }>;
  searchParams: Promise<{
    productCategoryId?: string;
    productSubCategoryId?: string;
  }>;
}

async function Page({ params, searchParams }: PageProps) {
  const { productCategoryId, productSubCategoryId } = await searchParams;

  return (
    <div>
      <PageBreadcrumb pageTitle="Products" />
      <RecordsList
        productCategoryId={productCategoryId}
        productSubCategoryId={productSubCategoryId}
      />
    </div>
  );
}

export default Page;
