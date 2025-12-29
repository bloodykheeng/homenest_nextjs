"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import {
  updateProduct,
} from "@/services/products/products-service";

import RowForm from "./widgets/RowForm";

interface EditRecordDialogProps {
  visible: boolean;
  onHide: () => void;
  initialData: any;
  selectedSearchParams: {
    productCategoryId?: string;
    productSubCategoryId?: string;
  };
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
      updateProduct(initialData.id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      primeReactToast.success("Product updated successfully");
      onHide();
    },
  });

  useHandleMutationError(editMutation.error);

  const handleFormSubmit = (data: any) => {
    if (data) {
      const formData = new FormData();
      formData.append("_method", "PUT");

      // Add basic fields
      formData.append("product_subcategory_id", data?.subcategory?.id?.toString() || "");
      formData.append("name", data?.name || "");
      formData.append("description", data?.description || "");
      formData.append("price", data?.price?.toString() || "0");
      formData.append("quantity", data?.quantity?.toString() || "0");
      formData.append("discount", data?.discount?.toString() || "0");
      formData.append("status", data?.status || "active");

      // Handle colors
      formData.append("colors", JSON.stringify(data?.colors ?? []));

      // Handle sizes
      formData.append("sizes", JSON.stringify(data?.sizes?.map((s: any) =>
        typeof s === 'string' ? { size_name: s } : s
      ) ?? []));

      // Handle additional info
      formData.append("additional_info", JSON.stringify(data?.additional_info ?? []));

      // Handle attachments
      if (data?.attachments && data.attachments.length > 0) {
        data.attachments.forEach((attachment: any, index: number) => {
          if (attachment.status === "new" && attachment.file) {
            // New attachment
            formData.append(`attachments[${index}][file_path]`, attachment.file);
            formData.append(`attachments[${index}][type]`, attachment.type || "");
            formData.append(`attachments[${index}][caption]`, attachment.caption || "");
            formData.append(`attachments[${index}][featured]`, attachment.featured ? "1" : "0");
            formData.append(`attachments[${index}][status]`, "new");
          } else if (attachment.status === "existing" && attachment.existing_attachment_id) {
            // Existing attachment
            formData.append(`attachments[${index}][existing_attachment_id]`, attachment.existing_attachment_id.toString());
            formData.append(`attachments[${index}][type]`, attachment.type || "");
            formData.append(`attachments[${index}][caption]`, attachment.caption || "");
            formData.append(`attachments[${index}][featured]`, attachment.featured ? "1" : "0");
            formData.append(`attachments[${index}][status]`, "existing");
          }
        });
      }

      // Send data to mutation
      editMutation.mutate(formData);
    }
  };

  const enhancedInitialData = {
    ...initialData,
    colors: initialData?.colors || [],
    sizes: initialData?.sizes?.map((s: any) => s.size_name) || [],
    additional_info: initialData?.additional_info || [],
    product_attachments: initialData?.product_attachments || [],
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

  return (
    <Dialog
      header="Edit Product"
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
          initialData={enhancedInitialData}
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