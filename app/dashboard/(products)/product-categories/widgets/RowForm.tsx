"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";

import PhotoUploadPicker from "@/components/admin-panel/fileUploadPickers/PhotoUploadPicker";

// ✅ Validation Schema
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  status: z.enum(["active", "inactive"]),
  description: z.string().optional(),
  photo: z
    .object({
      file: z.instanceof(File).optional(),
      previewUrl: z.string(),
      status: z.enum(["new", "existing"]),
    })
    .nullish()
    .optional(),
  photo_url: z.string().nullish().optional(),
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
  name: "",
  status: "active",
  description: "",
  photo: null,
  photo_url: null,
};

const ProductCategoryRowForm: React.FC<{
  handleFormSubmit: (data: FormData | null) => any;
  formMutation: any;
  initialData?: FormData;
}> = ({ handleFormSubmit, formMutation, initialData = defaultValues }) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<FormData | null>(null);

  // Get current photo from form state
  const photo = watch("photo");
  // Get existing photo path
  const existingPhoto = watch("photo_url");

  const onSubmit = (data: FormData) => {
    setPendingData(data);
    setShowConfirmDialog(true);
  };

  const onConfirmSubmit = (e: any) => {
    e.preventDefault();
    handleFormSubmit(pendingData);
    setShowConfirmDialog(false);
  };

  const onCancelSubmit = (e?: any) => {
    e?.preventDefault();
    setShowConfirmDialog(false);
  };

  // Status options
  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {/* Name */}
          <div className="p-field col-span-1 md:col-span-2 lg:col-span-3">
            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <InputText
                  {...field}
                  className={`w-full ${errors.name ? "p-invalid" : ""}`}
                />
              )}
            />
            {errors.name && (
              <small className="p-error">{errors.name.message}</small>
            )}
          </div>

          {/* Status */}
          <div className="p-field col-span-1 md:col-span-2 lg:col-span-3">
            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={statusOptions}
                  className={`w-full ${errors.status ? "p-invalid" : ""}`}
                />
              )}
            />
            {errors.status && (
              <small className="p-error">{errors.status.message}</small>
            )}
          </div>



          {/* Description */}
          <div className="p-field col-span-1 md:col-span-2 lg:col-span-3">
            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <InputTextarea
                  {...field}
                  rows={3}
                  className={`w-full ${errors.description ? "p-invalid" : ""}`}
                />
              )}
            />
            {errors.description && (
              <small className="p-error">{errors.description.message}</small>
            )}
          </div>

          {/* Photo Upload */}
          <div className="sm:col-span-3 md:col-span-3 lg:col-span-3">
            <PhotoUploadPicker
              setValue={setValue}
              photo={photo}
              existingPhoto={existingPhoto}
              fieldName="photo"
              label="Product Category Photo"
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center pt-4">
            <Button
              type="submit"
              label="Submit"
              icon={
                formMutation?.isPending ? "pi pi-spin pi-spinner" : "pi pi-save"
              }
              className="w-full md:w-1/2 p-3 text-xl"
              disabled={formMutation?.isPending}
            />
          </div>
        </div>
      </form>

      <Dialog
        header="Confirm Submission"
        visible={showConfirmDialog}
        maximizable
        onHide={onCancelSubmit}
        footer={
          <div>
            <Button label="Yes" onClick={onConfirmSubmit} />
            <Button
              label="No"
              onClick={onCancelSubmit}
              className="p-button-secondary"
            />
          </div>
        }
      >
        Are you sure you want to submit this product category data?
      </Dialog>
    </>
  );
};

export default ProductCategoryRowForm;
