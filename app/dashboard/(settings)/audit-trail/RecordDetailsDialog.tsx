"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";

import moment from "moment";
import dynamic from "next/dynamic";

const ViewMapButtonDialog = dynamic(() => import("./ViewMapButtonDialog"), {
    ssr: false,
});

interface RecordDetailsDialogProps {
    visible: boolean;
    onHide: () => void;
    selectedRecord: any;
}

const formatDate = (date?: string): string =>
    date ? moment(date).format("MMMM Do YYYY") : "N/A";

// All the keys you ALREADY show explicitly
const shownKeys = [
    "ip",
    "country",
    "city",
    "user_agent",
    "created_by",
    "created_by_email",
    "region",
    "latitude",
    "longitude",
    "timezone",
    "device",
    "platform",
    "platform_version",
    "browser",
    "browser_version",
];

const RecordDetailsDialog: React.FC<RecordDetailsDialogProps> = ({
    visible,
    onHide,
    selectedRecord,
}) => {
    console.log("🚀 ~ RecordDetailsDialog ~ selectedRecord:", selectedRecord)
    const properties: Record<string, any> = selectedRecord?.properties || {};

    // Filter only keys not already shown
    const extraProperties = Object.entries(properties).filter(
        ([key]) => !shownKeys.includes(key)
    );

    return (
        <Dialog
            header="Record Details"
            visible={visible}
            style={{ minWidth: "300px" }}
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
                <Avatar icon="pi pi-book" size="xlarge" shape="circle" className="mb-4" />

                <div className="mt-8 w-full max-w-4xl space-y-6 text-sm">
                    {/* Audit Log Information */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                            Audit Log Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <p>
                                <strong>Name:</strong> {selectedRecord?.log_name || "N/A"}
                            </p>
                            <p>
                                <strong>Description:</strong> {selectedRecord?.description || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">Metadata</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <p>
                                <strong>IP Address:</strong> {properties?.ip || "N/A"}
                            </p>
                            <p>
                                <strong>Country:</strong> {properties?.country || "N/A"}
                            </p>
                            <p>
                                <strong>City:</strong> {properties?.city || "N/A"}
                            </p>
                            <p>
                                <strong>User Agent:</strong> {properties?.user_agent || "N/A"}
                            </p>
                            <p>
                                <strong>Causer:</strong> {properties?.created_by || "N/A"}
                            </p>
                            <p>
                                <strong>Causer Email:</strong> {properties?.created_by_email || "N/A"}
                            </p>
                            <p>
                                <strong>Region:</strong> {properties?.region || "N/A"}
                            </p>
                            <p>
                                <strong>Latitude:</strong> {properties?.latitude || "N/A"}
                            </p>
                            <p>
                                <strong>Longitude:</strong> {properties?.longitude || "N/A"}
                            </p>
                            <div className="w-full">
                                <ViewMapButtonDialog
                                    lat={properties?.latitude}
                                    lng={properties?.longitude}
                                />
                            </div>
                            <p>
                                <strong>Timezone:</strong> {properties?.timezone || "N/A"}
                            </p>
                            <p>
                                <strong>Device:</strong> {properties?.device || "N/A"}
                            </p>
                            <p>
                                <strong>Platform:</strong> {properties?.platform || "N/A"}
                            </p>
                            <p>
                                <strong>Platform Version:</strong> {properties?.platform_version || "N/A"}
                            </p>
                            <p>
                                <strong>Browser:</strong> {properties?.browser || "N/A"}
                            </p>
                            <p>
                                <strong>Browser Version:</strong> {properties?.browser_version || "N/A"}
                            </p>
                        </div>
                    </div>
                    {/* Extra Info */}
                    {/* Extra Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">Extra Info</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            {extraProperties.map(([key, value]) => {
                                const isComplex = Array.isArray(value) || (typeof value === "object" && value !== null);
                                return (
                                    <p
                                        key={key}
                                        className={isComplex ? "col-span-1 md:col-span-2 break-words" : ""}
                                    >
                                        <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                                        {value === null || value === ""
                                            ? "N/A"
                                            : isComplex
                                                ? JSON.stringify(value, null, 2)
                                                : value.toString()
                                        }
                                    </p>
                                );
                            })}
                        </div>
                    </div>


                </div>
            </div>
        </Dialog>
    );
};

export default RecordDetailsDialog;
