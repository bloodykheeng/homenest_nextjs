"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Image } from "primereact/image";
import { Chip } from "primereact/chip";

import {
  FaUserTag
} from "react-icons/fa";

import dynamic from "next/dynamic";

const ViewMapButtonDialog = dynamic(
  () => import("@/components/admin-panel/map/ViewMapButtonDialog"),
  {
    ssr: false,
  }
);

interface RecordDetailsDialogProps {
  visible: boolean;
  onHide: () => void;
  selectedRecord: any;
}

const RecordDetailsDialog: React.FC<RecordDetailsDialogProps> = ({
  visible,
  onHide,
  selectedRecord,
}) => {
  console.log("🚀 ~ Users RecordDetailsDialog ~ selectedRecord:", selectedRecord)
  return (
    <Dialog
      header="User Details"
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
            icon="pi pi-user"
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
          {/* User Information */}
          <div>
            <h4 className="text-lg font-semibold mb-3 border-b pb-1">
              User Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <p>
                <strong>Name: </strong> {selectedRecord?.name || "N/A"}
              </p>
              <p>
                <strong>Username: </strong> {selectedRecord?.username || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {selectedRecord?.email || "N/A"}
              </p>
              <p>
                <strong>Role:</strong> {selectedRecord?.role || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {selectedRecord?.status || "N/A"}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-3 border-b pb-1">
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <p>
                <strong>Phone Number:</strong> {selectedRecord?.phone || "N/A"}
              </p>
            </div>
          </div>

          {/* CSO/Oversight Institution Information */}
          {
            ['CSO Reviewer', 'Community Accountability Champion', 'Oversight Institution Admin'].includes(selectedRecord?.role) && (
              <div>
                <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                  Organization Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  {['CSO Reviewer', 'Community Accountability Champion'].includes(selectedRecord?.role) && (
                    <p>
                      <strong>CSO:</strong>{" "}
                      {selectedRecord?.cso?.name || "N/A"}
                    </p>
                  )}

                  {['Oversight Institution Admin'].includes(selectedRecord?.role) && (
                    <p>
                      <strong>Oversight Institution:</strong>{" "}
                      {selectedRecord?.oversight_institution?.name || "N/A"}
                    </p>
                  )}
                </div>
              </div>
            )
          }

          {/* Location Information */}
          {
            ['Community Accountability Champion'].includes(selectedRecord?.role) && (
              <div>
                <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                  Location Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  <p>
                    <strong>State:</strong>{" "}
                    {selectedRecord?.state?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Region:</strong>{" "}
                    {selectedRecord?.region?.name || "N/A"}
                  </p>
                  <p>
                    <strong>District:</strong>{" "}
                    {selectedRecord?.district?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Ward:</strong>{" "}
                    {selectedRecord?.ward?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Village:</strong>{" "}
                    {selectedRecord?.village?.name || "N/A"}
                  </p>
                </div>
              </div>
            )
          }

          {/* User Photo */}
          {selectedRecord?.photo_url && (
            <div>
              <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                User Photo
              </h4>
              <div className="flex justify-center">
                <Image
                  src={selectedRecord.photo_url}
                  alt="User Photo"
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

export default RecordDetailsDialog;