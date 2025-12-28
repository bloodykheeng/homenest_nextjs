"use client";
import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import { useRouter } from 'nextjs-toploader/app';
import useHandleMutationError from "@/hooks/useHandleMutationError";

// Import the delete user service function
import { getAllActivityLogs, postToBulkDeleteActivityLogs } from "@/services/activity-logs/activity-logs-service";

interface DeleteRecordsDialogProps {
    visible: boolean;
    onHide: () => void;
    selectedItems: any;
    setSelectedItems: any;
}

const DeleteRecordsDialog: React.FC<DeleteRecordsDialogProps> = ({ visible, onHide, selectedItems, setSelectedItems }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();

    const deleteMutation = useMutation({
        mutationFn: postToBulkDeleteActivityLogs,
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["audit-trail"] });
            primeReactToast.success("Audit trail records deleted successfully");
            setSelectedItems([])
            onHide();
        }
    });

    // Handle mutation errors
    useHandleMutationError(deleteMutation.error);

    const handleDelete = () => {
        deleteMutation.mutate({ itemsToDelete: selectedItems });
    };

    const dialogFooter = (
        <div className="flex justify-end">
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
                className="p-button-danger"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
            />
        </div>
    );

    return (
        <Dialog
            header="Confirm Deletion"
            visible={visible}
            style={{ minWidth: '100px' }}
            modal
            footer={dialogFooter}
            onHide={onHide}
            closeOnEscape={!deleteMutation.isPending}
            closable={!deleteMutation.isPending}
            maximizable
        >
            <div className="flex flex-col items-center p-3">

                <i className="pi pi-exclamation-triangle text-yellow-500 mb-1 "></i>
                <h4 className="m-0 text-center">Are you sure you want to delete the selected rows?</h4>
                <p className="text-center m-0">
                    This action cannot be undone. All the selected rows will be permanently deleted.
                </p>


                {deleteMutation.isPending && (
                    <div className="flex justify-center mt-3">
                        <ProgressSpinner
                            style={{
                                width: "40px",
                                height: "40px",
                                borderWidth: "4px",
                                animationDuration: "1s"
                            }}
                            strokeWidth="4"
                            animationDuration="1s"
                        />
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default DeleteRecordsDialog;