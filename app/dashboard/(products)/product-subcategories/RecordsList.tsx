"use client";

import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { DataTablePageEvent } from "primereact/datatable";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

import { useRouter } from "nextjs-toploader/app";

import Image from "next/image";

import {
  getAllProductSubcategories,
  getProductSubcategoryById,
  postProductSubcategory,
  updateProductSubcategory,
  patchProductSubcategory,
  deleteProductSubcategoryById,
  postToBulkDestroyProductSubcategories,
} from "@/services/products/product-subcategories-service";

import useHandleQueryError from "@/hooks/useHandleQueryError";

import MaterialUiLoaderLottie from "@/public/lottie-files/material-ui-loading-lottie.json";
import SnailErrorLottie from "@/public/lottie-files/snail-error-lottie.json";
// import SateLiteLottie from "@/public/lottie-files/satelite-loading-lottie.json";
// import FileLoadingLottie from "@/public/lottie-files/FileLoadingLottie.json";
import SkeletonLoadingLottie from "@/public/lottie-files/SkeletonLoadingLottie.json";
import NoDataLottie from "@/public/lottie-files/nodata.json";

import InlineExpandableText from "@/components/helpers/InlineExpandableText";
import moment from "moment";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";

import PrimeReactDataTable from "@/components/admin-panel/tables/PrimeReactDataTable";


import DeleteRecordsDialog from "./DeleteRecordsDialog";
import RecordDetailsDialog from "./RecordDetailsDialog";
import CreateRecordDialog from "./CreateRecordDialog";
import EditRecordDialog from "./EditRecordDialog";

import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

function RecordsList({ productCategoryId }: { productCategoryId?: string }) {
  const router = useRouter();
  const [globalSearch, setGlobalSearch] = useState("");
  const [globalSearchTearm, setGlobalSearchTearm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [first, setFirst] = useState(0); // Track the first row index for pagination
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch data using useQuery
  const getAllProductSubcategoriesQuery = useQuery({
    queryKey: [
      "product-subcategories",
      currentPage,
      rowsPerPage,
      globalSearchTearm,
      "paginate",
      productCategoryId,
    ], // Include page and search term in query key
    queryFn: (queryprops) =>
      getAllProductSubcategories({
        ...queryprops,
        page: currentPage,
        rowsPerPage,
        search: globalSearchTearm,
        paginate: true,
        product_category_id: productCategoryId,
      }),
  });
  console.log(
    "🚀 ~ RecordsList ~ getAllProductSubcategoriesQuery:",
    getAllProductSubcategoriesQuery
  );

  useHandleQueryError(getAllProductSubcategoriesQuery);

  // Extract data and pagination details from the query result
  const tableData =
    getAllProductSubcategoriesQuery?.data?.data?.data?.data || [];
  const totalRecords =
    getAllProductSubcategoriesQuery?.data?.data?.data?.total || 0;
  const perPage =
    getAllProductSubcategoriesQuery?.data?.data?.data?.per_page || 5;
  const lastPage =
    getAllProductSubcategoriesQuery?.data?.data?.data?.last_page || 1;

  const handleSearch = (e: any) => {
    e.preventDefault;
    setGlobalSearchTearm(globalSearch);
  };

  // Helper function to format dates
  const formatDate = (date?: string): string =>
    date ? moment(date).format("MMMM Do YYYY") : "N/A";

  // Handle page change in the DataTable
  const onPageChange = (event: DataTablePageEvent) => {
    console.log("🚀 ~ onPageChange ~ event:", event);

    const newPage = (event?.page ?? 0) + 1; // PrimeReact paginator is zero-based
    setFirst(event.first); // Update the first row index
    setCurrentPage(newPage); // Update the current page

    setRowsPerPage(event?.rows);
  };

  // Product Subcategory type with nested fields and passthrough for any other fields
  type ProductSubcategory = {
    id?: number;
    uuid?: string;
    category?: { id: number; name: string };
    name: string;
    description?: string;
    status: string;
    photo_url?: string;
    bc_category_id?: string;
    bc_category_code?: string;
    created_by?: { name: string };
    updated_by?: { name: string };
    created_at: string;
    updated_at: string;
    [key: string]: any; // Passthrough for any other fields
  };

  type ColumnConfig<T> = {
    field: string; // Using string instead of keyof T to allow for nested fields
    header: string;
    type?: "date" | "image" | string;
    body?: (rowData: T) => React.ReactNode;
    visible?: boolean;
  };

  // Utility function to get nested property value
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  // Column definitions
  const tableColumns: ColumnConfig<ProductSubcategory>[] = [
    // Basic Information
    {
      field: "name",
      header: "Subcategory Name",
      body: (rowData) => (
        <span
          className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
          onClick={(e) => {
            e.preventDefault();
            router.push(
              `/dashboard/products?productCategoryId=${rowData?.category?.id}&productSubCategoryId=${rowData?.id}`
            );
          }}
        >
          {rowData.name}
        </span>
      ),
    },
    { field: "category.name", header: "Category" },
    { field: "description", header: "Description" },
    { field: "status", header: "Status" },

    // Business Central Information
    {
      field: "bc_sub_category_id",
      header: "BC Sub Category ID",
      visible: false,
    },
    {
      field: "bc_sub_category_code",
      header: "BC Sub Category Code",
      visible: false,
    },

    // Photo
    {
      field: "photo_url",
      header: "Subcategory Photo",
      visible: false,
      type: "image",
      body: (rowData) =>
        rowData.photo_url ? (
          <div
            style={{
              width: "60px",
              height: "40px",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <Image
              src={rowData.photo_url}
              alt="Subcategory"
              width={60}
              height={40}
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          "N/A"
        ),
    },

    // System Metadata
    { field: "created_by.name", header: "Created By", visible: false },
    { field: "updated_by.name", header: "Updated By", visible: false },
    {
      field: "created_at",
      header: "Created At",
      type: "date",
      body: (rowData) => new Date(rowData.created_at).toLocaleString(),
    },
    {
      field: "updated_at",
      header: "Updated At",
      type: "date",
      visible: false,
      body: (rowData) => new Date(rowData.updated_at).toLocaleString(),
    },
  ];

  const [selectedItems, setSelectedItems] = useState<[]>([]);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  // Add this function to handle delete action
  const handleDelete = () => {
    console.log("clicked handle delete");
    setDeleteDialogVisible(true);
  };

  //================== viewing a record ================
  const [selectedItem, setSelectedItem] = useState<Record<string, any> | null>(null);
  const [showRecordDetailsDialog, setShowRecordDetailsDialog] = useState(false);

  const handleViewRecord = <T extends Record<string, any>>(
    Item: T
  ) => {
    setSelectedItem(Item);
    setShowRecordDetailsDialog(true);
  };

  //=================== creating a record ==========================
  const [showCreateRecord, setShowCreateRecord] = useState(false);
  const handleCreateRecord = () => {
    setShowCreateRecord(true);
  };

  //=================== editing a record ==========================
  const [showEditRecord, setShowEditRecord] = useState(false);
  const handleEditRecord = (record: any) => {
    setShowEditRecord(true);
    setSelectedItem(record);
  };

  return (
    <>
      {getAllProductSubcategoriesQuery?.isError ? (
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
          <Card
            className="p-mt-3 p-shadow-2 overflow-auto "
            pt={{
              body: { className: "!p-1 md:p-1 sm:p-1 lg:p-5" },
            }}
          >
            {/* <div className="flex justify-content-between items-center">
                        <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>

                        <Button label="Back" severity="info" text raised onClick={() => router.back()} />
                    </div> */}

            <div className="grid">
              {/* {Array.isArray(faqsData) &&
                            faqsData?.length === 0 && (
                                <>
                                    <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <div style={{ maxWidth: "400px" }}>
                                            <Lottie animationData={NoDataLottie} loop={true} autoplay={true} />
                                        </div>
                                    </div>
                                </>
                            )} */}

              <div className="grid-cols-12 surface-border border-bottom-1">
                <div className="col-12 flex justify-content-between align-items-center py-2 px-3">
                  <PrimeReactDataTable
                    data={tableData}
                    columns={tableColumns}
                    totalRecords={totalRecords}
                    rows={perPage}
                    first={first}
                    loading={getAllProductSubcategoriesQuery.isPending}
                    onPageChange={onPageChange}
                    emptyMessage="No Product Sub Categories found."
                    headerContent={
                      <div className="flex flex-wrap gap-2 items-center justify-between">
                        <h4 className="m-0">Product Sub Categories List</h4>
                        <div className="p-inputgroup w-full md:w-30rem lg:w-30rem">
                          <InputText
                            type="search"
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                            placeholder="Search Product Sub Categories"
                          />
                          <Button
                            icon="pi pi-search"
                            className="p-button-primary"
                            onClick={handleSearch}
                          />
                        </div>
                      </div>
                    }
                    fileName="Product Sub Categories Export"
                    // selection
                    selection={true}
                    selectedItems={selectedItems}
                    setSelectedItems={(items) => setSelectedItems(items)}
                    // deleting
                    showDelete={true}
                    handleDelete={handleDelete}
                    // show records
                    showViewRecord={true}
                    handleViewRecord={handleViewRecord}
                    // craating a record
                    showCreateRecord={productCategoryId ? true : true}
                    handleCreateRecord={handleCreateRecord}
                    // editing a record
                    showEditRecord={productCategoryId ? true : true}
                    handleEditRecord={handleEditRecord}
                  />
                </div>
              </div>
            </div>

            <DeleteRecordsDialog
              visible={deleteDialogVisible}
              onHide={() => setDeleteDialogVisible(false)}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />

            <RecordDetailsDialog
              visible={showRecordDetailsDialog}
              onHide={() => setShowRecordDetailsDialog(false)}
              selectedRecord={selectedItem}
            />

            <CreateRecordDialog
              visible={showCreateRecord}
              onHide={() => setShowCreateRecord(false)}
              selectedSearchParams={{ productCategoryId }}
            />

            <EditRecordDialog
              visible={showEditRecord}
              onHide={() => {
                setSelectedItem(null);
                setShowEditRecord(false);
              }}
              initialData={selectedItem}
              selectedSearchParams={{ productCategoryId }}
            />
          </Card>
        </>
      )}
    </>
  );
}

export default RecordsList;
