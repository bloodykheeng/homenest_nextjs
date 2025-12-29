"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import {
  getAllProductCategories,
  getProductCategoryById,
  postProductCategory,
  updateProductCategory,
  patchProductCategory,
  deleteProductCategoryById,
  postToBulkDestroyProductCategories,
} from "@/services/products/product-categories-service";

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
    mutationFn: postProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      primeReactToast.success("Product Category created successfully");
      onHide();
    },
  });

  useHandleMutationError(createMutation.error);

  const handleFormSubmit = (data: any) => {
    if (data) {
      const formData = new FormData();

      // Add basic fields
      formData.append("name", data?.name || "");
      formData.append("status", data?.status || "active");
      formData.append("description", data?.description || "");

      // Handle photo upload
      if (data?.photo) {
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
      header="Create New Product Category"
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
