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
import RowForm from "./widgets/RowForm"; // Ensure this is correct

interface CreateRecordDialogProps {
  visible: boolean;
  onHide: () => void;
  initialData?: any;
}

const CreateRecordDialog: React.FC<CreateRecordDialogProps> = ({
  visible,
  onHide,
  initialData,
}) => {
  const queryClient = useQueryClient();
  const primeReactToast = usePrimeReactToast();

  const createMutation = useMutation({
    mutationFn: postUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      primeReactToast.success("User created successfully");
      onHide();
    },
  });

  useHandleMutationError(createMutation.error);

  // ✅ CREATE FORM SUBMISSION HANDLER
  const handleFormSubmit = (data: any) => {
    // Alternative version if you need to handle data (with file upload)
    if (data) {
      // Create data object for file upload
      const formData = new FormData();

      // Add basic user fields
      formData.append("name", data?.name || "");
      formData.append("username", data?.username || "");
      formData.append("email", data?.email || "");
      formData.append("phone", data?.phone || "");
      formData.append("password", data?.password || "");
      formData.append("role", data?.role || "");
      formData.append("status", data?.status || "");

      // Add CSO ID (for CSO Reviewer and Community Accountability Champion)
      formData.append("cso_id", data?.cso?.id?.toString() || "");

      // Add Oversight Institution ID (for Oversight Institution Admin)
      formData.append("oversight_institution_id", data?.oversight_institution?.id?.toString() || "");

      // Add areas of operation (for Community Accountability Champion)
      formData.append("areas_of_operation", JSON.stringify(data?.areas_of_operation ?? []));

      // Add location IDs (for Community Accountability Champion)
      formData.append("state_id", data?.state?.id?.toString() || "");
      formData.append("region_id", data?.region?.id?.toString() || "");
      formData.append("district_id", data?.district?.id?.toString() || "");
      formData.append("ward_id", data?.ward?.id?.toString() || "");
      formData.append("village_id", data?.village?.id?.toString() || "");

      // Handle photo upload
      if (data?.photo) {
        // For new photos, append the file
        if (data?.photo?.status === "new" && data?.photo?.file) {
          formData.append("photo[file_path]", data?.photo?.file);
          formData.append("photo[type]", "image");
        }
      }

      // Send data to mutation
      createMutation.mutate(formData);
    }
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
      header="Create New User"
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
          initialData={{ ...initialData, name: initialData?.name || "" }}
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