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

import {
  getAllActivityLogs,
  postToBulkDeleteActivityLogs,
} from "@/services/activity-logs/activity-logs-service";

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

import AdvancedFilterForm from "./AdvancedFilterForm";

import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

function RecordsList() {
  const router = useRouter();
  const [globalSearch, setGlobalSearch] = useState("");
  const [globalSearchTearm, setGlobalSearchTearm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [first, setFirst] = useState(0); // Track the first row index for pagination
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedFilters, setSelectedFilters] = useState({
    // startDate: moment().subtract(3, "days").toDate(),
    // endDate: moment().toDate(),
    // selectedStatuses: [],
  });

  // Fetch data using useQuery
  const getAllActivityLogsQueryQuery = useQuery({
    queryKey: [
      "audit-trail",
      currentPage,
      rowsPerPage,
      globalSearchTearm,
      "paginate",
      selectedFilters,
    ], // Include page and search term in query key
    queryFn: (queryprops) =>
      getAllActivityLogs({
        ...queryprops,
        page: currentPage,
        rowsPerPage,
        search: globalSearchTearm,
        paginate: true,
        ...selectedFilters,
      }),
  });
  console.log(
    "🚀 ~ RecordsList ~ getAllActivityLogsQueryQuery:",
    getAllActivityLogsQueryQuery
  );

  useHandleQueryError(getAllActivityLogsQueryQuery);

  // Extract data and pagination details from the query result
  const tableData = getAllActivityLogsQueryQuery?.data?.data?.data?.data || [];
  const totalRecords =
    getAllActivityLogsQueryQuery?.data?.data?.data?.total || 0;
  const perPage = getAllActivityLogsQueryQuery?.data?.data?.data?.per_page || 5;
  const lastPage =
    getAllActivityLogsQueryQuery?.data?.data?.data?.last_page || 1;

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

  // FormData reference from earlier:
  // type FormData = {
  //   name: string;
  //   abbreviation: string;
  //   designation: "Private" | "NGO";
  //   type: "Indigenous" | "Foreign";
  //   description?: string;
  //   status: "active" | "deactive";
  //   districts?: { id: string; name: string }[];
  // }

  // Corrected ColDefn type to align with FormData
  type ColDefn = {
    id: number;
    name: string;
    description?: string;
    status: "active" | "deactive"; // Made lowercase to match form values
    districts?: { id: string; name: string }[]; // Added districts array
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

  // Column definitions updated to include all relevant fields
  const columns: ColumnConfig<any>[] = [
    {
      field: "id",
      header: "#",
      body: (rowData) => <div>{rowData?.id}</div>,
    },
    {
      field: "log_name",
      header: "Name",
      body: (rowData) => {
        const maxLength = 20;
        const log_name = rowData?.log_name || "No log name";
        return <InlineExpandableText text={log_name} maxLength={maxLength} />;
      },
    },
    {
      field: "description",
      header: "Description",
      body: (rowData) => {
        const maxLength = 20;
        const description = rowData?.description || "No description";
        return (
          <InlineExpandableText text={description} maxLength={maxLength} />
        );
      },
    },
    {
      field: "properties.ip",
      header: "IP Address",
      body: (rowData) => <span>{rowData?.properties?.ip || "System"}</span>,
      visible: false,
    },
    {
      field: "properties.country",
      header: "Country",
      type: "hidden",
      body: (rowData) => <span>{rowData?.properties?.country || "N/A"}</span>,
      visible: false,
    },
    {
      field: "properties.city",
      header: "City",
      body: (rowData) => <span>{rowData?.properties?.city || "N/A"}</span>,
    },
    {
      field: "properties.user_agent",
      header: "User Agent",
      visible: false,
      body: (rowData) => {
        const maxLength = 20;
        const userAgent = rowData?.properties?.user_agent || "No User Agent";
        return <InlineExpandableText text={userAgent} maxLength={maxLength} />;
      },
    },
    {
      field: "properties.created_by",
      header: "Causer",
      body: (rowData) => (
        <span>{rowData?.properties?.created_by || "System"}</span>
      ),
    },
    {
      field: "properties.created_by_email",
      header: "Causer Email",
      visible: false,
      body: (rowData) => (
        <div>{rowData?.properties?.created_by_email || "N/A"}</div>
      ),
    },
    {
      field: "created_at",
      header: "Date",
      type: "date",
      body: (rowData) => (
        <div>{moment(rowData?.created_at).format("YYYY-MM-DD")}</div>
      ),
    },
    {
      field: "created_at",
      header: "Time",
      type: "date",
      body: (rowData) => (
        <div>{moment(rowData?.created_at).format("HH:mm:ss")}</div>
      ),
    },
    {
      field: "properties.region",
      header: "Region",
      type: "hidden",
      body: (rowData) => <span>{rowData?.properties?.region || "N/A"}</span>,
      visible: false,
    },
    {
      field: "properties.latitude",
      header: "Latitude",
      type: "hidden",
      body: (rowData) => <span>{rowData?.properties?.latitude || "N/A"}</span>,
      visible: false,
    },
    {
      field: "properties.longitude",
      header: "Longitude",
      type: "hidden",
      body: (rowData) => <span>{rowData?.properties?.longitude || "N/A"}</span>,
      visible: false,
    },
    {
      field: "properties.timezone",
      header: "Timezone",
      type: "hidden",
      body: (rowData) => <span>{rowData?.properties?.timezone || "N/A"}</span>,
      visible: false,
    },
    {
      field: "properties.device",
      header: "Device",
      type: "hidden",
      body: (rowData) => <span>{rowData?.properties?.device || "N/A"}</span>,
      visible: false,
    },
    {
      field: "properties.platform",
      header: "Platform",
      type: "hidden",
      body: (rowData) => <span>{rowData?.properties?.platform || "N/A"}</span>,
      visible: false,
    },
    {
      field: "properties.platform_version",
      header: "Platform Version",
      type: "hidden",
      body: (rowData) => (
        <span>{rowData?.properties?.platform_version || "N/A"}</span>
      ),
      visible: false,
    },
    {
      field: "properties.browser",
      header: "Browser",
      type: "hidden",
      body: (rowData) => <span>{rowData?.properties?.browser || "N/A"}</span>,
      visible: false,
    },
    {
      field: "properties.browser_version",
      header: "Browser Version",
      type: "hidden",
      body: (rowData) => (
        <span>{rowData?.properties?.browser_version || "N/A"}</span>
      ),
      visible: false,
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

  const handleViewRecord = (Item: any) => {
    setSelectedItem(Item);
    setShowRecordDetailsDialog(true);
  };

  const handleSubmitAdvancedFilter = (formData: any) => {
    console.log("Form submitted with:", formData);

    setSelectedFilters(formData);
    // Handle form submission (e.g., API call, state update)
  };

  return (
    <>
      {getAllActivityLogsQueryQuery?.isError ? (
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

            <div className="py-2 px-3">
              <AdvancedFilterForm
                initialData={selectedFilters}
                onSubmit={handleSubmitAdvancedFilter}
              />
            </div>

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
                    columns={columns}
                    totalRecords={totalRecords}
                    rows={perPage}
                    first={first}
                    loading={getAllActivityLogsQueryQuery.isPending}
                    onPageChange={onPageChange}
                    emptyMessage="No Audit Trail Records found."
                    headerContent={
                      <div className="flex flex-wrap gap-2 items-center justify-between">
                        <h4 className="m-0">Audit Trail Records List</h4>
                        <div className="p-inputgroup w-full md:w-30rem lg:w-30rem">
                          <InputText
                            type="search"
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                            placeholder="Search Audit Trail Records"
                          />
                          <Button
                            icon="pi pi-search"
                            className="p-button-primary"
                            onClick={handleSearch}
                          />
                        </div>
                      </div>
                    }
                    fileName="Audit Trail Records Export"
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
          </Card>
        </>
      )}
    </>
  );
}

export default RecordsList;
