"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import { postOrder } from "@/services/orders/orders-service";

import RowForm, { OrderFormData } from "./widgets/RowForm";

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateRecordDialogProps {
    visible: boolean;
    onHide: () => void;
    initialData?: Partial<OrderFormData>;
}

// ─── Component ────────────────────────────────────────────────────────────────

const CreateRecordDialog: React.FC<CreateRecordDialogProps> = ({
    visible,
    onHide,
    initialData,
}) => {
    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();

    const createMutation = useMutation({
        mutationFn: postOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            primeReactToast.success("Order created successfully");
            onHide();
        },
    });

    useHandleMutationError(createMutation.error);

    // ─── Submit handler ───────────────────────────────────────────────────────
    // Maps RowForm data → Laravel store() payload shape

    const handleFormSubmit = (data: OrderFormData | null) => {
        if (!data?.items || data.items.length === 0) {
            console.log("No valid order data to submit");
            return;
        }

        // Compute order financials from items
        const subtotal = data.items.reduce(
            (sum, item) => sum + (item.total_price || 0),
            0
        );
        const tax = 0;          // adjust if your app calculates tax
        const shippingFee = 0;  // adjust if your app calculates shipping
        const total = subtotal + tax + shippingFee;

        const items = data.items.map((item) => ({
            product_id: item.product_id,
            product_name: item.product_name,
            product_sku: item.product_sku ?? null,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
        }));

        const payload = {
            payment_option: data.payment_option,
            subtotal,
            tax,
            shipping_fee: shippingFee,
            total,
            shipping_address: data.shipping_address || null,
            notes: data.notes || null,
            guest_name: data.guest_name || null,
            guest_email: data.guest_email || null,
            guest_phone: data.guest_phone || null,
            // Pay Now fields — only sent when relevant
            ...(data.payment_option === "Pay Now" && {
                buyer_first_name: data.buyer_first_name || null,
                buyer_last_name: data.buyer_last_name || null,
                buyer_email: data.buyer_email || null,
                buyer_telephone: data.buyer_telephone || null,
                payment_method: "Olycash",
            }),
            items,
        };

        console.log("🚀 Submitting order payload:", payload);
        createMutation.mutate(payload);
    };

    // ─── Footer ───────────────────────────────────────────────────────────────

    const dialogFooter = (
        <div className="flex justify-end gap-2 mt-4">
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={onHide}
                disabled={createMutation.isPending}
            />
        </div>
    );

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <Dialog
            header="Create New Order"
            visible={visible}
            onHide={onHide}
            style={{ minWidth: "50vw" }}
            modal
            maximizable
            footer={dialogFooter}
            closeOnEscape={!createMutation.isPending}
            closable={!createMutation.isPending}
        >
            <div className="relative">
                <RowForm
                    handleFormSubmit={handleFormSubmit}
                    formMutation={createMutation}
                    initialData={initialData}
                />

                {createMutation.isPending && (
                    <div className="absolute inset-0 flex justify-center items-center dark:bg-black/70 bg-white/70 z-10">
                        <ProgressSpinner
                            style={{ width: "40px", height: "40px" }}
                            strokeWidth="4"
                            animationDuration="1s"
                        />
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default CreateRecordDialog;