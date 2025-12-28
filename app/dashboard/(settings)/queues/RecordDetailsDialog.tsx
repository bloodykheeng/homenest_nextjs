"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import moment from "moment";

interface RecordDetailsDialogProps {
    visible: boolean;
    onHide: () => void;
    selectedRecord: any; // Job or FailedJob
    queueType: "jobs" | "failed";
}

const RecordDetailsDialog: React.FC<RecordDetailsDialogProps> = ({
    visible,
    onHide,
    selectedRecord,
    queueType,
}) => {
    const isJob = queueType === "jobs";

    return (
        <Dialog
            header={`${isJob ? "Job" : "Failed Job"} Details`}
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
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">
                            {isJob ? "Job Information" : "Failed Job Information"}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            {isJob ? (
                                <>
                                    <p><strong>Queue:</strong> {selectedRecord?.queue || "N/A"}</p>

                                    <div className="col-span-1 md:col-span-2">
                                        <strong>Payload:</strong>
                                        <pre className="whitespace-pre-wrap break-words p-2 rounded bg-gray-100 dark:bg-gray-800 dark:text-gray-100">
                                            {selectedRecord?.payload || "{}"}
                                        </pre>
                                    </div>



                                    <p><strong>Attempts:</strong> {selectedRecord?.attempts ?? 0}</p>

                                    <p>
                                        <strong>Reserved At:</strong> {selectedRecord?.reserved_at ? moment.unix(selectedRecord.reserved_at).format("YYYY-MM-DD HH:mm:ss") : "N/A"}
                                    </p>

                                    <p>
                                        <strong>Available At:</strong> {selectedRecord?.available_at ? moment.unix(selectedRecord.available_at).format("YYYY-MM-DD HH:mm:ss") : "N/A"}
                                    </p>

                                    <p>
                                        <strong>Created At:</strong> {selectedRecord?.created_at ? moment.unix(selectedRecord.created_at).format("YYYY-MM-DD HH:mm:ss") : "N/A"}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p><strong>UUID:</strong> {selectedRecord?.uuid || "N/A"}</p>
                                    <p><strong>Connection:</strong> {selectedRecord?.connection || "N/A"}</p>
                                    <p><strong>Queue:</strong> {selectedRecord?.queue || "N/A"}</p>

                                    <div className="col-span-1 md:col-span-2">
                                        <strong>Payload:</strong>
                                        <pre className="whitespace-pre-wrap break-words p-2 rounded bg-gray-100 dark:bg-gray-800 dark:text-gray-100">
                                            {selectedRecord?.payload || "{}"}
                                        </pre>
                                    </div>

                                    <div>
                                        <strong>Exception:</strong>
                                        <pre className="whitespace-pre-wrap break-words">{selectedRecord?.exception || "N/A"}</pre>
                                    </div>

                                    <p>
                                        <strong>Failed At:</strong> {selectedRecord?.failed_at ? moment(selectedRecord.failed_at).format("YYYY-MM-DD HH:mm:ss") : "N/A"}
                                    </p>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default RecordDetailsDialog;
