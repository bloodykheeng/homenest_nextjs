"use client";

import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";
import useHandleQueryError from "@/hooks/useHandleQueryError";
import { notFound } from "next/navigation";
import { getOrderById } from "@/services/orders/orders-service";


import { postTransaction } from "@/services/transactions/transactions-service";
import TransactionForm from "@/app/dashboard/transactions/widgets/RowForm";

interface CloseOrderButtonProps {
    orderId: number;
    className?: string;
    disabled?: boolean;
    buttonSize?: "small" | "medium" | "large";
}

const CloseOrderButton: React.FC<CloseOrderButtonProps> = ({
    orderId,
    className = "",
    disabled = false,
    buttonSize = "medium",
}) => {
    const [visible, setVisible] = useState(false);
    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();

    // Fetch order by ID
    const orderQuery = useQuery({
        queryKey: ["orders", "by-id", orderId],
        queryFn: () => getOrderById(orderId),
        enabled: !!orderId,
    });

    useHandleQueryError(orderQuery);

    useEffect(() => {
        if (!orderQuery.isPending && orderQuery.isError && orderId) {
            notFound();
        }
        if (!orderQuery.isPending && orderQuery.data?.data === null) {
            primeReactToast.error("Order not found");
            setVisible(false);
        }
    }, [
        orderQuery.isPending,
        orderQuery.isError,
        orderQuery.data,
        orderId,
        primeReactToast,
    ]);

    // Mutation to close order
    const closeMutation = useMutation({
        mutationFn: (data: any) => {
            const payload = { ...data, order_id: orderId };
            return postTransaction(payload);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });

            primeReactToast.success(
                response?.data?.message ?? "Order closed successfully!"
            );

            const paymentSummary = response?.data?.data?.payment_summary;
            if (paymentSummary) {
                primeReactToast.success(
                    `Order Total: ${paymentSummary.order_total} | Paid: ${paymentSummary.amount_paid}${paymentSummary.change > 0 ? ` | Change: ${paymentSummary.change}` : ""} | ${paymentSummary.payment_status}`
                );
            }

            setVisible(false);
        },
    });

    useHandleMutationError(closeMutation.error);

    const handleFormSubmit = (formData: any) => {
        closeMutation.mutate(formData);
    };

    const order = orderQuery.data?.data;
    const buttonSizeClass = {
        small: "p-button-sm",
        medium: "",
        large: "p-button-lg",
    };

    const formatNumber = (value: any, decimals = 2) => {
        const num = Number(value);
        if (isNaN(num)) return "0.00";
        return num.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    };

    return (
        <>
            <Button
                label="Record Order Transaction"
                icon="pi pi-check-circle"
                className={`p-button-success p-button-text ${buttonSizeClass[buttonSize]} ${className}`}
                onClick={() => setVisible(true)}
                disabled={disabled || closeMutation.isPending || orderQuery.isPending}
                tooltip="Close and complete this order"
                tooltipOptions={{ position: "top" }}
            />

            <Dialog
                header={`Close Order ${order?.order_number ? `- ${order.order_number}` : ""}`}
                visible={visible}
                onHide={() => !closeMutation.isPending && setVisible(false)}
                modal
                closable={!closeMutation.isPending}
                dismissableMask={!closeMutation.isPending}
                style={{ width: "90vw", maxWidth: "600px" }}
                className="relative"
            >
                {!order ? (
                    <div className="flex justify-center items-center h-40">
                        <ProgressSpinner
                            style={{ width: "40px", height: "40px" }}
                            strokeWidth="4"
                            animationDuration="1s"
                        />
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                                Complete the payment details to close this order.
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                                <p className="text-blue-800 dark:text-blue-200 font-semibold">
                                    Order Total: {formatNumber(order?.total)}
                                </p>
                            </div>
                        </div>

                        <TransactionForm
                            handleFormSubmit={handleFormSubmit}
                            formMutation={closeMutation}
                            order={order}
                        />

                        {closeMutation.isPending && (
                            <div className="absolute inset-0 flex justify-center items-center bg-white/70 dark:bg-black/50 z-10 rounded-md">
                                <div className="text-center">
                                    <ProgressSpinner
                                        style={{ width: "40px", height: "40px" }}
                                        strokeWidth="4"
                                        animationDuration="1s"
                                    />
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        Closing order...
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </Dialog>
        </>
    );
};

export default CloseOrderButton;