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

import Image from "next/image";

import { useRouter } from "nextjs-toploader/app";

import {
  getAllProducts,
  getProductById,
  postProduct,
  updateProduct,
  patchProduct,
  deleteProductById,
  postToBulkDestroyProducts,
} from "@/services/products/products-service";

import useHandleQueryError from "@/hooks/useHandleQueryError";

import MaterialUiLoaderLottie from "@/public/lottie-files/material-ui-loading-lottie.json";
import SnailErrorLottie from "@/public/lottie-files/snail-error-lottie.json";
import SkeletonLoadingLottie from "@/public/lottie-files/SkeletonLoadingLottie.json";
import NoDataLottie from "@/public/lottie-files/nodata.json";

import InlineExpandableText from "@/components/helpers/InlineExpandableText";
import moment from "moment";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";

import Link from "next/link";

import PrimeReactDataTable from "@/components/admin-panel/tables/PrimeReactDataTable";

import DeleteRecordsDialog from "./DeleteRecordsDialog";
import RecordDetailsDialog from "./RecordDetailsDialog";
import CreateRecordDialog from "./CreateRecordDialog";
import EditRecordDialog from "./EditRecordDialog";

import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

function RecordsList({
  productCategoryId,
  productSubCategoryId,
}: {
  productCategoryId?: string;
  productSubCategoryId?: string;
}) {
  const router = useRouter();
  const [globalSearch, setGlobalSearch] = useState("");
  const [globalSearchTearm, setGlobalSearchTearm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [first, setFirst] = useState(0); // Track the first row index for pagination
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch data using useQuery
  const getAllProductsQuery = useQuery({
    queryKey: [
      "products",
      currentPage,
      rowsPerPage,
      globalSearchTearm,
      "paginate",
      productSubCategoryId,
    ], // Include page and search term in query key
    queryFn: (queryprops) =>
      getAllProducts({
        ...queryprops,
        page: currentPage,
        rowsPerPage,
        search: globalSearchTearm,
        paginate: true,
        product_subcategory_id: productSubCategoryId,
      }),
  });
  console.log("🚀 ~ RecordsList ~ getAllProductsQuery:", getAllProductsQuery);

  useHandleQueryError(getAllProductsQuery);

  // Extract data and pagination details from the query result
  const tableData = getAllProductsQuery?.data?.data?.data?.data || [];
  const totalRecords = getAllProductsQuery?.data?.data?.data?.total || 0;
  const perPage = getAllProductsQuery?.data?.data?.data?.per_page || 5;
  const lastPage = getAllProductsQuery?.data?.data?.data?.last_page || 1;

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

  // Product type with nested fields and passthrough for any other fields
  type Product = {
    id?: number;
    uuid?: string;
    subcategory?: { name: string };
    category?: { name: string };
    name: string;
    price: number;
    quantity: number;
    discount?: number;
    rating?: number;
    description?: string;
    status: string;
    colors?: Array<{ color_name: string; color_code: string }>;
    sizes?: Array<{ size_name: string }>;
    product_attachments?: Array<{ file_path: string; featured: boolean }>;
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
  const tableColumns: ColumnConfig<Product>[] = [
    // Basic Information
    {
      field: "name",
      header: "Product Name",
      body: (rowData) => (
        <Link
          href={`/dashboard/products/${rowData?.id}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {rowData?.name || "N/A"}
        </Link>
      ),
    },
    { field: "subcategory.name", header: "Subcategory" },
    { field: "category.name", header: "Category" },
    {
      field: "price",
      header: "Price",
      visible: true,
      body: (rowData) =>
        `UGX ${(Number(rowData?.price) || 0).toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      field: "quantity",
      header: "Quantity",
      visible: true,
      body: (rowData) => rowData?.quantity || 0,
    },
    {
      field: "discount",
      header: "Discount",
      visible: false,
      body: (rowData) => `${rowData?.discount || 0}%`,
    },
    {
      field: "rating",
      header: "Rating",
      visible: false,
      body: (rowData) => `${rowData?.rating || 0}/5`,
    },
    {
      field: "description",
      header: "Description",
      visible: false,
      body: (rowData) => (
        <InlineExpandableText text={rowData?.description || "N/A"} maxLength={50} />
      ),
    },
    {
      field: "status",
      header: "Status",
      visible: true,
      body: (rowData) => (
        <Tag
          value={rowData?.status}
          severity={
            rowData?.status === "active"
              ? "success"
              : rowData?.status === "out_of_stock"
                ? "warning"
                : "danger"
          }
        />
      ),
    },

    {
      field: "show_in_slider",
      header: "Show in Slider",
      visible: true,
      body: (rowData) => (
        <Tag
          value={rowData?.show_in_slider ? "Yes" : "No"}
          severity={rowData?.show_in_slider ? "success" : "secondary"}
          icon={rowData?.show_in_slider ? "pi pi-check" : "pi pi-times"}
        />
      ),
    },

    // Colors
    {
      field: "colors",
      header: "Colors",
      visible: false,
      body: (rowData) => {
        if (!rowData?.colors || rowData.colors.length === 0) return "N/A";
        return (
          <div className="flex gap-1">
            {rowData.colors.slice(0, 3).map((color: any, index: number) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: color.color_code }}
                title={color.color_name}
              />
            ))}
            {rowData.colors.length > 3 && (
              <span className="text-xs">+{rowData.colors.length - 3}</span>
            )}
          </div>
        );
      },
    },

    // Sizes
    {
      field: "sizes",
      header: "Sizes",
      visible: false,
      body: (rowData) => {
        if (!rowData?.sizes || rowData.sizes.length === 0) return "N/A";
        return rowData.sizes.map((s: any) => s.size_name).join(", ");
      },
    },

    // Featured Image
    {
      field: "product_attachments",
      header: "Image",
      visible: true,
      type: "image",
      body: (rowData) => {
        console.log("rowData product :", rowData)
        const featuredImage = rowData?.product_attachments?.find(
          (att: any) => att.featured
        );
        const imageUrl = featuredImage?.file_path || rowData?.product_attachments?.[0]?.file_path;

        console.log("imageUrl product :", imageUrl)

        return imageUrl ? (
          <div
            style={{
              width: "60px",
              height: "40px",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <Image
              src={imageUrl}
              alt="Product"
              width={60}
              height={40}
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          "N/A"
        );
      },
    },

    // System Metadata
    { field: "created_by.name", header: "Created By", visible: false },
    { field: "updated_by.name", header: "Updated By", visible: false },
    {
      field: "created_at",
      header: "Created At",
      type: "date",
      body: (rowData) => new Date(rowData.created_at).toLocaleString(),
      visible: false
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
      {getAllProductsQuery?.isError ? (
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
            <div className="grid">
              <div className="grid-cols-12 surface-border border-bottom-1">
                <div className="col-12 flex justify-content-between align-items-center py-2 px-3">
                  <PrimeReactDataTable
                    data={tableData}
                    columns={tableColumns}
                    totalRecords={totalRecords}
                    rows={perPage}
                    first={first}
                    loading={getAllProductsQuery.isPending}
                    onPageChange={onPageChange}
                    emptyMessage="No Products found."
                    headerContent={
                      <div className="flex flex-wrap gap-2 items-center justify-between">
                        <h4 className="m-0">Products List</h4>
                        <div className="p-inputgroup w-full md:w-30rem lg:w-30rem">
                          <InputText
                            type="search"
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                            placeholder="Search Products"
                          />
                          <Button
                            icon="pi pi-search"
                            className="p-button-primary"
                            onClick={handleSearch}
                          />
                        </div>
                      </div>
                    }
                    fileName="Products Export"
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
                    showCreateRecord={
                      productCategoryId && productSubCategoryId ? true : false
                    }
                    handleCreateRecord={handleCreateRecord}
                    // editing a record
                    showEditRecord={
                      productCategoryId && productSubCategoryId ? true : false
                    }
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
              selectedSearchParams={{ productCategoryId, productSubCategoryId }}
            />

            <EditRecordDialog
              visible={showEditRecord}
              onHide={() => {
                setSelectedItem(null);
                setShowEditRecord(false);
              }}
              initialData={selectedItem}
              selectedSearchParams={{ productCategoryId, productSubCategoryId }}
            />
          </Card>
        </>
      )}
    </>
  );
}

export default RecordsList;