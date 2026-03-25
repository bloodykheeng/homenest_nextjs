"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import { updateOrder } from "@/services/orders/orders-service";

import RowForm, { OrderFormData } from "./widgets/RowForm";

// ─── Props ────────────────────────────────────────────────────────────────────

interface EditRecordDialogProps {
    visible: boolean;
    onHide: () => void;
    initialData: any; // Raw order record from the API (with eager-loaded relations)
}

// ─── Helper — map raw API order back to RowForm shape ─────────────────────────

const formatInitialDataForForm = (initialData: any): Partial<OrderFormData> => {
    if (!initialData) {
        return { items: [] };
    }

    return {
        payment_option: initialData.payment_option ?? "Pay on Delivery",
        shipping_address: initialData.shipping_address ?? "",
        notes: initialData.notes ?? "",
        guest_name: initialData.guest_name ?? "",
        guest_email: initialData.guest_email ?? "",
        guest_phone: initialData.guest_phone ?? "",
        // buyer fields — not stored on Order model but pre-fill if available
        buyer_first_name: initialData.buyer_first_name ?? "",
        buyer_last_name: initialData.buyer_last_name ?? "",
        buyer_email: initialData.buyer_email ?? "",
        buyer_telephone: initialData.buyer_telephone ?? "",
        items: (initialData.items || []).map((item: any) => {
            const unitPrice =
                item.unit_price !== null ? parseFloat(item.unit_price) : 0;
            const totalPrice =
                item.total_price !== null ? parseFloat(item.total_price) : 0;
            const quantity =
                item.quantity !== null ? parseInt(item.quantity, 10) : 0;

            return {
                // keep item id for potential update tracking
                id: item.id ?? null,
                product_category_id:
                    item.product_category_id ?? item.product?.product_category_id ?? 0,
                product_subcategory_id:
                    item.product_subcategory_id ??
                    item.product?.product_subcategory_id ??
                    0,
                product_id: item.product_id,
                product_name: item.product_name ?? item.product?.name ?? "",
                product_sku: item.product_sku ?? item.product?.sku ?? null,
                quantity: isNaN(quantity) ? 0 : quantity,
                unit_price: isNaN(unitPrice) ? 0 : unitPrice,
                total_price: isNaN(totalPrice) ? 0 : totalPrice,
                // spread full eager-loaded relations for the DataTable display
                category: item.category ?? item.product?.category ?? {},
                subcategory: item.subcategory ?? item.product?.subcategory ?? {},
                product: {
                    id: item.product?.id ?? item.product_id,
                    name: item.product?.name ?? item.product_name ?? "",
                    sku: item.product?.sku ?? item.product_sku ?? null,
                    photo_url: item.product?.photo_url ?? null,
                    unit_price: item.product?.unit_price
                        ? parseFloat(item.product.unit_price)
                        : null,
                },
            };
        }),
    };
};

// ─── Component ────────────────────────────────────────────────────────────────

const EditRecordDialog: React.FC<EditRecordDialogProps> = ({
    visible,
    onHide,
    initialData,
}) => {
    console.log("🚀 ~ EditRecordDialog ~ initialData:", initialData);

    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();

    const editMutation = useMutation({
        mutationFn: (updatedData: any) => updateOrder(initialData.id, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            primeReactToast.success("Order updated successfully");
            onHide();
        },
    });

    useHandleMutationError(editMutation.error);

    // ─── Submit handler ───────────────────────────────────────────────────────

    const handleFormSubmit = (data: OrderFormData | null) => {
        console.log("🚀 ~ handleFormSubmit on edit ~ data:", data);

        if (!data?.items || data.items.length === 0) {
            console.log("No valid order data to submit");
            return;
        }

        const subtotal = data.items.reduce(
            (sum, item) => sum + (item.total_price || 0),
            0
        );
        const tax = 0;
        const shippingFee = 0;
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
            ...(data.payment_option === "Pay Now" && {
                buyer_first_name: data.buyer_first_name || null,
                buyer_last_name: data.buyer_last_name || null,
                buyer_email: data.buyer_email || null,
                buyer_telephone: data.buyer_telephone || null,
                payment_method: "Olycash",
            }),
            items,
        };

        console.log("🚀 Submitting edit payload:", payload);
        editMutation.mutate(payload);
    };

    // ─── Footer ───────────────────────────────────────────────────────────────

    const dialogFooter = (
        <div className="flex justify-end gap-2 mt-4">
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={onHide}
                disabled={editMutation.isPending}
            />
        </div>
    );

    const formItems = formatInitialDataForForm(initialData);
    console.log("🚀 ~ formItems:", formItems);

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <Dialog
            header={`Edit Order — ${initialData?.order_number ?? ""}`}
            visible={visible}
            onHide={onHide}
            style={{ minWidth: "50vw" }}
            modal
            maximizable
            footer={dialogFooter}
            closeOnEscape={!editMutation.isPending}
            closable={!editMutation.isPending}
        >
            <div className="relative">
                <RowForm
                    handleFormSubmit={handleFormSubmit}
                    formMutation={editMutation}
                    initialData={formItems}
                />

                {editMutation.isPending && (
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

export default EditRecordDialog;