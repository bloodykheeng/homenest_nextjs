'use client'

import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTablePageEvent } from 'primereact/datatable';

import { InputText } from "primereact/inputtext";
import { useRouter } from 'nextjs-toploader/app';

import {
    getAllNotifications,
} from "@/services/notifications/notifications-service";

import useHandleQueryError from "@/hooks/useHandleQueryError";

import MaterialUiLoaderLottie from "@/public/lottie-files/material-ui-loading-lottie.json";
import SnailErrorLottie from "@/public/lottie-files/snail-error-lottie.json";
// import SateLiteLottie from "@/public/lottie-files/satelite-loading-lottie.json";
// import FileLoadingLottie from "@/public/lottie-files/FileLoadingLottie.json";
import SkeletonLoadingLottie from "@/public/lottie-files/SkeletonLoadingLottie.json";
import NoDataLottie from "@/public/lottie-files/nodata.json";


import InlineExpandableText from "@/components/helpers/InlineExpandableText"
import moment from 'moment'

import { useQuery } from "@tanstack/react-query";

import PrimeReactDataTable from "@/components/admin-panel/tables/PrimeReactDataTable";

import DeleteRecordsDialog from "./DeleteRecordsDialog";
import RecordDetailsDialog from "./RecordDetailsDialog"
import CreateRecordDialog from "./CreateRecordDialog"
import EditRecordDialog from "./EditRecordDialog"

import useAuthContext from "@/providers/AuthProvider";


import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });


