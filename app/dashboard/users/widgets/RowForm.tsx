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
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(/^[a-zA-Z0-9._-]+$/, "Username can only contain letters, numbers, dots, underscores, or hyphens"),
    password: z.string().trim().optional(), // ✅ make it optional first
    editing: z.boolean().optional().nullable(),
    role: z
      .enum(["System Admin", "Customer"])
      .refine((val) => !!val, { message: "Please select a role" }),
    status: z.enum(["active", "inactive"]),
    gender: z.enum(["Male", "Female", "Prefer not to say"]).nullable().optional(),


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
    // Phone number validation
    const isValidPhone = /^\d{12}$/.test(data?.phone ?? ""); // Matches exactly 12 digits
    if (!isValidPhone) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message:
          "Invalid phone number format. Please enter a valid 12-digit number, e.g., 255712345678",
      });
    }

    // ✅ Conditionally require password if not editing
    if (
      data?.editing === true &&
      data?.password &&
      data?.password?.length < 8
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password must be at least 8 characters",
      });
    }

    // make password a must when creating
    if (
      (data?.editing === false || !data?.editing) &&
      (data?.password ?? "").length < 8
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password must be at least 8 characters",
      });
    }

  });

const defaultValues: FormData = {
  name: "",
  email: "",
  username: "",
  phone: "",
  password: "",
  role: "System Admin" as const,
  status: "active" as const,
};

// ✅ TypeScript Type for Form Fields
type FormData = z.infer<typeof formSchema>;

const UserForm: React.FC<{
  handleFormSubmit: (FormData: FormData | null) => any;
  formMutation: any;
  initialData?: FormData;
  userId?: string | null
}> = ({ handleFormSubmit, formMutation, initialData, userId }) => {
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

  // Watch for dependent field changes
  const selectedRole = watch("role");





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
        {/* BIO */}
        <div className="col-span-1 p-4 border border-gray-300 dark:border-gray-700 rounded-md mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">BIO</h3>
          {/* <div className="w-full h-0.5 bg-gray-300 dark:bg-gray-700 mt-1 mb-3"></div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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

            {/* Username */}
            <div className="p-field">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <InputText
                    {...field}
                    placeholder="Enter username (e.g., jdoe)"
                    className={`w-full ${errors.username ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.username && (
                <small className="p-error">{errors.username.message}</small>
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

            {/* Password */}
            <div className="p-field">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Password
                    {...field}
                    toggleMask
                    className={`w-full ${errors.password ? "p-invalid" : ""}`}
                    inputClassName="w-full"
                    pt={{
                      iconField: {
                        root: {
                          style: { width: "100%" },
                        },
                        style: { width: "100%" },
                      },
                      input: {
                        style: { width: "100%" },
                      },
                      root: {
                        style: { width: "100%" },
                      },
                      showIcon: { style: { right: "0.25rem" } },
                      hideIcon: { style: { right: "0.25rem" } },
                    }}
                  />
                )}
              />
              {errors.password && (
                <small className="p-error">{errors.password.message}</small>
              )}
            </div>

            {/* Gender */}
            <div className="p-field">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                Gender
              </label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Prefer not to say", value: "Prefer not to say" },
                    ]}
                    placeholder="Select gender"
                    showClear
                    className={`w-full ${errors.gender ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.gender && (
                <small className="p-error">{errors.gender.message}</small>
              )}
            </div>

            {/* Status */}
            <div className="p-field">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={[
                      { label: "Active", value: "active" },
                      { label: "Inactive", value: "inactive" },
                    ]}
                    className={`w-full ${errors.status ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.status && (
                <small className="p-error">{errors.status.message}</small>
              )}
            </div>


          </div>
        </div>

        {/* Administration */}
        <div className="col-span-1 p-4 border border-gray-300 dark:border-gray-700 rounded-md mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Administration</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Role */}
            <div className="p-field">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={[
                      { label: "System Admin", value: "System Admin" },
                      { label: "Customer", value: "Customer" },
                    ]}
                    onChange={(e) => {
                      field.onChange(e.value);

                    }}
                    className={`w-full ${errors.role ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.role && (
                <small className="p-error">{errors.role.message}</small>
              )}
            </div>

          </div>
        </div>

        {/* Profile Picture */}
        <div className="col-span-1 p-4 border border-gray-300 dark:border-gray-700 rounded-md mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Profile Picture</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

            {/* Photo Upload */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <PhotoUploadPicker
                setValue={setValue}
                photo={photo}
                existingPhoto={existingPhoto}
                fieldName="photo"
                label="User Photo"
              />
            </div>
          </div>
        </div>





        {/* Submit Button */}
        <div className="w-full flex justify-center pt-4">
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
        Are you sure you want to submit this user&apos;s data?
      </Dialog>
    </>
  );
};

export default UserForm;