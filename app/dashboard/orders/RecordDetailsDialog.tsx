"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useRouter } from "next/navigation";
import moment from "moment";
import { Tag } from "primereact/tag";
import OrderPrint from "./OrderPrint";
import CloseOrderButton from "./CloseOrderButton";

interface RecordDetailsDialogProps {
    visible: boolean;
    onHide: () => void;
    selectedRecord: any;
}

const formatDate = (date?: string): string =>
    date ? moment(date).format("Do MMMM YYYY, h:mm A") : "N/A";

const formatCurrency = (amount?: number | string | null): string => {
    if (amount === undefined || amount === null) return "N/A";
    const num = Number(amount);
    if (isNaN(num)) return "N/A";
    return new Intl.NumberFormat("en-UG", {
        style: "currency",
        currency: "UGX",
    }).format(num);
};

const orderStatusSeverity = (
    status?: string
): "success" | "warning" | "info" | "danger" | null => {
    switch (status?.toLowerCase()) {
        case "completed": return "success";
        case "pending": return "warning";
        case "cancelled": return "danger";
        default: return "info";
    }
};

const transactionStatusSeverity = (
    status?: string
): "success" | "warning" | "info" | "danger" | null => {
    switch (status?.toLowerCase()) {
        case "success": return "success";
        case "pending": return "warning";
        case "initiated": return "info";
        case "failed": return "danger";
        default: return "info";
    }
};

const InfoRow: React.FC<{
    label: string;
    value?: React.ReactNode;
    span?: boolean;
}> = ({ label, value, span }) => (
    <div className={span ? "md:col-span-2 lg:col-span-3" : ""}>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">
            {label}
        </p>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
            {value || "N/A"}
        </p>
    </div>
);

const SectionHeader: React.FC<{
    title: string;
    right?: React.ReactNode;
}> = ({ title, right }) => (
    <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 m-0">
            {title}
        </h4>
        {right}
    </div>
);