function RecordsList() {

    const { getUserQuery } = useAuthContext();
    const loggedInUserData = getUserQuery?.data?.data;

    const [globalSearch, setGlobalSearch] = useState("");
    const [globalSearchTearm, setGlobalSearchTearm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5)

    // Fetch data using useQuery
    const getAllNotificationsQuery = useQuery({
        queryKey: ["notifications", currentPage, rowsPerPage, globalSearchTearm, "paginate"],
        queryFn: (queryprops) => getAllNotifications({ ...queryprops, page: currentPage, rowsPerPage, search: globalSearchTearm, paginate: true }),
    });
    console.log("🚀 ~ RecordsList ~ getAllNotificationsQuery:", getAllNotificationsQuery)

    useHandleQueryError(getAllNotificationsQuery);



    // Extract data and pagination details from the query result
    const tableData = getAllNotificationsQuery?.data?.data?.data?.data || [];
    const totalRecords = getAllNotificationsQuery?.data?.data?.data?.total || 0;
    const perPage = getAllNotificationsQuery?.data?.data?.data?.per_page || 5;
    const lastPage = getAllNotificationsQuery?.data?.data?.data?.last_page || 1;



    const handleSearch = (e: any) => {
        e.preventDefault()
        setGlobalSearchTearm(globalSearch)
    }


    // Helper function to format dates
    const formatDate = (date?: string): string =>
        date ? moment(date).format("Do MMMM YYYY") : "N/A";

    // Handle page change in the DataTable
    const onPageChange = (event: DataTablePageEvent) => {
        console.log("🚀 ~ onPageChange ~ event:", event)

        const newPage = (event?.page ?? 0) + 1;
        setFirst(event.first);
        setCurrentPage(newPage);

        setRowsPerPage(event?.rows)
    };


    type NotificationColDefn = {
        id: number;
        title: string;
        description?: string;
        type: "User" | "System";
        start_date: string;
        end_date: string;
        gender?: string;
        status: "active" | "inactive";
        target_audience: "All Users" | "CSOs" | "Oversight Institutions" | "Geographical" | "Users";
        scope?: "States" | "Regions" | "Districts" | "Wards" | "Villages";
        csos?: { id: number; name: string }[];
        oversight_institutions?: { id: number; name: string }[];
        states?: { id: number; name: string }[];
        regions?: { id: number; name: string }[];
        districts?: { id: number; name: string }[];
        wards?: { id: number; name: string }[];
        villages?: { id: number; name: string }[];
        selected_users?: { id: number; name: string }[];
        created_at: string;
        updated_at: string;
        created_by?: { name: string };
        [key: string]: any;
    };

    type ColumnConfig<T> = {
        field: string;
        header: string;
        type?: "date" | "image" | string;
        body?: (rowData: T) => React.ReactNode;
        visible?: boolean;
    };

    // Column definitions updated for notifications
    const columns: ColumnConfig<NotificationColDefn>[] = [
        {
            field: "title", header: "Title",
            body: (rowData) => {
                const maxLength = 20;
                const textToDisplay = rowData?.title ?? "N/A";
                return (
                    <InlineExpandableText text={textToDisplay} maxLength={maxLength} />
                );
            },
        },
        {
            field: "description", header: "Description",
            body: (rowData) => {
                const maxLength = 30;
                const textToDisplay = rowData?.description ?? "N/A";
                return (
                    <InlineExpandableText text={textToDisplay} maxLength={maxLength} />
                );
            },
            visible: true
        },
        {
            field: "type",
            header: "Type",
            body: (rowData) => <span>{rowData?.type || "N/A"}</span>,
        },
        {
            field: "start_date",
            header: "Start Date",
            type: "date",
            body: (rowData) => formatDate(rowData?.start_date)
        },
        {
            field: "end_date",
            header: "End Date",
            type: "date",
            body: (rowData) => formatDate(rowData?.end_date)
        },
        {
            field: "gender",
            header: "Gender",
            body: (rowData) => <span>{rowData?.gender || "N/A"}</span>,
            visible: false
        },
        {
            field: "target_audience",
            header: "Target Audience",
            body: (rowData) => <span>{rowData?.target_audience || "N/A"}</span>
        },
        {
            field: "scope",
            header: "Scope",
            body: (rowData) => <span>{rowData?.scope || "N/A"}</span>,
            visible: false
        },
        {
            field: "status",
            header: "Status",
            body: (rowData) => (
                <span className={`px-2 py-1 rounded ${rowData.status === "active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                    {rowData.status}
                </span>
            )
        },
        {
            field: "created_by.name",
            header: "Created By",
            body: (rowData) => <span>{rowData?.created_by?.name ?? "N/A"}</span>,
            visible: false
        },
        {
            field: "created_at",
            header: "Created At",
            type: "date",
            body: (rowData) => formatDate(rowData?.created_at),
            visible: false
        },
        {
            field: "updated_at",
            header: "Updated At",
            type: "date",
            body: (rowData) => formatDate(rowData?.updated_at),
            visible: false
        },
    ];


    const [selectedItems, setSelectedItems] = useState<[]>([])
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

    // Handle delete action
    const handleDelete = () => {
        console.log("clicked handle delete")
        setDeleteDialogVisible(true);
    };


    //================== viewing a record ================
    const [selectedItem, setSelectedItem] = useState<Record<string, any> | null>(null);
    const [showRecordDetailsDialog, setShowRecordDetailsDialog] = useState(false);

    const handleViewRecord = (Item: any) => {
        setSelectedItem(Item)
        setShowRecordDetailsDialog(true)
    }

    //=================== creating a record ==========================
    const [showCreateRecord, setShowCreateRecord] = useState(false)
    const handleCreateRecord = () => {
        setShowCreateRecord(true)
    }

    //=================== editing a record ==========================
    const [showEditRecord, setShowEditRecord] = useState(false)
    const handleEditRecord = (record: any) => {
        setShowEditRecord(true)
        setSelectedItem(record)
    }





    return (<>
        {getAllNotificationsQuery?.isError ? (
            <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ maxWidth: "400px" }}>
                    <Lottie animationData={SnailErrorLottie} loop={true} autoplay={true} />
                </div>
            </div>
        ) : (
            <>
                <Card className="p-mt-3 p-shadow-2 overflow-auto "
                    pt={{
                        body: { className: '!p-1 md:p-1 sm:p-1 lg:p-5' }
                    }}>

                    <div className="grid">
                        <div className="grid-cols-12 surface-border border-bottom-1">
                            <div className="col-12 flex justify-content-between align-items-center py-2 px-3">
                                <PrimeReactDataTable
                                    data={tableData}
                                    columns={columns}
                                    totalRecords={totalRecords}
                                    rows={perPage}
                                    first={first}
                                    loading={getAllNotificationsQuery.isLoading}
                                    onPageChange={onPageChange}
                                    emptyMessage="No Notifications found."
                                    headerContent={
                                        <div className="flex flex-wrap gap-2 items-center justify-between">
                                            <h4 className="m-0">Notifications List</h4>
                                            <div className="p-inputgroup w-full md:w-30rem lg:w-30rem">
                                                <InputText
                                                    type="search"
                                                    value={globalSearch}
                                                    onChange={(e) => setGlobalSearch(e.target.value)}
                                                    placeholder="Search Notifications"
                                                />
                                                <Button icon="pi pi-search" className="p-button-primary" onClick={handleSearch} />
                                            </div>
                                        </div>
                                    }
                                    fileName="Notifications Export"

                                    // selection
                                    selection={loggedInUserData?.permissions?.some((permission: string) =>
                                        ["manage notifications",].includes(permission)
                                    )}
                                    selectedItems={selectedItems}
                                    setSelectedItems={(items) => setSelectedItems(items)}

                                    // deleting
                                    showDelete={!!loggedInUserData?.permissions?.includes("manage notifications")}
                                    handleDelete={handleDelete}

                                    // show records
                                    showViewRecord={!!loggedInUserData?.permissions?.includes("manage notifications")}
                                    handleViewRecord={handleViewRecord}

                                    // creating a record
                                    showCreateRecord={!!loggedInUserData?.permissions?.includes("manage notifications")}
                                    handleCreateRecord={handleCreateRecord}

                                    // editing a record
                                    showEditRecord={!!loggedInUserData?.permissions?.includes("manage notifications")}
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
                    />


                    <EditRecordDialog
                        visible={showEditRecord}
                        onHide={() => {
                            setSelectedItem(null)
                            setShowEditRecord(false)
                        }}
                        initialData={selectedItem}
                    />

                </Card>
            </>)}
    </>

    )


}

export default RecordsList