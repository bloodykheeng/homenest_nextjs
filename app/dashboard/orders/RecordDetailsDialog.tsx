"use client";

import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { useRouter } from "nextjs-toploader/app";
import moment from "moment";

import CreateTransactionDialog from "../transactions/CreateRecordDialog";

interface RecordDetailsDialogProps {
    visible: boolean;
    onHide: () => void;
    selectedRecord: any;
}

const formatDate = (date?: string): string =>
    date ? moment(date).format("Do MMMM YYYY, h:mm A") : "N/A";

const statusSeverity = (status: string) => {
    const map: Record<string, any> = {
        pending: "warning",
        processing: "info",
        completed: "success",
        cancelled: "danger",
        success: "success",
        failed: "danger",
        initiated: "info",
    };
    return map[status] || "secondary";
};

const RecordDetailsDialog: React.FC<RecordDetailsDialogProps> = ({ visible, onHide, selectedRecord }) => {
    const router = useRouter();
    const [showAddTransaction, setShowAddTransaction] = useState(false);

    const transactions: any[] = selectedRecord?.transactions || [];
    const items: any[] = selectedRecord?.items || [];
    const orderId = selectedRecord?.id;

    const handleViewAllTransactions = () => {
        onHide();
        router.push(`/dashboard/transactions?orderId=${orderId}`);
    };

    return (
        <>
            <Dialog
                header="Order Details"
                visible={visible}
                style={{ minWidth: "300px" }}
                modal
                maximizable
                footer={
                    <Button label="Close" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                }
                onHide={onHide}
                closeOnEscape
                closable
            >
                <div className="p-4 space-y-6 text-sm">

                    {/* Order Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">Order Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <p><strong>Order #:</strong> {selectedRecord?.id || "N/A"}</p>
                            <p><strong>Payment Option:</strong> {selectedRecord?.payment_option || "N/A"}</p>
                            <p>
                                <strong>Status: </strong>
                                <Badge value={selectedRecord?.status || "N/A"} severity={statusSeverity(selectedRecord?.status)} />
                            </p>
                            <p><strong>Shipping Address:</strong> {selectedRecord?.shipping_address || "N/A"}</p>
                            <p><strong>Notes:</strong> {selectedRecord?.notes || "N/A"}</p>
                            <p><strong>User:</strong> {selectedRecord?.user?.name || "Guest"}</p>
                        </div>
                    </div>

                    {/* Guest Info */}
                    {(selectedRecord?.guest_name || selectedRecord?.guest_email || selectedRecord?.guest_phone) && (
                        <div>
                            <h4 className="text-lg font-semibold mb-3 border-b pb-1">Guest Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                <p><strong>Name:</strong> {selectedRecord?.guest_name || "N/A"}</p>
                                <p><strong>Email:</strong> {selectedRecord?.guest_email || "N/A"}</p>
                                <p><strong>Phone:</strong> {selectedRecord?.guest_phone || "N/A"}</p>
                            </div>
                        </div>
                    )}

                    {/* Payment Details */}
                    {selectedRecord?.payment_method && (
                        <div>
                            <h4 className="text-lg font-semibold mb-3 border-b pb-1">Payment Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                <p><strong>Payment Method:</strong> {selectedRecord?.payment_method}</p>
                                <p><strong>Buyer Name:</strong> {[selectedRecord?.buyer_first_name, selectedRecord?.buyer_last_name].filter(Boolean).join(" ") || "N/A"}</p>
                                <p><strong>Buyer Email:</strong> {selectedRecord?.buyer_email || "N/A"}</p>
                                <p><strong>Buyer Phone:</strong> {selectedRecord?.buyer_telephone || "N/A"}</p>
                            </div>
                        </div>
                    )}

                    {/* Order Items */}
                    {items.length > 0 && (
                        <div>
                            <h4 className="text-lg font-semibold mb-3 border-b pb-1">Order Items</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-gray-800">
                                            <th className="text-left p-2 border border-gray-200 dark:border-gray-700">Product</th>
                                            <th className="text-left p-2 border border-gray-200 dark:border-gray-700">SKU</th>
                                            <th className="text-right p-2 border border-gray-200 dark:border-gray-700">Qty</th>
                                            <th className="text-right p-2 border border-gray-200 dark:border-gray-700">Unit Price</th>
                                            <th className="text-right p-2 border border-gray-200 dark:border-gray-700">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item: any, idx: number) => (
                                            <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                                                <td className="p-2 border border-gray-200 dark:border-gray-700">{item.product_name}</td>
                                                <td className="p-2 border border-gray-200 dark:border-gray-700">{item.product_sku || "—"}</td>
                                                <td className="p-2 border border-gray-200 dark:border-gray-700 text-right">{item.quantity}</td>
                                                <td className="p-2 border border-gray-200 dark:border-gray-700 text-right">{Number(item.unit_price).toFixed(2)}</td>
                                                <td className="p-2 border border-gray-200 dark:border-gray-700 text-right font-medium">{Number(item.total_price).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Totals */}
                            <div className="mt-3 flex flex-col items-end gap-1">
                                <p><strong>Subtotal:</strong> {Number(selectedRecord?.subtotal || 0).toFixed(2)}</p>
                                <p><strong>Tax:</strong> {Number(selectedRecord?.tax || 0).toFixed(2)}</p>
                                <p><strong>Shipping Fee:</strong> {Number(selectedRecord?.shipping_fee || 0).toFixed(2)}</p>
                                <p className="text-base font-bold"><strong>Total:</strong> {Number(selectedRecord?.total || 0).toFixed(2)}</p>
                            </div>
                        </div>
                    )}

                    {/* Transactions */}
                    <div>
                        <div className="flex items-center justify-between mb-3 border-b pb-1">
                            <h4 className="text-lg font-semibold">Transactions ({transactions.length})</h4>
                            <div className="flex gap-2">
                                {transactions.length === 0 ? (
                                    <Button
                                        label="Add Transaction"
                                        icon="pi pi-plus"
                                        size="small"
                                        onClick={() => setShowAddTransaction(true)}
                                    />
                                ) : (
                                    <Button
                                        label="View All Transactions"
                                        icon="pi pi-external-link"
                                        size="small"
                                        text
                                        onClick={handleViewAllTransactions}
                                    />
                                )}
                            </div>
                        </div>

                        {transactions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-gray-800">
                                            <th className="text-left p-2 border border-gray-200 dark:border-gray-700">#</th>
                                            <th className="text-left p-2 border border-gray-200 dark:border-gray-700">Payment Method</th>
                                            <th className="text-right p-2 border border-gray-200 dark:border-gray-700">Amount</th>
                                            <th className="text-left p-2 border border-gray-200 dark:border-gray-700">Currency</th>
                                            <th className="text-left p-2 border border-gray-200 dark:border-gray-700">Status</th>
                                            <th className="text-left p-2 border border-gray-200 dark:border-gray-700">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((tx: any) => (
                                            <tr key={tx.id} className="border-b border-gray-200 dark:border-gray-700">
                                                <td className="p-2 border border-gray-200 dark:border-gray-700">{tx.id}</td>
                                                <td className="p-2 border border-gray-200 dark:border-gray-700">{tx.payment_method}</td>
                                                <td className="p-2 border border-gray-200 dark:border-gray-700 text-right">{Number(tx.amount).toFixed(2)}</td>
                                                <td className="p-2 border border-gray-200 dark:border-gray-700">{tx.currency || "—"}</td>
                                                <td className="p-2 border border-gray-200 dark:border-gray-700">
                                                    <Badge value={tx.status || "N/A"} severity={statusSeverity(tx.status)} />
                                                </td>
                                                <td className="p-2 border border-gray-200 dark:border-gray-700">{formatDate(tx.created_at)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="mt-2 flex justify-end">
                                    <Button
                                        label="View All Transactions"
                                        icon="pi pi-external-link"
                                        size="small"
                                        text
                                        onClick={handleViewAllTransactions}
                                    />
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No transactions yet for this order.</p>
                        )}
                    </div>

                    {/* Metadata */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">Metadata</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <p><strong>Created By:</strong> {selectedRecord?.created_by?.name || "N/A"}</p>
                            <p><strong>Updated By:</strong> {selectedRecord?.updated_by?.name || "N/A"}</p>
                            <p><strong>Created At:</strong> {formatDate(selectedRecord?.created_at)}</p>
                            <p><strong>Updated At:</strong> {formatDate(selectedRecord?.updated_at)}</p>
                        </div>
                    </div>
                </div>
            </Dialog>

            {/* Add Transaction Dialog */}
            <CreateTransactionDialog
                visible={showAddTransaction}
                onHide={() => setShowAddTransaction(false)}
                initialData={{ order_id: orderId }}
            />
        </>
    );
};

export default RecordDetailsDialog;
