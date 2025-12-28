"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import moment from "moment";

import NotificationRespondentsInfo from "./view/NotificationRespondentsInfo";
import NotificationViewedBy from "./view/NotificationViewedBy";

interface RecordDetailsDialogProps {
    visible: boolean;
    onHide: () => void;
    selectedRecord: any;
}

// Helper function to format dates
const formatDate = (date?: string): string =>
    date ? moment(date).format("Do MMMM YYYY, h:mm A") : "N/A";

const RecordDetailsDialog: React.FC<RecordDetailsDialogProps> = ({
    visible,
    onHide,
    selectedRecord
}) => {
    console.log("🚀 ~ Notification selectedRecord:", selectedRecord);

    const notificationId = selectedRecord?.id;

    return (
        <Dialog
            header="Notification Details"
            visible={visible}
            style={{ minWidth: '300px' }}
            modal
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
                <Avatar
                    icon="pi pi-bell"
                    size="xlarge"
                    shape="circle"
                    className="mb-4"
                />

                <div className="mt-8 w-full max-w-4xl space-y-6 text-sm">
                    {/* Notification Information */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                            Notification Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <p><strong>Title:</strong> {selectedRecord?.title || "N/A"}</p>
                            <p><strong>Type:</strong> {selectedRecord?.type || "N/A"}</p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span
                                    className={`px-2 py-1 rounded ${selectedRecord?.status === "active"
                                        ? "bg-green-200 text-green-800"
                                        : "bg-red-200 text-red-800"
                                        }`}
                                >
                                    {selectedRecord?.status || "N/A"}
                                </span>
                            </p>
                            <p><strong>Target Audience:</strong> {selectedRecord?.target_audience || "N/A"}</p>
                            <p><strong>Gender:</strong> {selectedRecord?.gender || "N/A"}</p>
                            <p><strong>Scope:</strong> {selectedRecord?.scope || "N/A"}</p>
                            <p><strong>Start Date:</strong> {formatDate(selectedRecord?.start_date)}</p>
                            <p><strong>End Date:</strong> {formatDate(selectedRecord?.end_date)}</p>
                            <div className="col-span-2">
                                <p><strong>Description:</strong> {selectedRecord?.description || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Respondents Information Section */}
                    <NotificationRespondentsInfo recordDetails={selectedRecord} />

                    {/* Metadata */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">Metadata</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <p><strong>Created At:</strong> {formatDate(selectedRecord?.created_at)}</p>
                            <p><strong>Updated At:</strong> {formatDate(selectedRecord?.updated_at)}</p>
                            <p><strong>Created By:</strong> {selectedRecord?.created_by?.name || "N/A"}</p>
                            <p><strong>Updated By:</strong> {selectedRecord?.updated_by?.name || "N/A"}</p>
                        </div>
                    </div>

                    {/* Notification Viewed By Section */}
                    {notificationId && <NotificationViewedBy notificationId={notificationId} />}
                </div>
            </div>
        </Dialog>
    );
};

export default RecordDetailsDialog;