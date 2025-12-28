// CaptionDialog.tsx
import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Zod schema for caption validation
const captionSchema = z.object({
    caption: z.string().max(500, "Caption must be 500 characters or less"),
});

type CaptionFormData = z.infer<typeof captionSchema>;

interface UploadedFile {
    type: string;
    file?: File;
    previewUrl: string;
    caption?: string;
    status?: string;
    project_attachment_id?: number;
    file_path?: string;
}

interface CaptionDialogProps {
    visible: boolean;
    onHide: () => void;
    file: UploadedFile | null;
    onSave: (caption: string) => void;
    renderPreview: (file: UploadedFile) => React.ReactNode;
}

const CaptionDialog: React.FC<CaptionDialogProps> = ({
    visible,
    onHide,
    file,
    onSave,
    renderPreview,
}) => {
    const { control, handleSubmit, reset } = useForm<CaptionFormData>({
        resolver: zodResolver(captionSchema),
        defaultValues: {
            caption: file?.caption ?? "",
        },
    });

    // Update form values when file changes
    React.useEffect(() => {
        reset({ caption: file?.caption ?? "" });
    }, [file, reset]);

    const saveCaption = (data: CaptionFormData) => {
        onSave(data.caption);
    };

    return (
        <Dialog
            header={file?.caption ? "Edit Caption" : "Add Caption"}
            visible={visible}
            style={{ minWidth: "50vw" }}
            onHide={onHide}
            maximizable
            footer={(
                <div className="flex justify-end gap-2">
                    <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onHide} />
                    <Button label="Save" icon="pi pi-check" className="p-button-primary" onClick={handleSubmit(saveCaption)} />
                </div>
            )}
        >
            {file && (
                <div className="p-4">
                    <div className="mb-4">
                        <p className="font-semibold mb-2">File: {file?.file?.name}</p>
                        <div className="flex justify-center mb-4">
                            {renderPreview(file)}
                        </div>
                    </div>
                    <Controller
                        name="caption"
                        control={control}
                        render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className="block text-gray-700 mb-2">Caption</label>
                                <InputTextarea
                                    id={field.name}
                                    {...field}
                                    rows={5}
                                    cols={30}
                                    className={`w-full ${fieldState.error ? "p-invalid" : ""}`}
                                    placeholder="Enter a caption for this file..."
                                />
                                {fieldState.error && (
                                    <small className="p-error block mt-1">{fieldState.error.message}</small>
                                )}
                                <small className="text-gray-500 block mt-1">
                                    {field.value?.length || 0}/500 characters
                                </small>
                            </>
                        )}
                    />
                </div>
            )}
        </Dialog>
    );
};

export default CaptionDialog;