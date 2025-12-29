// components/admin-panel/products/ColorManager.tsx
"use client";

import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ColorPicker } from "primereact/colorpicker";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";

interface Color {
    id?: number;
    color_name: string;
    color_code: string;
}

interface ColorManagerProps {
    colors: Color[];
    setColors: (colors: Color[]) => void;
}

const ColorManager: React.FC<ColorManagerProps> = ({
    colors,
    setColors,
}) => {
    const [showDialog, setShowDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState({ color_name: "", color_code: "" });
    const primeReactToast = usePrimeReactToast();

    const openAddDialog = () => {
        setFormData({ color_name: "", color_code: "" });
        setEditMode(false);
        setCurrentIndex(null);
        setShowDialog(true);
    };

    const openEditDialog = (rowData: Color, index: number) => {
        setFormData({ color_name: rowData.color_name, color_code: rowData.color_code });
        setCurrentIndex(index);
        setEditMode(true);
        setShowDialog(true);
    };

    const handleSave = () => {
        if (!formData.color_name.trim()) {
            primeReactToast.error("Error", "Color name is required");
            return;
        }
        if (!formData.color_code.trim()) {
            primeReactToast.error("Error", "Color code is required");
            return;
        }

        // Ensure color code has #
        const colorCode = formData.color_code.startsWith('#')
            ? formData.color_code
            : `#${formData.color_code}`;

        if (editMode && currentIndex !== null) {
            const updated = [...colors];
            updated[currentIndex] = {
                ...updated[currentIndex],
                color_name: formData.color_name.trim(),
                color_code: colorCode
            };
            setColors(updated);
            primeReactToast.success("Success", "Color updated successfully");
        } else {
            setColors([...colors, {
                color_name: formData.color_name.trim(),
                color_code: colorCode
            }]);
            primeReactToast.success("Success", "Color added successfully");
        }

        setShowDialog(false);
        setFormData({ color_name: "", color_code: "" });
        setCurrentIndex(null);
    };

    const handleDelete = (index: number) => {
        const updated = [...colors];
        updated.splice(index, 1);
        setColors(updated);
        primeReactToast.success("Success", "Color deleted successfully");
    };

    const moveUp = (index: number) => {
        if (index === 0) return;
        const updated = [...colors];
        [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
        setColors(updated);
    };

    const moveDown = (index: number) => {
        if (index === colors.length - 1) return;
        const updated = [...colors];
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
        setColors(updated);
    };

    const colorPreviewTemplate = (rowData: Color) => {
        return (
            <div className="flex items-center gap-2">
                <div
                    className="w-8 h-8 rounded border-2"
                    style={{ backgroundColor: rowData.color_code }}
                />
                <span>{rowData.color_code}</span>
            </div>
        );
    };

    const actionTemplate = (rowData: Color, options: any) => {
        const index = options.rowIndex;
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-arrow-up"
                    className="p-button-sm p-button-text"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    tooltip="Move Up"
                    type="button"
                />
                <Button
                    icon="pi pi-arrow-down"
                    className="p-button-sm p-button-text"
                    onClick={() => moveDown(index)}
                    disabled={index === colors.length - 1}
                    tooltip="Move Down"
                    type="button"
                />
                <Button
                    icon="pi pi-pencil"
                    className="p-button-sm p-button-text p-button-info"
                    onClick={() => openEditDialog(rowData, index)}
                    tooltip="Edit"
                    type="button"
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-sm p-button-text p-button-danger"
                    onClick={() => handleDelete(index)}
                    tooltip="Delete"
                    type="button"
                />
            </div>
        );
    };

    return (
        <div>
            <div className="mb-3">
                <Button
                    label="Add Color"
                    icon="pi pi-plus"
                    onClick={openAddDialog}
                    type="button"
                />
            </div>


            {colors.length > 0 && (
                <DataTable
                    value={colors}
                    className="p-datatable-sm"
                    stripedRows
                    cellMemo={false}
                >
                    <Column field="color_name" header="Color Name" style={{ width: "30%" }} />
                    <Column
                        header="Color Preview"
                        body={colorPreviewTemplate}
                        style={{ width: "40%" }}
                    />
                    <Column
                        body={actionTemplate}
                        header="Actions"
                        style={{ width: "30%" }}
                    />
                </DataTable>
            )}

            <Dialog
                header={editMode ? "Edit Color" : "Add Color"}
                visible={showDialog}
                style={{ width: "30vw" }}
                onHide={() => {
                    setShowDialog(false);
                    setFormData({ color_name: "", color_code: "" });
                    setCurrentIndex(null);
                }}
                footer={
                    <div>
                        <Button
                            label="Cancel"
                            onClick={() => {
                                setShowDialog(false);
                                setFormData({ color_name: "", color_code: "" });
                                setCurrentIndex(null);
                            }}
                            className="p-button-text"
                        />
                        <Button
                            label="Save"
                            onClick={handleSave}
                        />
                    </div>
                }
            >
                <div className="grid gap-4">
                    <div>
                        <label className="block mb-2">
                            Color Name <span className="text-red-500">*</span>
                        </label>
                        <InputText
                            value={formData.color_name}
                            onChange={(e) =>
                                setFormData({ ...formData, color_name: e.target.value })
                            }
                            placeholder="e.g., Red, Blue, Navy"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">
                            Color Code <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2 items-center mb-2">
                            <InputText
                                value={formData.color_code}
                                onChange={(e) =>
                                    setFormData({ ...formData, color_code: e.target.value })
                                }
                                placeholder="#FF0000"
                                className="flex-1"
                            />
                            {formData.color_code && (
                                <div
                                    className="w-10 h-10 rounded border-2"
                                    style={{
                                        backgroundColor: formData.color_code.startsWith('#')
                                            ? formData.color_code
                                            : `#${formData.color_code}`
                                    }}
                                />
                            )}
                        </div>
                        <ColorPicker
                            value={formData.color_code.replace('#', '')}
                            onChange={(e) =>
                                setFormData({ ...formData, color_code: e.value as string })
                            }
                            inline
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default ColorManager;