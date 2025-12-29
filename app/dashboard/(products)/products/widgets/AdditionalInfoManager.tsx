"use client";

import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

interface AdditionalInfo {
    id?: number;
    key: string;
    value: string;
}

interface AdditionalInfoManagerProps {
    additionalInfo: AdditionalInfo[];
    setAdditionalInfo: (info: AdditionalInfo[]) => void;
}

const AdditionalInfoManager: React.FC<AdditionalInfoManagerProps> = ({
    additionalInfo,
    setAdditionalInfo,
}) => {
    const [showDialog, setShowDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState({ key: "", value: "" });

    const openAddDialog = () => {
        setFormData({ key: "", value: "" });
        setEditMode(false);
        setShowDialog(true);
    };

    const openEditDialog = (rowData: AdditionalInfo, index: number) => {
        setFormData({ key: rowData.key, value: rowData.value });
        setCurrentIndex(index);
        setEditMode(true);
        setShowDialog(true);
    };

    const handleSave = () => {
        if (!formData.key.trim() || !formData.value.trim()) return;

        if (editMode && currentIndex !== null) {
            const updated = [...additionalInfo];
            updated[currentIndex] = { ...updated[currentIndex], ...formData };
            setAdditionalInfo(updated);
        } else {
            setAdditionalInfo([...additionalInfo, formData]);
        }

        setShowDialog(false);
        setFormData({ key: "", value: "" });
    };

    const handleDelete = (index: number) => {
        const updated = additionalInfo.filter((_, i) => i !== index);
        setAdditionalInfo(updated);
    };

    const moveUp = (index: number) => {
        if (index === 0) return;
        const updated = [...additionalInfo];
        [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
        setAdditionalInfo(updated);
    };

    const moveDown = (index: number) => {
        if (index === additionalInfo.length - 1) return;
        const updated = [...additionalInfo];
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
        setAdditionalInfo(updated);
    };

    const actionTemplate = (rowData: AdditionalInfo, options: any) => {
        const index = options.rowIndex;
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-arrow-up"
                    className="p-button-sm p-button-text"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    type="button"
                />
                <Button
                    icon="pi pi-arrow-down"
                    className="p-button-sm p-button-text"
                    onClick={() => moveDown(index)}
                    disabled={index === additionalInfo.length - 1}
                    type="button"
                />
                <Button
                    icon="pi pi-pencil"
                    className="p-button-sm p-button-text p-button-info"
                    onClick={() => openEditDialog(rowData, index)}
                    type="button"
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-sm p-button-text p-button-danger"
                    onClick={() => handleDelete(index)}
                    type="button"
                />
            </div>
        );
    };

    return (
        <div>
            <div className="mb-3">
                <Button
                    label="Add Information"
                    icon="pi pi-plus"
                    onClick={openAddDialog}
                    type="button"
                />
            </div>


            {additionalInfo.length > 0 && (
                <DataTable
                    value={additionalInfo}
                    className="p-datatable-sm"
                    stripedRows
                    cellMemo={false}
                >
                    <Column field="key" header="Key" style={{ width: "30%" }} />
                    <Column field="value" header="Value" style={{ width: "50%" }} />
                    <Column
                        body={actionTemplate}
                        header="Actions"
                        style={{ width: "20%" }}
                    />
                </DataTable>
            )}

            <Dialog
                header={editMode ? "Edit Information" : "Add Information"}
                visible={showDialog}
                style={{ width: "30vw" }}
                onHide={() => setShowDialog(false)}
                footer={
                    <div>
                        <Button
                            label="Cancel"
                            onClick={() => setShowDialog(false)}
                            className="p-button-text"
                            type="button"
                        />
                        <Button
                            label="Save"
                            onClick={handleSave}
                            disabled={!formData.key.trim() || !formData.value.trim()}
                            type="button"
                        />
                    </div>
                }
            >
                <div className="grid gap-4">
                    <div>
                        <label className="block mb-2">
                            Key <span className="text-red-500">*</span>
                        </label>
                        <InputText
                            value={formData.key}
                            onChange={(e) =>
                                setFormData({ ...formData, key: e.target.value })
                            }
                            placeholder="e.g., Material, Weight"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">
                            Value <span className="text-red-500">*</span>
                        </label>
                        <InputTextarea
                            value={formData.value}
                            onChange={(e) =>
                                setFormData({ ...formData, value: e.target.value })
                            }
                            placeholder="e.g., 100% Cotton, 200g"
                            className="w-full"
                            rows={3}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default AdditionalInfoManager;