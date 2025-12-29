"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Image } from "primereact/image";

interface ProductSubcategoryRecordDetailsDialogProps {
  visible: boolean;
  onHide: () => void;
  selectedRecord: any;
}

const ProductSubcategoryRecordDetailsDialog: React.FC<
  ProductSubcategoryRecordDetailsDialogProps
> = ({ visible, onHide, selectedRecord }) => {
  return (
    <Dialog
      header="Product Subcategory Details"
      visible={visible}
      footer={
        <Button
          label="Close"
          icon="pi pi-times"
          onClick={onHide}
          className="p-button-text"
        />
      }
      onHide={onHide}
      closeOnEscape
      closable
      maximizable
    >
      <div className="flex flex-col items-center p-6">
        <div className="flex items-center mb-6">
          <Avatar
            icon="pi pi-tag"
            size="xlarge"
            shape="circle"
            className="mr-4"
          />
          <div>
            <h3 className="text-xl font-bold">
              {selectedRecord?.name || "N/A"}
            </h3>
            <Badge
              value={selectedRecord?.status || "N/A"}
              severity={
                selectedRecord?.status === "active" ? "success" : "danger"
              }
            />
          </div>
        </div>

        <div className="mt-4 w-full max-w-4xl space-y-6 text-sm">
          {/* Basic Information */}
          <div>
            <h4 className="text-lg font-semibold mb-3 border-b pb-1">
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <p>
                <strong>Name:</strong> {selectedRecord?.name || "N/A"}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {selectedRecord?.category?.name || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {selectedRecord?.status || "N/A"}
              </p>
            </div>
            {selectedRecord?.description && (
              <div className="mt-3">
                <p>
                  <strong>Description:</strong> {selectedRecord.description}
                </p>
              </div>
            )}
          </div>

          {/* Business Central Information */}
          <div>
            <h4 className="text-lg font-semibold mb-3 border-b pb-1">
              Business Central Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <p>
                <strong>BC Sub Category ID:</strong>{" "}
                {selectedRecord?.bc_sub_category_id || "N/A"}
              </p>
              <p>
                <strong>BC Sub Category Code:</strong>{" "}
                {selectedRecord?.bc_sub_category_code || "N/A"}
              </p>
            </div>
          </div>

          {/* Subcategory Photo */}
          {selectedRecord?.photo_url && (
            <div>
              <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                Subcategory Photo
              </h4>
              <div className="flex justify-center">
                <Image
                  src={selectedRecord.photo_url}
                  alt="Subcategory Photo"
                  width="300"
                  height="200"
                  preview
                  className="border rounded-lg"
                />
              </div>
            </div>
          )}

          {/* System Metadata */}
          <div>
            <h4 className="text-lg font-semibold mb-3 border-b pb-1">
              System Metadata
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <p>
                <strong>Created By:</strong>{" "}
                {selectedRecord?.created_by?.name || "N/A"}
              </p>
              <p>
                <strong>Updated By:</strong>{" "}
                {selectedRecord?.updated_by?.name || "N/A"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {selectedRecord?.created_at
                  ? new Date(selectedRecord.created_at).toLocaleString()
                  : "N/A"}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {selectedRecord?.updated_at
                  ? new Date(selectedRecord.updated_at).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProductSubcategoryRecordDetailsDialog;
