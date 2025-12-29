"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import {
  getAllProductSubcategories,
  getProductSubcategoryById,
  postProductSubcategory,
  updateProductSubcategory,
  patchProductSubcategory,
  deleteProductSubcategoryById,
  postToBulkDestroyProductSubcategories,
} from "@/services/products/product-subcategories-service";
import RowForm from "./widgets/RowForm"; // Ensure path is correct

interface EditRecordDialogProps {
  visible: boolean;
  onHide: () => void;
  initialData: any; // Required for editing
  selectedSearchParams: { productCategoryId?: string };
}

const EditRecordDialog: React.FC<EditRecordDialogProps> = ({
  visible,
  onHide,
  initialData,
  selectedSearchParams,
}) => {
  const queryClient = useQueryClient();
  const primeReactToast = usePrimeReactToast();

  const editMutation = useMutation({
    mutationFn: (updatedData: any) =>
      updateProductSubcategory(initialData.id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-subcategories"] });
      primeReactToast.success("Product Sub Category updated successfully");
      onHide();
    },
  });

  useHandleMutationError(editMutation.error);

  const handleFormSubmit = (data: any) => {
    // Alternative version if you need to handle data (with file upload)
    if (data) {
      // Create data object for file upload
      const formData = new FormData();
      formData.append("_method", "PUT");
      // Add basic fields
      formData.append(
        "product_category_id",
        data?.category?.id?.toString() || ""
      );
      formData.append("name", data?.name || "");
      formData.append("status", data?.status || "active");
      formData.append("description", data?.description || "");


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

      // Log for debugging (remove in production)
      console.log("data entries:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
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
    name: "", // Empty string for user input
    region: undefined,
  };

  return (
    <Dialog
      header="Edit Product Sub Category"
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
          }}
          selectedSearchParams={selectedSearchParams}
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
