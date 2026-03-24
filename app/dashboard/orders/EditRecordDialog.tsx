"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";
import { updateOrder } from "@/services/orders/orders-service";
import RowForm from "./widgets/RowForm";

interface EditRecordDialogProps {
    visible: boolean;
    onHide: () => void;
    initialData: any;
}

const EditRecordDialog: React.FC<EditRecordDialogProps> = ({ visible, onHide, initialData }) => {
    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();

    const editMutation = useMutation({
        mutationFn: (updatedData: any) => updateOrder(initialData?.id, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            primeReactToast.success("Order updated successfully");
            onHide();
        },
    });

    useHandleMutationError(editMutation.error);

    const handleFormSubmit = (data: any) => {
        if (data) editMutation.mutate(data);
    };

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

    const defaultValues = {
        payment_option: "Pay on Delivery",
        subtotal: 0,
        tax: 0,
        shipping_fee: 0,
        total: 0,
        items: [],
    };

    return (
        <Dialog
            header="Edit Order"
            visible={visible}
            onHide={onHide}
            style={{ minWidth: "70vw" }}
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
                    initialData={{ ...defaultValues, ...initialData }}
                />
                {editMutation.isPending && (
                    <div className="absolute inset-0 flex justify-center items-center dark:bg-black/70 bg-white/70 z-10">
                        <ProgressSpinner style={{ width: "40px", height: "40px" }} strokeWidth="4" animationDuration="1s" />
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default EditRecordDialog;
