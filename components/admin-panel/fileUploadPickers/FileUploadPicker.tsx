import React, { useState, useRef, useMemo, useEffect, MouseEvent } from "react";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { Image } from "primereact/image";
import { Dialog } from "primereact/dialog";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import InlineExpandableText from "@/components/helpers/InlineExpandableText";

import CaptionDialog from "./CaptionDialog";

interface UploadedFile {
    type: string;
    file?: File;
    previewUrl: string;
    caption?: string;
    status?: string;
    existing_attachment_id?: number;
    file_path?: string;
}

// status is 'new' | 'existing'

interface existingAttachment {
    id?: number;
    project_id?: number | null;
    type: string;
    file_path: string;
    caption?: string | null;
    created_by?: number | null;
    updated_by?: number | null;
}

const FileUploadPicker: React.FC<{ setValue: any, attachments: UploadedFile[], allowedTypes?: string[]; }> = ({ setValue, attachments = [], allowedTypes = ["Picture", "Video", "Audio", "Document"], }) => {

    const [files, setFiles] = useState<UploadedFile[]>(attachments);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [showTypeDialog, setShowTypeDialog] = useState(false);
    const [showUpload, setShowUpload] = useState(false); // Controls upload button visibility
    const primeReactToast = usePrimeReactToast();
    const fileUploadRef = useRef<FileUpload | null>(null); // Create a ref for FileUpload

    const memorisedAttachments = useMemo(() => attachments, [attachments])

    useEffect(() => {
        setFiles(attachments || []);
    }, [memorisedAttachments]);





    // File type filters
    // const fileTypeFilters: Record<string, string> = {
    //     Picture: "image/*",
    //     Video: "video/*",
    //     Audio: "audio/*",
    //     Document: "application/pdf, application/msword, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain ",
    // };

    const fileTypeFilters: Record<string, string> = {
        Picture: ".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp",
        Video: ".mp4,.webm,.ogg",
        Audio: ".mp3,.wav,.ogg,.m4a,.aac,.flac,.wma",
        Document: "application/pdf, application/msword, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain ",
    };

    // Handle file selection
    const handleFileSelect = (event: FileUploadSelectEvent) => {
        if (!selectedType) return;

        const selectedFiles = event.files as File[];

        // Validation: Check total file count
        if (files.length + selectedFiles.length > 5) {
            primeReactToast.error("Error", "You can only upload up to 5 files.");
            return;
        }

        // Validate file sizes (5MB limit)
        const oversizedFiles = selectedFiles.filter((file) => file.size > 20 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            primeReactToast.error("Error", "Each file must be 20MB or smaller.");
            return;
        }

        // Process valid files
        const newFiles = selectedFiles.map((file) => ({
            type: selectedType,
            file,
            previewUrl: URL.createObjectURL(file),
            status: 'new'
        }));

        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        setValue("attachments", updatedFiles); // Send to form


        // Clear FileUpload input after selection
        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
        }
    };

    // Remove file
    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        setValue("attachments", newFiles);
    };

    // Cancel selection and show "Add Attachment" again
    const handleCancel = (e: any) => {
        e.preventDefault();
        setSelectedType(null);
        setShowUpload(false);
    };


    // ============================  captions ===============================
    const [showCaptionDialog, setShowCaptionDialog] = useState(false);
    const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);

    // Open caption dialog
    const openCaptionDialog = (index: number) => {
        setCurrentFileIndex(index);
        setShowCaptionDialog(true);
    };

    // Save caption
    const saveCaption = (caption: string) => {
        if (currentFileIndex !== null) {
            const updatedFiles = [...files];
            updatedFiles[currentFileIndex] = {
                ...updatedFiles[currentFileIndex],
                caption: caption,
            };
            setFiles(updatedFiles);
            setValue("attachments", updatedFiles);
            setShowCaptionDialog(false);
            primeReactToast.success("Success", "Caption saved successfully");
        }
    };


    return (<>
        <div className="w-full">
            {/* Add Attachments Button (Only visible when no attachment is selected) */}
            {!showUpload && (
                <Button
                    label="Add Attachment"
                    icon="pi pi-paperclip"
                    className="p-button-primary"
                    onClick={(e) => {
                        e.preventDefault()
                        // setShowTypeDialog(true)
                        setShowUpload(true)
                    }}
                />
            )}


            {/* Inline Attachment Type Selection (Visible when adding an attachment) */}
            {/* {showUpload && (
                <div className="mt-3">
                    <h5>Select Attachment Type</h5>
                    <div className="grid items-center">
                        {Object.keys(fileTypeFilters).map((type) => (
                            <div key={type} className="col-span-12 m-1 flex items-center">
                                <RadioButton
                                    inputId={type}
                                    name="attachmentType"
                                    value={type}
                                    onChange={(e) => setSelectedType(e.value)}
                                    checked={selectedType === type}
                                />
                                <label htmlFor={type} className="ml-2 text-gray-700">{type}</label>
                            </div>
                        ))}
                    </div>
                </div>
            )} */}

            {showUpload && (
                <div className="mt-3">
                    <h5>Select Attachment Type</h5>
                    <div className="grid items-center">
                        {Object.keys(fileTypeFilters)
                            .filter((type) => allowedTypes.includes(type))
                            .map((type) => (
                                <div key={type} className="col-span-12 m-1 flex items-center">
                                    <RadioButton
                                        inputId={type}
                                        name="attachmentType"
                                        value={type}
                                        onChange={(e) => setSelectedType(e.value)}
                                        checked={selectedType === type}
                                    />
                                    <label htmlFor={type} className="ml-2 text-gray-700">{type}</label>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* File Upload Component (Only visible when an attachment type is selected) */}
            {showUpload && selectedType && (
                <div className="m-2 flex flex-wrap gap-2 items-center justify-end">
                    <FileUpload
                        ref={fileUploadRef} // Attach ref to FileUpload
                        mode="basic"
                        name="files"
                        accept={fileTypeFilters[selectedType]}
                        customUpload
                        chooseLabel={`Upload ${selectedType}`}
                        uploadLabel="Upload"
                        cancelLabel="Cancel"
                        multiple
                        onSelect={handleFileSelect}
                    />

                    <Button
                        icon="pi pi-times"
                        rounded
                        text
                        raised
                        severity="danger"
                        aria-label="Cancel"
                        onClick={handleCancel}
                    />
                </div>
            )}

            {/* DataTable to display selected files */}
            <DataTable value={files} className="mt-3 w-full" responsiveLayout="scroll">
                <Column field="type" header="Type"></Column>
                <Column header="Preview" body={(rowData) => renderPreview(rowData)} />
                <Column
                    field="file.name"
                    header="File Name"
                    body={(rowData) => {
                        const maxLength = 10;
                        const textToDisplay =
                            rowData?.status === "existing"
                                ? rowData?.file_path?.substring(rowData?.file_path?.lastIndexOf("/") + 1).toLowerCase()
                                : rowData?.file?.name ?? "N/A";

                        return <InlineExpandableText text={textToDisplay} maxLength={maxLength} />;
                    }}
                />

                <Column
                    field="caption"
                    header="Caption"
                    body={(rowData) => {
                        const maxLength = 20;
                        const textToDisplay = rowData?.caption ?? "No caption";

                        return <InlineExpandableText text={textToDisplay} maxLength={maxLength} />;
                    }}
                />

                {/* <Column field="status" header="Status" /> */}
                <Column
                    header="Actions"
                    body={(rowData, { rowIndex }) => (
                        <div className="flex gap-2">
                            <Button
                                icon={`pi ${rowData.caption ? "pi-pencil" : "pi-plus"}`}
                                severity="secondary"
                                tooltip={rowData.caption ? "Edit Caption" : "Add Caption"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    openCaptionDialog(rowIndex)
                                }}
                            />
                            <Button
                                icon="pi pi-trash"
                                className="p-button-danger"
                                onClick={(e) => {
                                    e.preventDefault();
                                    removeFile(rowIndex);
                                }}
                            />
                        </div>
                    )}
                />
            </DataTable>
        </div>

        {/* Caption Dialog Component */}
        <CaptionDialog
            visible={showCaptionDialog}
            onHide={() => setShowCaptionDialog(false)}
            file={currentFileIndex !== null ? files[currentFileIndex] : null}
            onSave={saveCaption}
            renderPreview={renderPreview}
        />

        {/* Attachment Type Selection Modal */}
        {/* <Dialog
            header="Select Attachment Type"
            visible={showTypeDialog}
            maximizable
            onHide={() => setShowTypeDialog(false)}
        >
            <div className="p-grid p-ai-center">
                {Object.keys(fileTypeFilters).map((type) => (
                    <div key={type} className="p-col-12 m-1 p-d-flex p-ai-center">
                        <RadioButton
                            inputId={type}
                            name="attachmentType"
                            value={type}
                            onChange={(e) => setSelectedType(e.value)}
                            checked={selectedType === type}
                        />
                        <label htmlFor={type} className="p-ml-2">{type}</label>
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap gap-3 m-3 p-jc-between p-m-3">
                <Button
                    label="Cancel"
                    className="p-button-secondary"
                    onClick={handleCancel}
                />
                <Button
                    label="Confirm"
                    className="p-button-success"
                    disabled={!selectedType}
                    onClick={() => {
                        setShowTypeDialog(false);
                        setShowUpload(true);
                    }}
                />
            </div>
        </Dialog> */}
    </>
    );
};

// Render file preview
const renderPreview = (rowData: UploadedFile) => {
    const { file, previewUrl, status, type } = rowData;
    const fileType = status === "existing" ? type?.toLowerCase() : file?.type?.toLowerCase();
    const fileName = file?.name;
    const fileExtension = fileName?.substring(fileName?.lastIndexOf(".") + 1).toLowerCase();

    const getFileName = (name: string) => name.split("/").pop();

    // Check if it's an image
    if (fileType?.startsWith("image/") || fileType?.startsWith("picture")) {
        return <Image src={previewUrl} alt={fileName} width="50" preview />;
    }

    // Check if it's a video
    if (fileType?.startsWith("video")) {
        return (
            <video width="320" height="240" controls>
                <source src={previewUrl} type={fileType} />
                Your browser does not support video playback.
            </video>
        );
    }

    // Check if it's an audio file
    if (fileType?.startsWith("audio")) {
        return (
            <audio controls>
                <source src={previewUrl} type={fileType} />
                Your browser does not support audio playback.
            </audio>
        );
    }

    // Check if it's a document (PDF)
    if (fileType === "application/pdf" || fileExtension === "pdf" || fileType === "document") {
        return (
            <a href={previewUrl} target="_blank" rel="noopener noreferrer" download>
                <Button type="button" label={getFileName(fileName ?? "")} icon="pi pi-file-pdf" />
            </a>
        );
    }

    // Default: File Download for other types
    return (
        <a href={previewUrl} download>
            <Button type="button" label={getFileName(fileName ?? "")} icon="pi pi-download" />
        </a>
    );
};


export default FileUploadPicker;
