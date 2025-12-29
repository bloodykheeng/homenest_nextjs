"use client";

import React, { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";
import useHandleQueryError from "@/hooks/useHandleQueryError";

import { notFound } from "next/navigation";

import {
  getAllProductSubcategories,
  getProductSubcategoryById,
  postProductSubcategory,
  updateProductSubcategory,
  patchProductSubcategory,
  deleteProductSubcategoryById,
  postToBulkDestroyProductSubcategories,
} from "@/services/products/product-subcategories-service";

import RowForm from "./widgets/RowForm"; // Ensure this is correct

import { getProductCategoryById } from "@/services/products/product-categories-service";

import MaterialUiLoaderLottie from "@/public/lottie-files/material-ui-loading-lottie.json";
import SnailErrorLottie from "@/public/lottie-files/snail-error-lottie.json";
// import SateLiteLottie from "@/public/lottie-files/satelite-loading-lottie.json";
// import FileLoadingLottie from "@/public/lottie-files/FileLoadingLottie.json";
import SkeletonLoadingLottie from "@/public/lottie-files/SkeletonLoadingLottie.json";
import NoDataLottie from "@/public/lottie-files/nodata.json";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface CreateRecordDialogProps {
  visible: boolean;
  onHide: () => void;
  initialData?: any;
  selectedSearchParams: { productCategoryId?: string };
}

const CreateRecordDialog: React.FC<CreateRecordDialogProps> = ({
  visible,
  onHide,
  initialData,
  selectedSearchParams,
}) => {
  const queryClient = useQueryClient();
  const primeReactToast = usePrimeReactToast();

  // Fetch the product category by ID
  const getProductCategoryByIdQuery = useQuery({
    queryKey: [
      "product-categories",
      "by-id",
      selectedSearchParams?.productCategoryId,
    ],
    queryFn: () =>
      getProductCategoryById(selectedSearchParams?.productCategoryId),
    enabled: !!selectedSearchParams?.productCategoryId,
  });

  useHandleQueryError(getProductCategoryByIdQuery);

  // Handle product category not found
  useEffect(() => {
    if (
      !getProductCategoryByIdQuery.isPending &&
      getProductCategoryByIdQuery.isError
    ) {
      notFound();
    }
  }, [getProductCategoryByIdQuery.isPending]);

  const createMutation = useMutation({
    mutationFn: postProductSubcategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-subcategories"] });
      primeReactToast.success("Product Sub Category created successfully");
      onHide();
    },
  });

  useHandleMutationError(createMutation.error);

  const handleFormSubmit = (data: any) => {
    if (data) {
      const formData = new FormData();

      // Add basic fields
      formData.append(
        "product_category_id",
        data?.category?.id?.toString() || ""
      );
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

  const enhancedInitialData = {
    ...initialData,
    name: initialData?.name || "",
    status: "active",
    category: getProductCategoryByIdQuery?.data?.data?.data ?? null,
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
      header="Create New Product Sub Category"
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
        {getProductCategoryByIdQuery?.isPending &&
          !!selectedSearchParams?.productCategoryId ? (
          <div className="col-12">
            {/* <ProgressBar mode="indeterminate" style={{ height: "6px" }} /> */}
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
        ) : getProductCategoryByIdQuery?.isError &&
          !!selectedSearchParams?.productCategoryId ? (
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
