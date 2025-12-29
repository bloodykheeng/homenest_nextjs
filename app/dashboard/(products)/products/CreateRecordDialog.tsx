"use client";

import React, { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import {
  postProduct,
} from "@/services/products/products-service";

import RowForm from "./widgets/RowForm";

import useHandleQueryError from "@/hooks/useHandleQueryError";
import { notFound } from "next/navigation";

import { getProductSubcategoryById } from "@/services/products/product-subcategories-service";

import MaterialUiLoaderLottie from "@/public/lottie-files/material-ui-loading-lottie.json";
import SnailErrorLottie from "@/public/lottie-files/snail-error-lottie.json";
import SkeletonLoadingLottie from "@/public/lottie-files/SkeletonLoadingLottie.json";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface CreateRecordDialogProps {
  visible: boolean;
  onHide: () => void;
  initialData?: any;
  selectedSearchParams: {
    productCategoryId?: string;
    productSubCategoryId?: string;
  };
}

const CreateRecordDialog: React.FC<CreateRecordDialogProps> = ({
  visible,
  onHide,
  initialData,
  selectedSearchParams,
}) => {
  const queryClient = useQueryClient();
  const primeReactToast = usePrimeReactToast();

  // Fetch the subcategory by ID
  const getProductSubcategoryByIdQuery = useQuery({
    queryKey: [
      "product-subcategories",
      "by-id",
      selectedSearchParams?.productSubCategoryId,
    ],
    queryFn: () =>
      getProductSubcategoryById(selectedSearchParams?.productSubCategoryId),
    enabled: !!selectedSearchParams?.productSubCategoryId,
  });

  useHandleQueryError(getProductSubcategoryByIdQuery);

  // Handle product sub category not found
  useEffect(() => {
    if (
      !getProductSubcategoryByIdQuery.isPending &&
      getProductSubcategoryByIdQuery.isError
    ) {
      notFound();
    }
  }, [getProductSubcategoryByIdQuery.isPending]);

  const createMutation = useMutation({
    mutationFn: postProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      primeReactToast.success("Product created successfully");
      onHide();
    },
  });

  useHandleMutationError(createMutation.error);

  const handleFormSubmit = (data: any) => {
    if (data) {
      const formData = new FormData();

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
      formData.append("sizes", JSON.stringify(data?.sizes?.map((s: string) => ({ size_name: s })) ?? []));

      // Handle additional info
      formData.append("additional_info", JSON.stringify(data?.additional_info ?? []));

      // Handle attachments
      if (data?.attachments && data.attachments.length > 0) {
        data.attachments.forEach((attachment: any, index: number) => {
          if (attachment.status === "new" && attachment.file) {
            formData.append(`attachments[${index}][file_path]`, attachment.file);
            formData.append(`attachments[${index}][type]`, attachment.type || "");
            formData.append(`attachments[${index}][caption]`, attachment.caption || "");
            formData.append(`attachments[${index}][featured]`, attachment.featured ? "1" : "0");
          }
        });
      }

      // Send data to mutation
      createMutation.mutate(formData);
    }
  };

  const enhancedInitialData = {
    ...initialData,
    name: initialData?.name || "",
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
    subcategory: getProductSubcategoryByIdQuery?.data?.data?.data ?? null,
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
      header="Create New Product"
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
        {getProductSubcategoryByIdQuery?.isPending &&
          !!selectedSearchParams?.productSubCategoryId ? (
          <div className="col-12">
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ maxWidth: "100%" }}>
                <Lottie
                  animationData={SkeletonLoadingLottie}
                  loop={true}
                  style={{ height: "300px" }}
                  autoplay={true}
                />
                <Lottie
                  animationData={MaterialUiLoaderLottie}
                  style={{ height: "50px" }}
                  loop={true}
                  autoplay={true}
                />
              </div>
            </div>
          </div>
        ) : getProductSubcategoryByIdQuery?.isError &&
          !!selectedSearchParams?.productSubCategoryId ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ maxWidth: "400px" }}>
              <Lottie
                animationData={SnailErrorLottie}
                loop={true}
                autoplay={true}
              />
            </div>
          </div>
        ) : (
          <>
            <RowForm
              handleFormSubmit={handleFormSubmit}
              formMutation={createMutation}
              initialData={enhancedInitialData}
              selectedSearchParams={selectedSearchParams}
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
          </>
        )}
      </div>
    </Dialog>
  );
};

export default CreateRecordDialog;