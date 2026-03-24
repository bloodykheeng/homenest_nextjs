"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";
import { postToBulkDestroyTransactions } from "@/services/transactions/transactions-service";

interface DeleteRecordsDialogProps {
    visible: boolean;
    onHide: () => void;
    selectedItems: any[];
    setSelectedItems: (items: any[]) => void;
}

const DeleteRecordsDialog: React.FC<DeleteRecordsDialogProps> = ({
    visible,
    onHide,
    selectedItems,
    setSelectedItems,
}) => {
    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();

    const deleteMutation = useMutation({
        mutationFn: (ids: number[]) => postToBulkDestroyTransactions({ ids }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            primeReactToast.success("Transactions deleted successfully");
            setSelectedItems([]);
            onHide();
        },
    });

    useHandleMutationError(deleteMutation.error);

    const handleDelete = () => {
        const ids = selectedItems.map((item) => item.id);
        deleteMutation.mutate(ids);
    };

    const dialogFooter = (
        <div className="flex justify-end gap-2">
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={onHide}
                disabled={deleteMutation.isPending}
            />
            <Button
                label="Delete"
                icon="pi pi-trash"
                severity="danger"
                onClick={handleDelete}
                loading={deleteMutation.isPending}
            />
        </div>
    );

    return (
        <Dialog
            header="Confirm Delete"
            visible={visible}
            onHide={onHide}
            style={{ minWidth: "400px" }}
            modal
            footer={dialogFooter}
        >
            <p>
                Are you sure you want to delete {selectedItems.length} transaction(s)? This action
                cannot be undone.
            </p>
            <ul className="mt-2 list-disc pl-5">
                {selectedItems.slice(0, 5).map((item) => (
                    <li key={item.id}>Transaction #{item.id}</li>
                ))}
                {selectedItems.length > 5 && (
                    <li>...and {selectedItems.length - 5} more</li>
                )}
            </ul>
        </Dialog>
    );
};

export default DeleteRecordsDialog;
