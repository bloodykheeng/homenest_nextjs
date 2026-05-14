"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import { postUser } from "@/services/users/users-service";
import RowForm from "./widgets/RowForm";

interface CreateRecordDialogProps {
  visible: boolean;
  onHide: () => void;
}

const CreateRecordDialog: React.FC<CreateRecordDialogProps> = ({
  visible,
  onHide,
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
      if (data?.gender) {
        formData.append("gender", data.gender);
      }


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

  const defaultValues = {
    name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    gender: undefined as "Male" | "Female" | "Prefer not to say" | undefined,
    role: "System Admin" as const,
    status: "active" as const,
    photo: undefined as any,
    photo_url: undefined as string | undefined,
    editing: false,
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
          initialData={defaultValues}
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