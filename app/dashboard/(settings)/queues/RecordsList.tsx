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
  getAllJobs,
  getAllFailedJobs,
  getAllJobStats,
  postToBulkDestroyFailedJobs,
} from "@/services/jobs/jobs-service";

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

function RecordsList({ queueType = "jobs" }: { queueType: "jobs" | "failed"; }) {
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
  // Fetch data using useQuery based on queueType
  const getQueueDataQuery = useQuery({
    queryKey: [
      'queues',
      queueType, // "jobs" or "failed"
      currentPage,
      rowsPerPage,
      globalSearchTearm,
      "paginate",
      selectedFilters,
    ],
    queryFn: (queryprops) => {
      const params = {
        ...queryprops,
        page: currentPage,
        rowsPerPage,
        search: globalSearchTearm,
        paginate: true,
        ...selectedFilters,
      };

      if (queueType === "jobs") {
        return getAllJobs(params);
      } else {
        return getAllFailedJobs(params);
      }
    },
  });

  console.log(
    "🚀 ~ RecordsList ~ getQueueDataQuery:",
    getQueueDataQuery
  );

  useHandleQueryError(getQueueDataQuery);

  // Extract data and pagination details from the query result
  const tableData = getQueueDataQuery?.data?.data?.data?.data || [];
  const totalRecords =
    getQueueDataQuery?.data?.data?.data?.total || 0;
  const perPage = getQueueDataQuery?.data?.data?.data?.per_page || 5;
  const lastPage =
    getQueueDataQuery?.data?.data?.data?.last_page || 1;

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



  // Corrected ColDefn type to align with FormData
  type QuesDefn = {
    id: number;
    queue: string;
    payload: string;
    attempts: number;
    reserved_at?: number | null;
    available_at?: number | null;
    created_at?: number | null;
    [key: string]: any;
  };

  // Definition for failed jobs
  type FailedJobDefn = {
    id: number;
    uuid: string;
    connection: string;
    queue: string;
    payload: string;
    exception: string;
    failed_at: string;
    [key: string]: any;
  };

  type JobDefn = QuesDefn | FailedJobDefn;

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
  const queuesColumns: ColumnConfig<JobDefn>[] = [
    {
      field: "id",
      header: "#",
      body: (rowData) => <div>{rowData?.id}</div>,
    },
    {
      field: "queue",
      header: "Queue",
      body: (rowData) => <span>{rowData?.queue || "N/A"}</span>,
    },
    {
      field: "payload",
      header: "Payload",
      body: (rowData) => {
        const maxLength = 50;
        return (
          <InlineExpandableText
            text={rowData?.payload || "{}"}
            maxLength={maxLength}
          />
        );
      },
    },
    {
      field: "attempts",
      header: "Attempts",
      body: (rowData) => <span>{rowData?.attempts ?? 0}</span>,
    },
    {
      field: "reserved_at",
      header: "Reserved At",
      type: "date",
      body: (rowData) =>
        rowData?.reserved_at ? (
          <div>
            {moment.unix(rowData.reserved_at).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        ) : (
          <span>Not Reserved</span>
        ),
    },
    {
      field: "available_at",
      header: "Available At",
      type: "date",
      body: (rowData) =>
        rowData?.available_at ? (
          <div>
            {moment.unix(rowData.available_at).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        ) : (
          <span>N/A</span>
        ),
    },
    {
      field: "created_at",
      header: "Created At",
      type: "date",
      body: (rowData) =>
        rowData?.created_at ? (
          <div>
            {moment.unix(rowData.created_at).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        ) : (
          <span>N/A</span>
        ),
    },
  ];



  const failedJobColumns: ColumnConfig<JobDefn>[] = [
    {
      field: "id",
      header: "#",
      body: (rowData) => <div>{rowData?.id}</div>,
    },
    {
      field: "uuid",
      header: "UUID",
      body: (rowData) => {
        const maxLength = 25;
        return (
          <InlineExpandableText text={rowData?.uuid || "N/A"} maxLength={maxLength} />
        );
      },
    },
    {
      field: "connection",
      header: "Connection",
      body: (rowData) => <span>{rowData?.connection || "N/A"}</span>,
    },
    {
      field: "queue",
      header: "Queue",
      body: (rowData) => <span>{rowData?.queue || "N/A"}</span>,
    },
    {
      field: "payload",
      header: "Payload",
      body: (rowData) => {
        const maxLength = 50;
        return (
          <InlineExpandableText text={rowData?.payload || "{}"} maxLength={maxLength} />
        );
      },
    },
    {
      field: "exception",
      header: "Exception",
      body: (rowData) => {
        const maxLength = 80;
        return (
          <InlineExpandableText text={rowData?.exception || "No exception"} maxLength={maxLength} />
        );
      },
    },
    {
      field: "failed_at",
      header: "Failed At",
      type: "date",
      body: (rowData) =>
        rowData?.failed_at ? (
          <div>{moment(rowData.failed_at).format("YYYY-MM-DD HH:mm:ss")}</div>
        ) : (
          <span>N/A</span>
        ),
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
      {getQueueDataQuery?.isError ? (
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
                    columns={queueType === 'jobs' ? queuesColumns : failedJobColumns}
                    totalRecords={totalRecords}
                    rows={perPage}
                    first={first}
                    loading={getQueueDataQuery.isPending}
                    onPageChange={onPageChange}
                    emptyMessage={
                      queueType === "jobs"
                        ? "No Queues Records found."
                        : "No Failed Queue Records found."
                    }

                    headerContent={
                      <div className="flex flex-wrap gap-2 items-center justify-between">
                        <h4 className="m-0"> {queueType === "jobs" ? "Queues" : "Failed Queues"} Records List</h4>
                        <div className="p-inputgroup w-full md:w-30rem lg:w-30rem">
                          <InputText
                            type="search"
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                            placeholder={`Search ${queueType === "jobs" ? "Queues" : "Failed Queues"} Records`}
                          />
                          <Button
                            icon="pi pi-search"
                            className="p-button-primary"
                            onClick={handleSearch}
                          />
                        </div>
                      </div>
                    }
                    fileName={`${queueType === "jobs" ? "Queues" : "Failed Queues"} Records Export`}
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
              queueType={queueType}
            />

            <RecordDetailsDialog
              visible={showRecordDetailsDialog}
              onHide={() => setShowRecordDetailsDialog(false)}
              selectedRecord={selectedItem}
              queueType={queueType}
            />
          </Card>
        </>
      )}
    </>
  );
}

export default RecordsList;
