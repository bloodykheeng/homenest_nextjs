"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Button } from "primereact/button";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import useAuthContext from "@/providers/AuthProvider";

interface OrderPrintProps {
    orderData: any;
}

const OrderPrint: React.FC<OrderPrintProps> = ({ orderData }) => {
    const { getUserQuery } = useAuthContext();
    const loggedInUserData = getUserQuery?.data?.data;
    const printRef = useRef<HTMLDivElement>(null);

    const formatNumber = (value: any, decimals = 2) => {
        const num = Number(value);
        if (isNaN(num)) return "0.00";
        return num.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    };

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Order-${orderData?.order_number || orderData?.id || "Report"}`,
        pageStyle: `
            @page { size: A4 portrait; margin: 1cm; }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    background: white !important;
                    color: black !important;
                }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px; text-align: left; }
                th { background-color: #f5f5f5 !important; }
                .header-space, .footer-space { height: 120px; }
                .print-header {
                    position: fixed; top: 0; width: 100%;
                    background: white !important;
                    text-align: center; z-index: 10;
                }
                .print-footer {
                    position: fixed; bottom: 0; width: 100%;
                    background: white !important;
                    text-align: center; font-size: 10px;
                    color: #666; border-top: 1px solid #ddd;
                }
            }
        `,
    });

    const orderItems = orderData?.items || [];
    const transactions = orderData?.transactions || [];

    return (
        <div>
            {/* Print Trigger Button */}
            <Button
                icon="pi pi-print"
                label="Print / Download"
                className="p-button-outlined p-button-sm"
                onClick={() => handlePrint()}
            />

            {/* Hidden Print Content */}
            <div className="hidden">
                <div ref={printRef}>
                    <table className="w-full font-sans">
                        <thead>
                            <tr>
                                <td>
                                    <div className="header-space h-24">&nbsp;</div>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="flex flex-col items-center p-4">
                                        <div className="w-full max-w-4xl space-y-6 text-sm">

                                            {/* Order Information */}
                                            <div>
                                                <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                                                    Order Information
                                                </h4>
                                                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                                    <p><strong>Order Number:</strong> {orderData?.order_number || "N/A"}</p>
                                                    <p><strong>Status:</strong> {orderData?.status || "N/A"}</p>
                                                    <p><strong>Guest Name:</strong> {orderData?.guest_name || "N/A"}</p>
                                                    <p><strong>Guest Email:</strong> {orderData?.guest_email || "N/A"}</p>
                                                    <p><strong>Guest Phone:</strong> {orderData?.guest_phone || "N/A"}</p>
                                                    <p><strong>Payment Option:</strong> {orderData?.payment_option || "N/A"}</p>
                                                    <p><strong>Subtotal:</strong> {formatNumber(orderData?.subtotal)}</p>
                                                    <p><strong>Tax:</strong> {formatNumber(orderData?.tax)}</p>
                                                    <p><strong>Shipping Fee:</strong> {formatNumber(orderData?.shipping_fee)}</p>
                                                    <p><strong>Total:</strong> {formatNumber(orderData?.total)}</p>
                                                    {orderData?.shipping_address && (
                                                        <p className="col-span-2">
                                                            <strong>Shipping Address:</strong> {orderData.shipping_address}
                                                        </p>
                                                    )}
                                                    {orderData?.notes && (
                                                        <p className="col-span-2">
                                                            <strong>Notes:</strong> {orderData.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            {orderItems.length > 0 && (
                                                <div>
                                                    <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                                                        Order Items
                                                    </h4>
                                                    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
                                                        <thead>
                                                            <tr style={{ backgroundColor: "#f5f5f5" }}>
                                                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Product</th>
                                                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>SKU</th>
                                                                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>Qty</th>
                                                                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>Unit Price</th>
                                                                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {orderItems.map((item: any, index: number) => (
                                                                <tr key={index}>
                                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.product_name || "N/A"}</td>
                                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.product_sku || "N/A"}</td>
                                                                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{item.quantity}</td>
                                                                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatNumber(item.unit_price)}</td>
                                                                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatNumber(item.total_price)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                            {/* Transactions */}
                                            {transactions.length > 0 && (
                                                <div>
                                                    <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                                                        Transactions
                                                    </h4>
                                                    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
                                                        <thead>
                                                            <tr style={{ backgroundColor: "#f5f5f5" }}>
                                                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
                                                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Payment Method</th>
                                                                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>Amount</th>
                                                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
                                                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {transactions.map((txn: any, index: number) => (
                                                                <tr key={index}>
                                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{txn.id}</td>
                                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{txn.payment_method || "N/A"}</td>
                                                                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatNumber(txn.amount)}</td>
                                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{txn.status || "N/A"}</td>
                                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                                        {txn.created_at ? moment(txn.created_at).format("Do MMM YYYY, h:mm A") : "N/A"}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                            {/* Metadata */}
                                            <div>
                                                <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                                                    Metadata
                                                </h4>
                                                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                                    <p><strong>Created By:</strong> {orderData?.created_by?.name || "N/A"}</p>
                                                    <p><strong>Created At:</strong> {orderData?.created_at ? moment(orderData.created_at).format("LLL") : "N/A"}</p>
                                                    <p><strong>Updated By:</strong> {orderData?.updated_by?.name || "N/A"}</p>
                                                    <p><strong>Updated At:</strong> {orderData?.updated_at ? moment(orderData.updated_at).format("LLL") : "N/A"}</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>
                                    <div className="footer-space h-24">&nbsp;</div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Print Header */}
                    <div className="print-header fixed top-0 w-full text-center py-4 bg-white">
                        <div className="flex flex-col items-center justify-center">
                            <Image
                                src="/logos/homenest_dark.png"
                                alt="Logo"
                                width={50}
                                height={50}
                                className="h-12 mb-1"
                            />
                            <span className="text-xl font-bold">Order Report</span>
                        </div>
                    </div>

                    {/* Print Footer */}
                    <div className="print-footer fixed bottom-0 w-full text-center py-4 bg-white">
                        <p className="text-xs text-gray-600">Generated from Home Nest</p>
                        <p className="text-xs text-gray-600">
                            by {loggedInUserData?.name} on{" "}
                            {moment().format("dddd, MMMM Do YYYY, h:mm:ss A")}
                        </p>
                        <p className="text-xs text-gray-600">
                            © {new Date().getFullYear()} Home Nest
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPrint;