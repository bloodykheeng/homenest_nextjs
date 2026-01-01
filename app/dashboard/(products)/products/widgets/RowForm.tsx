"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { AutoComplete } from "primereact/autocomplete";
import { ProgressSpinner } from "primereact/progressspinner";
import { MultiSelect } from "primereact/multiselect";
import { Checkbox } from "primereact/checkbox";

import FileUploaderPicker from "@/components/admin-panel/fileUploadPickers/FileUploadPicker";
import AdditionalInfoManager from "./AdditionalInfoManager";
import ColorManager from "./ColorManager";
import { useQuery } from "@tanstack/react-query";
import useHandleQueryError from "@/hooks/useHandleQueryError";
import { getAllProductSubcategories } from "@/services/products/product-subcategories-service";

const requireField = (val: any, ctx: z.RefinementCtx, fieldName: string) => {
  if (!!val === false) {
    ctx.addIssue({
      code: 'custom',
      message: `${fieldName} is required`,
    });
    return z.NEVER;
  }
  return val;
};

const formSchema = z.object({
  subcategory: z
    .object({ id: z.number(), name: z.string() })
    .nullish()
    .superRefine((val, ctx) => requireField(val, ctx, "Subcategory")),
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  price: z.coerce
    .number()
    .min(0, "Price must be a positive number")
    .superRefine((val, ctx) => {
      if (!val || val <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "Price is required and must be greater than 0",
        });
      }
    }),
  quantity: z.coerce.number().min(0, "Quantity must be at least 0"),
  discount: z.coerce.number().min(0).max(100, "Discount must be between 0 and 100").optional(),
  status: z.enum(["active", "inactive", "out_of_stock"]),
  show_in_slider: z.boolean().optional(),

  // Colors
  colors: z.array(
    z.object({
      id: z.number().optional(),
      color_name: z.string(),
      color_code: z.string(),
    })
  ).optional(),

  // Sizes
  sizes: z.array(z.string()).optional(),

  // Additional Info
  additional_info: z.array(
    z.object({
      id: z.number().optional(),
      key: z.string(),
      value: z.string(),
    })
  ).optional(),

  // Attachments
  attachments: z
    .array(
      z.object({
        type: z.string(),
        file: z.instanceof(File).optional(),
        previewUrl: z.string(),
        caption: z.string().trim().optional(),
        status: z.string().optional(),
        existing_attachment_id: z.number().optional(),
        file_path: z.string().optional(),
        featured: z.boolean().optional(),
      })
    )
    .optional(),

  product_attachments: z
    .array(
      z.object({
        id: z.number().optional(),
        product_id: z.number().optional().nullable(),
        type: z.string(),
        file_path: z.string(),
        caption: z.string().trim().optional().nullable(),
        featured: z.boolean().optional(),
      })
    )
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
  subcategory: null,
  name: "",
  description: "",
  price: 0,
  quantity: 0,
  discount: 0,
  status: "active",
  show_in_slider: false,
  colors: [],
  sizes: [],
  additional_info: [],
  attachments: [],
  product_attachments: [],
};