const RecordDetailsDialog: React.FC<RecordDetailsDialogProps> = ({
    visible,
    onHide,
    selectedRecord,
}) => {
    const router = useRouter();

    const transactions = selectedRecord?.transactions || [];
    const orderItems = selectedRecord?.items || [];

    const handleViewTransactions = () =>
        router.push(`/dashboard/transactions?orderId=${selectedRecord?.id}`);

    const handleAddTransaction = () =>
        router.push(
            `/dashboard/transactions?orderId=${selectedRecord?.id}&create=true`
        );

    const transactionStatusBody = (rowData: any) => (
        <Tag
            value={rowData.status || "N/A"}
            severity={transactionStatusSeverity(rowData.status)}
        />
    );

    const transactionDateBody = (rowData: any) => (
        <span className="text-sm">{formatDate(rowData.created_at)}</span>
    );

    const dialogFooter = (
        <div className="flex justify-between items-center gap-2 flex-wrap">
            <div className="flex gap-2 flex-wrap items-center">
                <OrderPrint orderData={selectedRecord} />

                {selectedRecord?.status?.toLowerCase() !== "completed" && (
                    <CloseOrderButton
                        orderId={selectedRecord?.id}
                        buttonSize="small"
                    />
                )}
            </div>

            <Button
                label="Close"
                icon="pi pi-times"
                onClick={onHide}
                className="p-button-text"
            />
        </div>
    );

    return (
        <Dialog
            header={
                <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-gray-800 dark:text-gray-100">
                        Order{" "}
                        <span className="font-mono text-blue-600 dark:text-blue-400">
                            #{selectedRecord?.order_number || selectedRecord?.id || "N/A"}
                        </span>
                    </span>
                    <Tag
                        value={selectedRecord?.status || "N/A"}
                        severity={orderStatusSeverity(selectedRecord?.status)}
                    />
                </div>
            }
            visible={visible}
            style={{ minWidth: "80vw" }}
            modal
            maximizable
            footer={dialogFooter}
            onHide={onHide}
            closeOnEscape
            closable
        >
            <div className="p-4 space-y-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">

                {/* ── Order Information ──────────────────────────────── */}
                <section>
                    <SectionHeader title="Order Information" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-5">
                        <InfoRow label="Payment Option" value={selectedRecord?.payment_option} />
                        <InfoRow label="Subtotal" value={formatCurrency(selectedRecord?.subtotal)} />
                        <InfoRow label="Tax" value={formatCurrency(selectedRecord?.tax)} />
                        <InfoRow label="Shipping Fee" value={formatCurrency(selectedRecord?.shipping_fee)} />
                        <InfoRow
                            label="Total"
                            value={
                                <span className="text-base font-bold text-green-600 dark:text-green-400">
                                    {formatCurrency(selectedRecord?.total)}
                                </span>
                            }
                        />
                        <InfoRow label="Guest Name" value={selectedRecord?.guest_name} />
                        <InfoRow label="Guest Email" value={selectedRecord?.guest_email} />
                        <InfoRow label="Guest Phone" value={selectedRecord?.guest_phone} />
                        <InfoRow
                            label="Shipping Address"
                            value={selectedRecord?.shipping_address}
                            span
                        />
                        {selectedRecord?.notes && (
                            <InfoRow label="Notes" value={selectedRecord?.notes} span />
                        )}
                    </div>
                </section>

                {/* ── Order Items ────────────────────────────────────── */}
                <section>
                    <SectionHeader title={`Order Items (${orderItems.length})`} />
                    {orderItems.length > 0 ? (
                        <DataTable
                            value={orderItems}
                            size="small"
                            className="p-datatable-sm"
                            rowClassName={() =>
                                "bg-white dark:bg-gray-800 dark:text-gray-100"
                            }
                        >
                            <Column field="product_name" header="Product" />
                            <Column field="product_sku" header="SKU" />
                            <Column field="quantity" header="Qty" />
                            <Column
                                field="unit_price"
                                header="Unit Price"
                                body={(row) => formatCurrency(row.unit_price)}
                            />
                            <Column
                                field="total_price"
                                header="Total"
                                body={(row) => (
                                    <span className="font-semibold">
                                        {formatCurrency(row.total_price)}
                                    </span>
                                )}
                            />
                        </DataTable>
                    ) : (
                        <div className="text-center py-6 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <p className="text-gray-500 dark:text-gray-400">
                                No items in this order
                            </p>
                        </div>
                    )}
                </section>

                {/* ── Transactions ──────────────────────────────────── */}
                <section>
                    <SectionHeader
                        title={`Transactions (${transactions.length})`}
                        right={
                            <div className="flex gap-2">
                                <Button
                                    label="View All"
                                    icon="pi pi-eye"
                                    size="small"
                                    outlined
                                    onClick={handleViewTransactions}
                                />
                                <Button
                                    label="Add Transaction"
                                    icon="pi pi-plus"
                                    size="small"
                                    onClick={handleAddTransaction}
                                />
                            </div>
                        }
                    />
                    {transactions.length > 0 ? (
                        <DataTable
                            value={transactions}
                            size="small"
                            className="p-datatable-sm"
                            rowClassName={() =>
                                "bg-white dark:bg-gray-800 dark:text-gray-100"
                            }
                        >
                            <Column field="id" header="ID" style={{ width: "70px" }} />
                            <Column field="payment_method" header="Payment Method" />
                            <Column
                                field="amount"
                                header="Amount"
                                body={(row) => formatCurrency(row.amount)}
                            />
                            <Column
                                field="status"
                                header="Status"
                                body={transactionStatusBody}
                            />
                            <Column
                                field="created_at"
                                header="Date"
                                body={transactionDateBody}
                            />
                        </DataTable>
                    ) : (
                        <div className="text-center py-6 rounded-lg bg-gray-50 dark:bg-gray-800 space-y-3">
                            <p className="text-gray-500 dark:text-gray-400">
                                No transactions found
                            </p>
                            <Button
                                label="Add Transaction"
                                icon="pi pi-plus"
                                size="small"
                                onClick={handleAddTransaction}
                            />
                        </div>
                    )}
                </section>

                {/* ── Metadata ──────────────────────────────────────── */}
                <section className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
                            <p>
                                <span className="font-semibold">Created:</span>{" "}
                                {formatDate(selectedRecord?.created_at)}
                            </p>
                            <p>
                                <span className="font-semibold">By:</span>{" "}
                                {selectedRecord?.created_by?.name || "N/A"}
                            </p>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
                            <p>
                                <span className="font-semibold">Updated:</span>{" "}
                                {formatDate(selectedRecord?.updated_at)}
                            </p>
                            <p>
                                <span className="font-semibold">By:</span>{" "}
                                {selectedRecord?.updated_by?.name || "N/A"}
                            </p>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
                            <p>
                                <span className="font-semibold">User:</span>{" "}
                                {selectedRecord?.user?.name ||
                                    selectedRecord?.user?.email ||
                                    "N/A"}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </Dialog>
    );
};

export default RecordDetailsDialog;
