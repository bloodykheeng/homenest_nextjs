'use client';

import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTablePageEvent } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";

import { getAllOrders } from "@/services/orders/orders-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";
import InlineExpandableText from "@/components/helpers/InlineExpandableText";
import moment from "moment";

import PrimeReactDataTable from "@/components/admin-panel/tables/PrimeReactDataTable";
import DeleteRecordsDialog from "./DeleteRecordsDialog";
import RecordDetailsDialog from "./RecordDetailsDialog";
import CreateRecordDialog from "./CreateRecordDialog";
import EditRecordDialog from "./EditRecordDialog";
import useAuthContext from "@/providers/AuthProvider";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
const SnailErrorLottie = await import("@/public/lottie-files/snail-error-lottie.json").then(m => m.default);

interface RecordsListProps {
    initialSearch?: string;
}

function RecordsList({ initialSearch }: RecordsListProps) {
    const { getUserQuery } = useAuthContext();
    const loggedInUserData = getUserQuery?.data?.data;

    const [globalSearch, setGlobalSearch] = useState(initialSearch || "");
    const [globalSearchTerm, setGlobalSearchTerm] = useState(initialSearch || "");
    const [currentPage, setCurrentPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const getAllOrdersQuery = useQuery({
        queryKey: ["orders", currentPage, rowsPerPage, globalSearchTerm],
        queryFn: (queryProps) =>
            getAllOrders({
                ...queryProps,
                page: currentPage,
                rowsPerPage,
                search: globalSearchTerm,
                paginate: true,
            }),
    });

    useHandleQueryError(getAllOrdersQuery);

    const tableData = getAllOrdersQuery?.data?.data?.data?.data || [];
    const totalRecords = getAllOrdersQuery?.data?.data?.data?.total || 0;
    const perPage = getAllOrdersQuery?.data?.data?.data?.per_page || 5;

    const handleSearch = (e: React.MouseEvent) => {
        e.preventDefault();
        setGlobalSearchTerm(globalSearch);
    };

    const formatDate = (date?: string): string =>
        date ? moment(date).format("Do MMMM YYYY") : "N/A";

    const formatCurrency = (amount?: number): string => {
        if (amount === undefined || amount === null) return "N/A";
        return amount.toFixed(2);
    };

    const onPageChange = (event: DataTablePageEvent) => {
        const newPage = (event?.page ?? 0) + 1;
        setFirst(event.first);
        setCurrentPage(newPage);
        setRowsPerPage(event?.rows);
    };

    type OrderColDefn = {
        id: number;
        payment_option: string;
        subtotal: number;
        tax?: number;
        shipping_fee?: number;
        total: number;
        status: string;
        guest_name?: string;
        guest_email?: string;
        guest_phone?: string;
        created_at: string;
        updated_at: string;
        created_by?: { name: string };
        user?: { name: string; email: string };
        [key: string]: any;
    };

    type ColumnConfig<T> = {
        field: string;
        header: string;
        type?: "date" | "image" | string;
        body?: (rowData: T) => React.ReactNode;
        visible?: boolean;
    };

    const columns: ColumnConfig<OrderColDefn>[] = [
        {
            field: "id",
            header: "ID",
            body: (rowData) => <span className="font-semibold">#{rowData?.id}</span>,
        },
        {
            field: "payment_option",
            header: "Payment Option",
        },
        {
            field: "total",
            header: "Total",
            body: (rowData) => (
                <span className="font-semibold">{formatCurrency(rowData?.total)}</span>
            ),
        },
        {
            field: "status",
            header: "Status",
            body: (rowData) => {
                const statusColors: Record<string, string> = {
                    pending: "bg-yellow-200 text-yellow-800",
                    completed: "bg-green-200 text-green-800",
                    cancelled: "bg-red-200 text-red-800",
                    processing: "bg-blue-200 text-blue-800",
                };
                const colorClass = statusColors[rowData?.status?.toLowerCase()] || "bg-gray-200 text-gray-800";
                return (
                    <span className={`px-2 py-1 rounded text-xs ${colorClass}`}>
                        {rowData?.status || "N/A"}
                    </span>
                );
            },
        },
        {
            field: "guest_name",
            header: "Customer",
            body: (rowData) => (
                <span>
                    {rowData?.guest_name || rowData?.user?.name || "N/A"}
                </span>
            ),
        },
        {
            field: "guest_email",
            header: "Email",
            body: (rowData) => {
                const email = rowData?.guest_email || rowData?.user?.email || "N/A";
                return <InlineExpandableText text={email} maxLength={20} />;
            },
        },
        {
            field: "created_at",
            header: "Created",
            type: "date",
            body: (rowData) => formatDate(rowData?.created_at),
        },
        {
            field: "created_by.name",
            header: "Created By",
            visible: false,
        },
        {
            field: "updated_at",
            header: "Updated",
            type: "date",
            body: (rowData) => formatDate(rowData?.updated_at),
            visible: false,
        },
    ];

    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

    const handleDelete = () => {
        setDeleteDialogVisible(true);
    };

    const [selectedItem, setSelectedItem] = useState<Record<string, any> | null>(null);
    const [showRecordDetailsDialog, setShowRecordDetailsDialog] = useState(false);

    const handleViewRecord = (item: any) => {
        setSelectedItem(item);
        setShowRecordDetailsDialog(true);
    };

    const [showCreateRecord, setShowCreateRecord] = useState(false);
    const handleCreateRecord = () => {
        setShowCreateRecord(true);
    };

    const [showEditRecord, setShowEditRecord] = useState(false);
    const handleEditRecord = (record: any) => {
        setShowEditRecord(true);
        setSelectedItem(record);
    };

    return (
        <>
            {getAllOrdersQuery?.isError ? (
                <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ maxWidth: "400px" }}>
                        <Lottie animationData={SnailErrorLottie} loop={true} autoplay={true} />
                    </div>
                </div>
            ) : (
                <Card className="p-mt-3 p-shadow-2 overflow-auto">
                    <div className="grid">
                        <div className="grid-cols-12 surface-border border-bottom-1">
                            <div className="col-12 flex justify-content-between align-items-center py-2 px-3">
                                <PrimeReactDataTable
                                    data={tableData}
                                    columns={columns}
                                    totalRecords={totalRecords}
                                    rows={perPage}
                                    first={first}
                                    loading={getAllOrdersQuery.isLoading}
                                    onPageChange={onPageChange}
                                    emptyMessage="No Orders found."
                                    headerContent={
                                        <div className="flex flex-wrap gap-2 items-center justify-between">
                                            <h4 className="m-0">Orders List</h4>
                                            <div className="p-inputgroup w-full md:w-30rem lg:w-30rem">
                                                <InputText
                                                    type="search"
                                                    value={globalSearch}
                                                    onChange={(e) => setGlobalSearch(e.target.value)}
                                                    placeholder="Search Orders"
                                                />
                                                <Button
                                                    icon="pi pi-search"
                                                    className="p-button-primary"
                                                    onClick={handleSearch}
                                                />
                                            </div>
                                        </div>
                                    }
                                    fileName="Orders Export"
                                    selection={
                                        loggedInUserData?.permissions?.some(
                                            (permission: string) =>
                                                ["manage orders", "view orders"].includes(permission)
                                        ) ?? false
                                    }
                                    selectedItems={selectedItems as []}
                                    setSelectedItems={setSelectedItems as (items: any[]) => void}
                                    showDelete={
                                        loggedInUserData?.permissions?.includes("manage orders") ?? false
                                    }
                                    handleDelete={handleDelete}
                                    showViewRecord={
                                        loggedInUserData?.permissions?.some(
                                            (permission: string) =>
                                                ["manage orders", "view orders"].includes(permission)
                                        ) ?? false
                                    }
                                    handleViewRecord={handleViewRecord}
                                    showCreateRecord={
                                        loggedInUserData?.permissions?.includes("manage orders") ?? false
                                    }
                                    handleCreateRecord={handleCreateRecord}
                                    showEditRecord={
                                        loggedInUserData?.permissions?.includes("manage orders") ?? false
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
                    />

                    <EditRecordDialog
                        visible={showEditRecord}
                        onHide={() => {
                            setSelectedItem(null);
                            setShowEditRecord(false);
                        }}
                        initialData={selectedItem}
                    />
                </Card>
            )}
        </>
    );
}

export default RecordsList;
