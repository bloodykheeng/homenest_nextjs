"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import {
  getAllUsers,
  getUserById,
  postUser,
  updateUser,
  deleteUserById,
  postToBulkDestroyUsers,
} from "@/services/users/users-service";
import RowForm from "./widgets/RowForm"; // Ensure path is correct

interface EditRecordDialogProps {
  visible: boolean;
  onHide: () => void;
  initialData: any; // Required for editing
}

const EditRecordDialog: React.FC<EditRecordDialogProps> = ({
  visible,
  onHide,
  initialData,
}) => {
  const queryClient = useQueryClient();
  const primeReactToast = usePrimeReactToast();

  const editMutation = useMutation({
    mutationFn: (updatedData: any) => updateUser(initialData.id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      primeReactToast.success("User updated successfully");
      onHide();
    },
  });

  useHandleMutationError(editMutation.error);

  // ✅ UPDATE FORM SUBMISSION HANDLER
  const handleFormSubmit = (data: any) => {
    console.log("🚀 ~ handleFormSubmit ~ data:", data)
    // Alternative version if you need to handle data (with file upload)
    if (data) {
      // Create data object for file upload
      const formData = new FormData();
      formData.append("_method", "PUT");

      // Add basic user fields
      formData.append("name", data?.name || "");
      formData.append("username", data?.username || "");
      formData.append("phone", data?.phone || "");
      formData.append("email", data?.email || "");
      // Only append password if it's provided (for updates, password might be optional)
      if (data?.password) {
        formData.append("password", data.password);
      }
      formData.append("role", data?.role || "");
      formData.append("status", data?.status || "");
      if (data?.gender) {
        formData.append("gender", data.gender);
      }

      // Handle photo upload
      if (data.photo) {
        const photoStatus = data?.photo?.status;

        // For new photos, append the file
        if (photoStatus === "new" && data?.photo?.file) {
          formData.append("photo[file_path]", data.photo.file);
          formData.append("photo[type]", "image");
          formData.append("photo[status]", "new");
        }
      }

      // Send data to mutation
      editMutation.mutate(formData);
    }
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
    name: "",
  };

  return (
    <Dialog
      header="Edit User"
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
          initialData={{
            ...defaultValues,
            ...initialData,
            allow_notifications: initialData?.allow_notifications
              ? true
              : false,
            editing: true,
          }}
          userId={initialData?.id}
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