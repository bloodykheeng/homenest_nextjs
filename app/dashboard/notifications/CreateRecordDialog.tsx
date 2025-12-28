"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import { postNotification } from "@/services/notifications/notifications-service";

import RowForm from "./widgets/RowForm";

interface CreateRecordDialogProps {
    visible: boolean;
    onHide: () => void;
    initialData?: any;
}

const CreateRecordDialog: React.FC<CreateRecordDialogProps> = ({
    visible,
    onHide,
    initialData
}) => {
    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();

    const createMutation = useMutation({
        mutationFn: postNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            primeReactToast.success("Notification created successfully");
            onHide();
        }
    });

    useHandleMutationError(createMutation.error);

    const handleFormSubmit = (data: any) => {
        console.log("🚀 ~ handleFormSubmit ~ data:", data);
        if (!data) return;

        createMutation.mutate(data);
    };

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

    return (
        <Dialog
            header="Create New Notification"
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
                    <div className="absolute inset-0 flex justify-center items-center bg-white/70 z-10">
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