const ProductForm: React.FC<{
  handleFormSubmit: (data: FormData | null) => any;
  formMutation: any;
  initialData?: FormData;
  selectedSearchParams: any;
}> = ({
  handleFormSubmit,
  formMutation,
  initialData = defaultValues,
  selectedSearchParams,
}) => {
    const {
      register,
      handleSubmit,
      control,
      watch,
      setValue,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: initialData,
    });


    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState<FormData | null>(null);
    const [subcategorySuggestions, setSubcategorySuggestions] = useState([]);

    const attachments = watch("attachments") || [];
    const existingAttachments = watch("product_attachments") || [];
    const colors = watch("colors") || [];
    const additionalInfo = watch("additional_info") || [];

    const subcategoriesQuery = useQuery({
      queryKey: [
        "product-subcategories",
        selectedSearchParams?.productCategoryId,
      ],
      queryFn: () =>
        getAllProductSubcategories({
          product_category_id: selectedSearchParams?.productCategoryId,
        }),
      enabled: !!selectedSearchParams?.productCategoryId,
    });
    useHandleQueryError(subcategoriesQuery);

    useEffect(() => {
      // Merge existing attachments
      const existingIds = new Set(
        attachments.map((a) => a.existing_attachment_id).filter((id) => !!id)
      );
      const filteredExisting = existingAttachments
        .filter((attachment) => !existingIds.has(attachment.id))
        .map((attachment) => ({
          type: attachment.type,
          previewUrl: `${attachment.file_path}`,
          caption: attachment.caption || undefined,
          status: "existing",
          existing_attachment_id: attachment.id,
          file_path: attachment.file_path,
          featured: attachment.featured || false,
        }));
      const mergedAttachments = [...attachments, ...filteredExisting];
      setValue("attachments", mergedAttachments);
    }, []);

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

    const statusOptions = [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Out of Stock", value: "out_of_stock" },
    ];

    const sizeOptions = [
      { label: "XS", value: "XS" },
      { label: "S", value: "S" },
      { label: "M", value: "M" },
      { label: "L", value: "L" },
      { label: "XL", value: "XL" },
      { label: "XXL", value: "XXL" },
      { label: "XXXL", value: "XXXL" },
    ];

    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {/* Subcategory */}
            <div className="p-field">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                Subcategory <span className="text-red-500">*</span>
              </label>
              <Controller
                name="subcategory"
                control={control}
                render={({ field }) => {
                  const fetchSubcategorySuggestions = (event: any) => {
                    const query = event.query.toLowerCase();
                    const selectedSubcategory = field.value || null;

                    const filtered =
                      subcategoriesQuery?.data?.data?.data?.filter(
                        (item: any) =>
                          item?.name?.toLowerCase().includes(query) &&
                          item?.id !== selectedSubcategory?.id
                      ) || [];

                    setSubcategorySuggestions(filtered);
                  };

                  return (
                    <AutoComplete
                      {...field}
                      multiple={false}
                      suggestions={subcategorySuggestions}
                      completeMethod={fetchSubcategorySuggestions}
                      field="name"
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      dropdown
                      disabled={subcategoriesQuery?.isPending}
                      placeholder="Search & Select Subcategory"
                      className={`w-full ${errors.subcategory ? "p-invalid" : ""}`}
                    />
                  );
                }}
              />
              {errors.subcategory && (
                <small className="p-error">
                  {errors?.subcategory?.message?.toString()}
                </small>
              )}
            </div>

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

            {/* Price */}
            <div className="p-field">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                Price <span className="text-red-500">*</span>
              </label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    value={field.value ? Number(field.value) : undefined}
                    onChange={(e) =>
                      field.onChange(e.value ? Number(e.value) : undefined)
                    }
                    mode="decimal"
                    currency="UGX"
                    locale="en-UG"
                    min={0}
                    className={`w-full ${errors.price ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.price && (
                <small className="p-error">{errors.price.message}</small>
              )}
            </div>

            {/* Quantity */}
            <div className="p-field">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    value={field.value ? Number(field.value) : undefined}
                    onChange={(e) =>
                      field.onChange(e.value ? Number(e.value) : undefined)
                    }
                    min={0}
                    className={`w-full ${errors.quantity ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.quantity && (
                <small className="p-error">{errors.quantity.message}</small>
              )}
            </div>

            {/* Discount */}
            <div className="p-field">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                Discount (%)
              </label>
              <Controller
                name="discount"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    value={field.value ? Number(field.value) : undefined}
                    onChange={(e) =>
                      field.onChange(e.value ? Number(e.value) : undefined)
                    }
                    min={0}
                    max={100}
                    className={`w-full ${errors.discount ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.discount && (
                <small className="p-error">{errors.discount.message}</small>
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
                    options={statusOptions}
                    className={`w-full ${errors.status ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.status && (
                <small className="p-error">{errors.status.message}</small>
              )}
            </div>

            {/* Show in Slider */}
            <div className="p-field">
              <Controller
                name="show_in_slider"
                control={control}
                render={({ field }) => (
                  <div className="flex align-items-center">
                    <Checkbox
                      inputId="show_in_slider"
                      checked={field.value || false}
                      onChange={(e) => field.onChange(e.checked)}
                    />
                    <label htmlFor="show_in_slider" className="ml-2">
                      Show in Slider
                    </label>
                  </div>
                )}
              />
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
            </div>

            {/* Colors Section */}
            <div className="col-span-full mt-4">
              <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                Colors
              </h4>
              <ColorManager
                colors={colors}
                setColors={(colors: any) => setValue("colors", colors)}
              />
            </div>

            {/* Sizes Section */}
            <div className="col-span-full mt-4">
              <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                Sizes
              </h4>
              <Controller
                name="sizes"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    {...field}
                    options={sizeOptions}
                    placeholder="Select Sizes"
                    className="w-full"
                    display="chip"
                  />
                )}
              />
            </div>

            {/* Additional Information Section */}
            <div className="col-span-full mt-4">
              <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                Additional Information
              </h4>
              <AdditionalInfoManager
                additionalInfo={additionalInfo}
                setAdditionalInfo={(info: any) => setValue("additional_info", info)}
              />
            </div>

            {/* Product Attachments Section */}
            <div className="col-span-full mt-4">
              <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                Product Attachments
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Upload product images, videos, or documents
              </p>
            </div>
            <div className="col-span-full">
              <FileUploaderPicker
                setValue={setValue}
                attachments={attachments}
                allowedTypes={["Picture", "Video", "Document"]}
                allowFeatured={true}
              />
              {errors.attachments && (
                <small className="p-error block mt-2">
                  {errors.attachments.message}
                </small>
              )}
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

        {/* Confirm Dialog */}
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
          Are you sure you want to submit this product data?
        </Dialog>
      </>
    );
  };

export default ProductForm;