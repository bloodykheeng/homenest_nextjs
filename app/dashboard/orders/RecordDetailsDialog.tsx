"use client";

import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useRouter } from "next/navigation";
import moment from "moment";
import { Tag } from "primereact/tag";

interface RecordDetailsDialogProps {
    visible: boolean;
    onHide: () => void;
    selectedRecord: any;
}

const formatDate = (date?: string): string =>
    date ? moment(date).format("Do MMMM YYYY, h:mm A") : "N/A";

const formatCurrency = (amount?: number): string => {
    if (amount === undefined || amount === null) return "N/A";
    return amount.toFixed(2);
};

const RecordDetailsDialog: React.FC<RecordDetailsDialogProps> = ({
    visible,
    onHide,
    selectedRecord,
}) => {
    const router = useRouter();
    const [showAddTransaction, setShowAddTransaction] = useState(false);

    const transactions = selectedRecord?.transactions || [];
    const orderItems = selectedRecord?.items || [];

    const handleViewTransactions = () => {
        router.push(`/dashboard/transactions?orderId=${selectedRecord?.id}`);
    };


    const handleAddTransaction = () => {
        router.push(`/dashboard/transactions?orderId=${selectedRecord?.id}&create=true`);
    };

    const transactionStatusBody = (rowData: any) => {
        const severityMap: Record<string, "success" | "info" | "warning" | "danger" | null> = {
            success: "success",
            pending: "warning",
            initiated: "info",
            failed: "danger",
        };
        return (
            <Tag
                value={rowData.status || "N/A"}
                severity={severityMap[rowData.status?.toLowerCase()] || "info"}
            />
        );
    };

    const transactionDateBody = (rowData: any) => formatDate(rowData.created_at);

    return (
        <Dialog
            header={`Order #${selectedRecord?.id || "N/A"}`}
            visible={visible}
            style={{ minWidth: "80vw" }}
            modal
            maximizable
            footer={
                <div className="flex justify-end gap-2">
                    <Button
                        label="Close"
                        icon="pi pi-times"
                        onClick={onHide}
                        className="p-button-text"
                    />
                </div>
            }
            onHide={onHide}
            closeOnEscape
            closable
        >
            <div className="p-4">
                {/* Order Status */}
                <div className="mb-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Order Details</h3>
                        <Tag
                            value={selectedRecord?.status || "N/A"}
                            severity={
                                selectedRecord?.status === "completed"
                                    ? "success"
                                    : selectedRecord?.status === "pending"
                                        ? "warning"
                                        : "info"
                            }
                        />
                    </div>
                </div>

                {/* Order Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div>
                        <p className="text-sm text-gray-500">Payment Option</p>
                        <p className="font-medium">{selectedRecord?.payment_option || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="font-medium">{formatCurrency(selectedRecord?.subtotal)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Tax</p>
                        <p className="font-medium">{formatCurrency(selectedRecord?.tax)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Shipping Fee</p>
                        <p className="font-medium">{formatCurrency(selectedRecord?.shipping_fee)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-bold text-lg">{formatCurrency(selectedRecord?.total)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Guest Name</p>
                        <p className="font-medium">
                            {selectedRecord?.guest_name || "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Guest Email</p>
                        <p className="font-medium">
                            {selectedRecord?.guest_email || "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Guest Phone</p>
                        <p className="font-medium">
                            {selectedRecord?.guest_phone || "N/A"}
                        </p>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                        <p className="text-sm text-gray-500">Shipping Address</p>
                        <p className="font-medium">
                            {selectedRecord?.shipping_address || "N/A"}
                        </p>
                    </div>
                    {selectedRecord?.notes && (
                        <div className="md:col-span-2 lg:col-span-3">
                            <p className="text-sm text-gray-500">Notes</p>
                            <p className="font-medium">{selectedRecord?.notes}</p>
                        </div>
                    )}
                </div>

                {/* Order Items */}
                <div className="mb-6">
                    <h4 className="text-md font-semibold mb-3 border-b pb-2">Order Items</h4>
                    {orderItems.length > 0 ? (
                        <DataTable value={orderItems} size="small" className="mb-4">
                            <Column field="product_name" header="Product" />
                            <Column field="product_sku" header="SKU" />
                            <Column field="quantity" header="Quantity" />
                            <Column
                                field="unit_price"
                                header="Unit Price"
                                body={(row) => formatCurrency(row.unit_price)}
                            />
                            <Column
                                field="total_price"
                                header="Total"
                                body={(row) => formatCurrency(row.total_price)}
                            />
                        </DataTable>
                    ) : (
                        <p className="text-gray-500">No items in this order</p>
                    )}
                </div>

                {/* Transactions Section */}
                <div>
                    <div className="flex justify-between items-center mb-3 border-b pb-2">
                        <h4 className="text-md font-semibold m-0">
                            Transactions ({transactions.length})
                        </h4>
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
                    </div>
                    {transactions.length > 0 ? (
                        <DataTable value={transactions} size="small">
                            <Column field="id" header="ID" style={{ width: "80px" }} />
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
                        <div className="text-center p-4 bg-gray-50 rounded">
                            <p className="text-gray-500 mb-2">No transactions found</p>
                            <Button
                                label="Add Transaction"
                                icon="pi pi-plus"
                                size="small"
                                onClick={handleAddTransaction}
                            />
                        </div>
                    )}
                </div>

                {/* Metadata */}
                <div className="mt-6 pt-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                        <div>
                            <p>Created: {formatDate(selectedRecord?.created_at)}</p>
                            <p>By: {selectedRecord?.created_by?.name || "N/A"}</p>
                        </div>
                        <div>
                            <p>Updated: {formatDate(selectedRecord?.updated_at)}</p>
                            <p>By: {selectedRecord?.updated_by?.name || "N/A"}</p>
                        </div>
                        <div>
                            <p>User: {selectedRecord?.user?.name || selectedRecord?.user?.email || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default RecordDetailsDialog;
