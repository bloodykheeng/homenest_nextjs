"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";
import { Password } from "primereact/password";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";

import { useRouter } from "nextjs-toploader/app";

// Import your services

import { useQuery } from "@tanstack/react-query";
import useHandleQueryError from "@/hooks/useHandleQueryError";

import { InputMask } from "primereact/inputmask";
import PhotoUploadPicker from "@/components/admin-panel/fileUploadPickers/PhotoUploadPicker";

const requireField = (val: any, ctx: z.RefinementCtx, fieldName: string) => {
  if (!!val === false) {
    ctx.addIssue({
      code: "custom",
      message: `${fieldName} is required`,
    });
    return z.NEVER;
  }
  return val;
};

// ✅ Validation Schema
const formSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    phone: z.string().nullish(),
    email: z.string().email("Please enter a valid email address"),
    // ✅ new API-required fields
    current_password: z
      .string()
      .min(6, "Current password is required and must be at least 6 characters"),
    new_password: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .optional()
      .or(z.literal("")), // allow empty string
    editing: z.boolean().optional().nullable(),

    gender: z.enum(["Male", "Female"], "Gender is required"),
    allow_notifications: z.boolean(),

    photo: z
      .object({
        file: z.instanceof(File).optional(),
        previewUrl: z.string(),
        status: z.enum(["new", "existing"]),
      })
      .nullish()
      .optional(),
    photo_url: z.string().nullish().optional(),
  })
  .superRefine((data, ctx) => {
    // Phone number validation through superRefine

    // const isValidPhone = /^\+\d{3}\d{3}\d{3}\d{3}$/.test(data.phone);
    const isValidPhone = /^\d{12}$/.test(data?.phone ?? ""); // Matches exactly 12 digits
    if (!isValidPhone) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        // message: "Invalid phone number format. Please use a valid phone number, e.g., (+256) 123 123 123",
        message:
          "Invalid phone number format. Please enter a valid 12-digit number, e.g., 256701234567",
      });
    }




  });

const defaultValues: FormData = {
  name: "",
  email: "",
  phone: "",
  gender: "Male",
  allow_notifications: false,
  current_password: "",
  new_password: "",
};

// ✅ TypeScript Type for Form Fields
type FormData = z.infer<typeof formSchema>;

const UserForm: React.FC<{
  handleFormSubmit: (FormData: FormData | null) => any;
  formMutation: any;
  initialData?: FormData;
}> = ({ handleFormSubmit, formMutation, initialData }) => {
  const finalInitialData = { ...defaultValues, ...initialData };

  const {
    handleSubmit,
    setValue,
    getValues,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: finalInitialData,
  });

  const router = useRouter();

  console.log("🚀Form ~ errors:", errors);

  const allValuesInForm = getValues();
  console.log("🚀 ~ allValuesInForm:", allValuesInForm);

  // Get current photo from form state
  const photo = watch("photo");
  // Get existing photo path
  const existingPhoto = watch("photo_url");




  // ===================================  ✅ Handle Form Submission =============================
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<FormData | null>(null);

  const onSubmit = (data: FormData) => {
    setPendingData(data);
    setShowConfirmDialog(true);
  };

  //======================= Confirm Submit ================================

  const onConfirmSubmit = (e: any) => {
    e.preventDefault();
    handleFormSubmit(pendingData);
    setShowConfirmDialog(false);
  };

  const onCancelSubmit = (e?: any) => {
    e.preventDefault();
    setShowConfirmDialog(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 items-start">
          {/* Name */}
          <div className="p-field">
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

          {/* Email */}
          <div className="p-field">
            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <InputText
                  {...field}
                  type="email"
                  className={`w-full ${errors.email ? "p-invalid" : ""}`}
                />
              )}
            />
            {errors.email && (
              <small className="p-error">{errors.email.message}</small>
            )}
          </div>

          {/* Phone Number */}
          <div className="p-field">
            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <InputMask
                  {...field}
                  mask="999999999999" // exactly 12 digits
                  slotChar=""
                  className={`w-full ${errors.phone ? "p-invalid" : ""}`}
                  placeholder="Enter 12-digit phone number"
                />
              )}
            />
            {errors.phone && (
              <small className="p-error">{errors.phone.message}</small>
            )}
          </div>

          {/* Gender */}
          <div>
            <label>Gender *</label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                  ]}
                  placeholder="Select gender"
                  className={`w-full ${errors.gender ? "p-invalid" : ""}`}
                />
              )}
            />
            {errors.gender && (
              <small className="p-error">{errors.gender.message}</small>
            )}
          </div>

          {/* Allow Notifications */}
          <div className="flex items-center gap-2">
            <Controller
              name="allow_notifications"
              control={control}
              render={({ field }) => (
                <Checkbox
                  inputId="allow_notifications"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.checked)}
                />
              )}
            />
            <label htmlFor="allow_notifications">Allow Notifications</label>
          </div>


          {/* Current Password (Required) */}
          <div className="p-field">
            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
              Current Password <span className="text-red-500">*</span>
            </label>
            <Controller
              name="current_password"
              control={control}
              render={({ field }) => (
                <Password
                  {...field}
                  toggleMask
                  feedback={false}
                  className={`w-full ${errors.current_password ? "p-invalid" : ""}`}
                  inputClassName="w-full"
                  pt={{
                    iconField: {
                      root: { style: { width: "100%" } },
                      style: { width: "100%" },
                    },
                    input: { style: { width: "100%" } },
                    root: { style: { width: "100%" } },
                    showIcon: { style: { right: "0.25rem" } },
                    hideIcon: { style: { right: "0.25rem" } },
                  }}
                />
              )}
            />
            {errors.current_password && (
              <small className="p-error">{errors.current_password.message}</small>
            )}
          </div>

          {/* New Password (Optional) */}
          <div className="p-field">
            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
              New Password
            </label>
            <Controller
              name="new_password"
              control={control}
              render={({ field }) => (
                <Password
                  {...field}
                  toggleMask
                  feedback={false}
                  className={`w-full ${errors.new_password ? "p-invalid" : ""}`}
                  inputClassName="w-full"
                  pt={{
                    iconField: {
                      root: { style: { width: "100%" } },
                      style: { width: "100%" },
                    },
                    input: { style: { width: "100%" } },
                    root: { style: { width: "100%" } },
                    showIcon: { style: { right: "0.25rem" } },
                    hideIcon: { style: { right: "0.25rem" } },
                  }}
                />
              )}
            />
            {errors.new_password && (
              <small className="p-error">{errors.new_password.message}</small>
            )}
          </div>





          {/* Photo Upload */}
          <div className="sm:col-span-1 md:col-span-2 lg:col-span-3">
            <PhotoUploadPicker
              setValue={setValue}
              photo={photo}
              existingPhoto={existingPhoto}
              fieldName="photo"
              label="User Photo"
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center pt-4">
            <Button
              type="submit"
              label="Submit"
              icon={
                formMutation?.isPending
                  ? "pi pi-spin pi-spinner"
                  : "pi pi-user-plus"
              }
              className="p-3 text-xl"
              disabled={formMutation?.isPending}
            />
          </div>
        </div>
      </form>

      <Dialog
        header="Confirm User Creation"
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
        Are you sure you want to update your profile?
      </Dialog>
    </>
  );
};

export default UserForm;
