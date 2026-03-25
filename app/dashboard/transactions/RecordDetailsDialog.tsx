"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
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
    const num = Number(amount);
    if (isNaN(num)) return "N/A";
    return num.toFixed(2);
};

const RecordDetailsDialog: React.FC<RecordDetailsDialogProps> = ({
    visible,
    onHide,
    selectedRecord,
}) => {
    const router = useRouter();

    const handleViewOrder = () => {
        router.push(`/dashboard/orders?search=${selectedRecord?.order_id}`);
    };

    const statusSeverity = (status?: string) => {
        switch (status?.toLowerCase()) {
            case "success":
                return "success";
            case "pending":
                return "warning";
            case "initiated":
                return "info";
            case "failed":
                return "danger";
            default:
                return "info";
        }
    };

    return (
        <Dialog
            header={`Transaction #${selectedRecord?.id || "N/A"}`}
            visible={visible}
            style={{ minWidth: "50vw" }}
            modal
            maximizable
            footer={
                <div className="flex justify-end gap-2">
                    <Button
                        label="View Order"
                        icon="pi pi-shopping-cart"
                        onClick={handleViewOrder}
                        className="p-button-outlined"
                    />
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
                {/* Transaction Status */}
                <div className="mb-4">
                    <Tag
                        value={selectedRecord?.status || "N/A"}
                        severity={statusSeverity(selectedRecord?.status)}
                        className="text-lg"
                    />
                </div>

                {/* Transaction Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-sm text-gray-500">Transaction ID</p>
                        <p className="font-medium">#{selectedRecord?.id || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-medium">
                            <Button
                                label={`#${selectedRecord?.order_id || "N/A"}`}
                                link
                                onClick={handleViewOrder}
                                className="p-0"
                            />
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="font-medium">{selectedRecord?.payment_method || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-bold text-lg">
                            {formatCurrency(selectedRecord?.amount)} {selectedRecord?.currency || "USD"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Currency</p>
                        <p className="font-medium">{selectedRecord?.currency || "USD"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <Tag
                            value={selectedRecord?.status || "N/A"}
                            severity={statusSeverity(selectedRecord?.status)}
                        />
                    </div>
                    {selectedRecord?.notes && (
                        <div className="md:col-span-2">
                            <p className="text-sm text-gray-500">Notes</p>
                            <p className="font-medium">{selectedRecord.notes}</p>
                        </div>
                    )}
                </div>

                {/* Order Information */}
                {selectedRecord?.order && (
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 border-b pb-2">Order Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Order Total</p>
                                <p className="font-medium">
                                    {selectedRecord?.order?.total?.toFixed(2) || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Payment Option</p>
                                <p className="font-medium">
                                    {selectedRecord?.order?.payment_option || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Customer</p>
                                <p className="font-medium">
                                    {selectedRecord?.order?.guest_name ||
                                        selectedRecord?.order?.user?.name ||
                                        "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Metadata */}
                <div className="mt-6 pt-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                        <div>
                            <p>Created: {formatDate(selectedRecord?.created_at)}</p>
                            <p>By: {selectedRecord?.created_by?.name || "N/A"}</p>
                        </div>
                        <div>
                            <p>Updated: {formatDate(selectedRecord?.updated_at)}</p>
                            <p>By: {selectedRecord?.updated_by?.name || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default RecordDetailsDialog;
