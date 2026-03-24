'use client';

import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTablePageEvent } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { getAllTransactions } from "@/services/transactions/transactions-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";
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
    preselectedOrderId?: number;
    openCreateDialog?: boolean;
}

function RecordsList({ preselectedOrderId, openCreateDialog }: RecordsListProps) {
    const router = useRouter();
    const { getUserQuery } = useAuthContext();
    const loggedInUserData = getUserQuery?.data?.data;

    const [globalSearch, setGlobalSearch] = useState(preselectedOrderId ? String(preselectedOrderId) : "");
    const [globalSearchTerm, setGlobalSearchTerm] = useState(preselectedOrderId ? String(preselectedOrderId) : "");
    const [currentPage, setCurrentPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const getAllTransactionsQuery = useQuery({
        queryKey: ["transactions", currentPage, rowsPerPage, globalSearchTerm],
        queryFn: (queryProps) =>
            getAllTransactions({
                ...queryProps,
                page: currentPage,
                rowsPerPage,
                search: globalSearchTerm,
                paginate: true,
                order_id: preselectedOrderId,
            }),
        enabled: true,
    });

    useHandleQueryError(getAllTransactionsQuery);

    const tableData = getAllTransactionsQuery?.data?.data?.data?.data || [];
    const totalRecords = getAllTransactionsQuery?.data?.data?.data?.total || 0;
    const perPage = getAllTransactionsQuery?.data?.data?.data?.per_page || 5;

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

    type TransactionColDefn = {
        id: number;
        order_id: number;
        payment_method: string;
        amount: number;
        currency?: string;
        status: string;
        notes?: string;
        created_at: string;
        updated_at: string;
        created_by?: { name: string };
        order?: { id: number; total: number; guest_name?: string };
        [key: string]: any;
    };

    type ColumnConfig<T> = {
        field: string;
        header: string;
        type?: "date" | "image" | string;
        body?: (rowData: T) => React.ReactNode;
        visible?: boolean;
    };

    const columns: ColumnConfig<TransactionColDefn>[] = [
        {
            field: "id",
            header: "ID",
            body: (rowData) => <span className="font-semibold">#{rowData?.id}</span>,
        },
        {
            field: "order_id",
            header: "Order",
            body: (rowData) => (
                <Button
                    label={`#${rowData?.order_id}`}
                    link
                    onClick={() => router.push(`/dashboard/orders?search=${rowData?.order_id}`)}
                    className="p-0"
                />
            ),
        },
        {
            field: "payment_method",
            header: "Payment Method",
        },
        {
            field: "amount",
            header: "Amount",
            body: (rowData) => (
                <span className="font-semibold">
                    {formatCurrency(rowData?.amount)} {rowData?.currency || "USD"}
                </span>
            ),
        },
        {
            field: "status",
            header: "Status",
            body: (rowData) => {
                const statusColors: Record<string, string> = {
                    success: "bg-green-200 text-green-800",
                    pending: "bg-yellow-200 text-yellow-800",
                    initiated: "bg-blue-200 text-blue-800",
                    failed: "bg-red-200 text-red-800",
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
            field: "order.total",
            header: "Order Total",
            body: (rowData) => formatCurrency(rowData?.order?.total),
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

    const [showCreateRecord, setShowCreateRecord] = useState(openCreateDialog || false);
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
            {getAllTransactionsQuery?.isError ? (
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
                                    loading={getAllTransactionsQuery.isLoading}
                                    onPageChange={onPageChange}
                                    emptyMessage={
                                        preselectedOrderId
                                            ? "No transactions found for this order."
                                            : "No Transactions found."
                                    }
                                    headerContent={
                                        <div className="flex flex-wrap gap-2 items-center justify-between">
                                            <div>
                                                <h4 className="m-0">Transactions List</h4>
                                                {preselectedOrderId && (
                                                    <small className="text-gray-500">
                                                        Filtered by Order #{preselectedOrderId}
                                                    </small>
                                                )}
                                            </div>
                                            <div className="p-inputgroup w-full md:w-30rem lg:w-30rem">
                                                <InputText
                                                    type="search"
                                                    value={globalSearch}
                                                    onChange={(e) => setGlobalSearch(e.target.value)}
                                                    placeholder="Search Transactions"
                                                />
                                                <Button
                                                    icon="pi pi-search"
                                                    className="p-button-primary"
                                                    onClick={handleSearch}
                                                />
                                            </div>
                                        </div>
                                    }
                                    fileName="Transactions Export"
                                    selection={
                                        loggedInUserData?.permissions?.some(
                                            (permission: string) =>
                                                ["manage transactions", "view transactions"].includes(permission)
                                        ) ?? false
                                    }
                                    selectedItems={selectedItems as []}
                                    setSelectedItems={setSelectedItems as (items: any[]) => void}
                                    showDelete={
                                        loggedInUserData?.permissions?.includes("manage transactions") ?? false
                                    }
                                    handleDelete={handleDelete}
                                    showViewRecord={
                                        loggedInUserData?.permissions?.some(
                                            (permission: string) =>
                                                ["manage transactions", "view transactions"].includes(permission)
                                        ) ?? false
                                    }
                                    handleViewRecord={handleViewRecord}
                                    showCreateRecord={
                                        loggedInUserData?.permissions?.includes("manage transactions") ?? false
                                    }
                                    handleCreateRecord={handleCreateRecord}
                                    showEditRecord={
                                        loggedInUserData?.permissions?.includes("manage transactions") ?? false
                                    }
                                    handleEditRecord={handleEditRecord}
                                />
                            </div>
                        </div>
                    </div>

                    <DeleteRecordsDialog
                        visible={deleteDialogVisible}
                        onHide={() => setDeleteDialogVisible(false)}
                        selectedItems={selectedItems as []}
                        setSelectedItems={setSelectedItems as (items: any[]) => void}
                    />

                    <RecordDetailsDialog
                        visible={showRecordDetailsDialog}
                        onHide={() => setShowRecordDetailsDialog(false)}
                        selectedRecord={selectedItem}
                    />

                    <CreateRecordDialog
                        visible={showCreateRecord}
                        onHide={() => {
                            setShowCreateRecord(false);
                            // Clear URL params if we added them
                            if (searchParams?.get("create")) {
                                router.replace(`/dashboard/transactions${orderIdParam ? `?orderId=${orderIdParam}` : ""}`);
                            }
                        }}
                        preselectedOrderId={preselectedOrderId}
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
