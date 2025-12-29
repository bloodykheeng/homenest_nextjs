"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Image } from "primereact/image";
import { Chip } from "primereact/chip";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface ProductRecordDetailsDialogProps {
  visible: boolean;
  onHide: () => void;
  selectedRecord: any;
}

const ProductRecordDetailsDialog: React.FC<ProductRecordDetailsDialogProps> = ({
  visible,
  onHide,
  selectedRecord,
}) => {
  return (
    <Dialog
      header="Product Details"
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
      style={{ width: "70vw" }}
    >
      <div className="flex flex-col items-center p-6">
        <div className="flex items-center mb-6">
          <Avatar
            icon="pi pi-shopping-cart"
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
                selectedRecord?.status === "active"
                  ? "success"
                  : selectedRecord?.status === "out_of_stock"
                    ? "warning"
                    : "danger"
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
                {selectedRecord?.subcategory?.category?.name || "N/A"}
              </p>
              <p>
                <strong>Subcategory:</strong>{" "}
                {selectedRecord?.subcategory?.name || "N/A"}
              </p>
              <p>
                <strong>Price:</strong>{" "}
                {selectedRecord?.price !== undefined
                  ? `UGX ${Number(selectedRecord.price).toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}`
                  : "N/A"}
              </p>
              <p>
                <strong>Quantity:</strong> {selectedRecord?.quantity || "0"}
              </p>
              <p>
                <strong>Discount:</strong> {selectedRecord?.discount || "0"}%
              </p>
              <p>
                <strong>Rating:</strong> {selectedRecord?.rating || "0"}/5
              </p>
              <p>
                <strong>Status:</strong> {selectedRecord?.status || "N/A"}
              </p>
              <p>
                <strong>Show in Slider:</strong>{" "}
                {selectedRecord?.show_in_slider ? (
                  <span className="text-green-600 font-semibold">Yes</span>
                ) : (
                  <span className="text-gray-500">No</span>
                )}
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

          {/* Colors */}
          {selectedRecord?.colors && selectedRecord.colors.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                Available Colors
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedRecord.colors.map((color: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded"
                  >
                    {color.color_code && (
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: color.color_code }}
                      />
                    )}
                    <span>{color.color_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {selectedRecord?.sizes && selectedRecord.sizes.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                Available Sizes
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedRecord.sizes.map((size: any, index: number) => (
                  <Chip key={index} label={size.size_name} />
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {selectedRecord?.additional_info && selectedRecord.additional_info.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                Additional Information
              </h4>
              <DataTable
                value={selectedRecord.additional_info}
                className="p-datatable-sm"
                stripedRows
              >
                <Column field="key" header="Property" style={{ width: "30%" }} />
                <Column field="value" header="Value" style={{ width: "70%" }} />
              </DataTable>
            </div>
          )}

          {/* Product Attachments */}
          {selectedRecord?.product_attachments && selectedRecord.product_attachments.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                Product Attachments
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedRecord.product_attachments.map((attachment: any, index: number) => (
                  <div key={index} className="border rounded-lg p-3">
                    {attachment.featured && (
                      <Badge value="Featured" severity="warning" className="mb-2" />
                    )}
                    {attachment.type === "Picture" || attachment.type === "image" ? (
                      <Image
                        src={attachment.file_path}
                        alt={attachment.caption || "Product Image"}
                        width="100%"
                        preview
                        className="rounded"
                      />
                    ) : attachment.type === "Video" || attachment.type === "video" ? (
                      <video width="100%" controls className="rounded">
                        <source src={attachment.file_path} type="video/mp4" />
                        Your browser does not support video playback.
                      </video>
                    ) : (
                      <a
                        href={attachment.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <i className="pi pi-file text-2xl" />
                        <span>View Document</span>
                      </a>
                    )}
                    {attachment.caption && (
                      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        {attachment.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {selectedRecord?.reviews && selectedRecord.reviews.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                Customer Reviews ({selectedRecord.reviews.length})
              </h4>
              <div className="space-y-3">
                {selectedRecord.reviews.map((review: any, index: number) => (
                  <div key={index} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-2">
                      <strong>{review.user?.name || "Anonymous"}</strong>
                      <Badge value={`${review.rating}/5`} severity="info" />
                    </div>
                    {review.comment && <p className="text-sm">{review.comment}</p>}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
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

export default ProductRecordDetailsDialog;