import React, { useState, useRef, useMemo } from "react";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { Button } from "primereact/button";

interface UploadedExcelSheet {
    file?: File;
    fileName: string;
    status: "new" | "existing";
}

interface ExcelSheetPickerProps {
    setValue: any;
    sheet?: UploadedExcelSheet | null;
    existingSheet?: string | null;
    fieldName?: string;
    label?: string;
    onFileSelect?: (file: File | null) => void;
}

const ExcelSheetPicker: React.FC<ExcelSheetPickerProps> = ({
    setValue,
    sheet = null,
    existingSheet = null,
    fieldName = "sheet",
    label = "Excel Sheet",
    onFileSelect,
}) => {
    const initialSheet: UploadedExcelSheet | null = useMemo(() => {
        if (sheet) return sheet;
        if (existingSheet) {
            return {
                fileName: existingSheet,
                status: "existing",
            };
        }
        return null;
    }, [sheet, existingSheet]);

    const [currentSheet, setCurrentSheet] = useState<UploadedExcelSheet | null>(
        initialSheet
    );
    const fileUploadRef = useRef<FileUpload | null>(null);

    const handleFileSelect = (event: FileUploadSelectEvent) => {
        const selectedFiles = event.files as File[];

        if (selectedFiles.length === 0) {
            alert("Please select a valid Excel file.");
            fileUploadRef.current?.clear();
            return;
        }

        const file = selectedFiles[0];

        // Validation: Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            alert("Excel file must be 10MB or smaller.");
            fileUploadRef.current?.clear();
            return;
        }

        // Validate file type
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
        const validExtensions = ["xlsx", "xls", "csv"];

        if (!validExtensions.includes(ext)) {
            alert("Only Excel files (.xlsx, .xls, .csv) are allowed.");
            fileUploadRef.current?.clear();
            return;
        }

        const newSheet: UploadedExcelSheet = {
            file: file,
            fileName: file.name,
            status: "new",
        };

        setCurrentSheet(newSheet);
        setValue(fieldName, newSheet);
        onFileSelect?.(file);

        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
        }
    };

    const removeSheet = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentSheet(null);
        setValue(fieldName, null);
        onFileSelect?.(null);
    };

    return (
        <div className="flex flex-col">
            <label className="font-medium text-gray-700 dark:text-gray-100">
                {label}
            </label>

            {currentSheet && (
                <div className="border rounded p-3 mb-3 bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium flex items-center gap-2">
                            <i className="pi pi-file-excel text-green-600 text-xl"></i>
                            {currentSheet.status === "existing"
                                ? "Current File"
                                : "New File"}
                        </span>
                        <Button
                            icon="pi pi-trash"
                            severity="danger"
                            text
                            rounded
                            onClick={removeSheet}
                            tooltip="Remove file"
                        />
                    </div>

                    <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                        <strong>File:</strong> {currentSheet.fileName}
                        {currentSheet.file && (
                            <div className="text-gray-500 dark:text-gray-400">
                                Size: {(currentSheet.file.size / (1024 * 1024)).toFixed(2)} MB
                            </div>
                        )}
                    </div>
                </div>
            )}

            <FileUpload
                ref={fileUploadRef}
                mode="basic"
                name="excelSheet"
                accept=".xlsx,.xls,.csv"
                maxFileSize={10000000}
                customUpload
                auto
                chooseLabel={currentSheet ? `Change ${label}` : `Upload ${label}`}
                className="w-full"
                onSelect={handleFileSelect}
            />

            <small className="text-gray-500 dark:text-gray-400">
                Maximum file size: 10MB. Supported formats: XLSX, XLS, CSV.
            </small>
        </div>
    );
};

export default ExcelSheetPicker;