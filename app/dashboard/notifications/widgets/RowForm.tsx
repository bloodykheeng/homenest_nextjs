"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import moment from "moment";

import MultipleUserSelectTable from "./MultipleUserSelectTable";

const requireField = (val: any, ctx: z.RefinementCtx, fieldName: string) => {
    if (!!val === false) {
        ctx.addIssue({
            code: "custom",
            message: `${fieldName} is required`,
        });
        return z.NEVER;
    }
    return val;
};

const formSchema = z
    .object({
        title: z
            .string()
            .min(3, "Title must be at least 3 characters")
            .superRefine((val, ctx) => requireField(val, ctx, "Title")),

        description: z.string().optional(),

        link: z.string().url("Please enter a valid URL").nullish().optional(),

        type: z
            .enum(["User", "System", "Promotional", "Order", "Product"])
            .superRefine((val, ctx) => requireField(val, ctx, "Type")),

        status: z
            .enum(["active", "inactive"])
            .superRefine((val, ctx) => requireField(val, ctx, "Status")),

        start_date: z
            .union([z.date(), z.string()])
            .nullable()
            .optional()
            .superRefine((val, ctx) => requireField(val, ctx, "Start Date")),

        end_date: z
            .union([z.date(), z.string()])
            .nullable()
            .optional()
            .superRefine((val, ctx) => requireField(val, ctx, "End Date")),

        target_audience: z
            .enum(["All Users", "Local", "International", "Users"])
            .superRefine((val, ctx) => requireField(val, ctx, "Target Audience")),

        gender: z
            .enum(["Male", "Female", "Both"])
            .superRefine((val, ctx) => requireField(val, ctx, "Gender")),

        users: z
            .array(
                z.object({
                    id: z.number(),
                    name: z.string(),
                    email: z.string().optional(),
                    phone: z.string().optional(),
                    role: z.string().optional(),
                    status: z.string().optional(),
                    gender: z.string().optional(),
                })
            )
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (data.start_date && data.end_date) {
            if (!moment(data.end_date).isSameOrAfter(moment(data.start_date))) {
                ctx.addIssue({
                    code: "custom",
                    message: "End Date must be after or equal to Start Date",
                    path: ["end_date"],
                });
            }
        }

        if (data.target_audience === "Users" && (!data.users || data.users.length === 0)) {
            ctx.addIssue({
                code: "custom",
                message: "Please select at least one user",
                path: ["users"],
            });
        }
    });

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
    title: "",
    description: "",
    link: "",
    type: "User",
    status: "active",
    start_date: null,
    end_date: null,
    target_audience: "All Users",
    gender: "Both",
    users: [],
};

const typeOptions = [
    { label: "User", value: "User" },
    { label: "System", value: "System" },
    { label: "Promotional", value: "Promotional" },
    { label: "Order", value: "Order" },
    { label: "Product", value: "Product" },
];

const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
];

const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Both", value: "Both" },
];

const targetAudienceOptions = [
    { label: "All Users", value: "All Users" },
    { label: "Local", value: "Local" },
    { label: "International", value: "International" },
    { label: "Users", value: "Users" },
];

interface RowFormProps {
    handleFormSubmit: (data: FormData) => any;
    formMutation: any;
    initialData?: FormData;
}

const RowForm: React.FC<RowFormProps> = ({
    handleFormSubmit,
    formMutation,
    initialData = defaultValues,
}) => {
    const {
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState<FormData | null>(null);

    const targetAudience = watch("target_audience");
    const selectedUsers = watch("users") || [];
    const gender = watch("gender");

    const onSubmit = (data: FormData) => {
        setPendingData(data);
        setShowConfirmDialog(true);
    };

    const onConfirmSubmit = (e: any) => {
        e.preventDefault();
        if (pendingData) {
            handleFormSubmit(pendingData);
        }
        setShowConfirmDialog(false);
    };

    const onCancelSubmit = (e?: any) => {
        e?.preventDefault();
        setShowConfirmDialog(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                <Card className="mb-4 p-3">
                    <h3 className="mb-4">Notification Information</h3>

                    <div className="field mb-4">
                        <label htmlFor="title">
                            Title <span style={{ color: "red" }}>*</span>
                        </label>
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    id="title"
                                    {...field}
                                    placeholder="Enter notification title"
                                    className={errors.title ? "p-invalid" : ""}
                                />
                            )}
                        />
                        {errors.title && <small className="p-error">{errors.title.message}</small>}
                    </div>

                    <div className="field mb-4">
                        <label htmlFor="description">Description</label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <InputTextarea
                                    id="description"
                                    {...field}
                                    rows={4}
                                    placeholder="Enter notification description"
                                    className={errors.description ? "p-invalid" : ""}
                                />
                            )}
                        />
                        {errors.description && <small className="p-error">{errors.description.message}</small>}
                    </div>

                    <div className="field mb-4">
                        <label htmlFor="link">Link</label>
                        <Controller
                            name="link"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    id="link"
                                    {...field}
                                    value={field.value ?? ""}
                                    type="url"
                                    placeholder="https://example.com"
                                    className={errors.link ? "p-invalid" : ""}
                                />
                            )}
                        />
                        {errors.link && <small className="p-error">{errors.link.message}</small>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">

                        <div className="field">
                            <label htmlFor="type">
                                Type <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Dropdown
                                        id="type"
                                        {...field}
                                        options={typeOptions}
                                        placeholder="Select type"
                                        className={errors.type ? "p-invalid" : ""}
                                    />
                                )}
                            />
                            {errors.type && <small className="p-error">{errors.type.message}</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="start_date">
                                Start Date <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="start_date"
                                control={control}
                                render={({ field }) => (
                                    <Calendar
                                        id="start_date"
                                        {...field}
                                        value={field.value ? moment(field.value).toDate() : null}
                                        showTime
                                        hourFormat="24"
                                        dateFormat="dd/mm/yy"
                                        hideOnDateTimeSelect={true}
                                        placeholder="Select start date"
                                        showIcon
                                        className={errors.start_date ? "p-invalid" : ""}
                                        showButtonBar
                                    />
                                )}
                            />
                            {errors.start_date && <small className="p-error">{errors.start_date.message}</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="end_date">
                                End Date <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="end_date"
                                control={control}
                                render={({ field }) => (
                                    <Calendar
                                        id="end_date"
                                        {...field}
                                        value={field.value ? moment(field.value).toDate() : null}
                                        showTime
                                        hourFormat="24"
                                        dateFormat="dd/mm/yy"
                                        hideOnDateTimeSelect={true}
                                        placeholder="Select end date"
                                        showIcon
                                        className={errors.end_date ? "p-invalid" : ""}
                                        showButtonBar
                                    />
                                )}
                            />
                            {errors.end_date && <small className="p-error">{errors.end_date.message}</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="status">
                                Status <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Dropdown
                                        id="status"
                                        {...field}
                                        options={statusOptions}
                                        placeholder="Select status"
                                        className={errors.status ? "p-invalid" : ""}
                                    />
                                )}
                            />
                            {errors.status && <small className="p-error">{errors.status.message}</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="gender">
                                Gender <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="gender"
                                control={control}
                                render={({ field }) => (
                                    <Dropdown
                                        id="gender"
                                        {...field}
                                        options={genderOptions}
                                        placeholder="Select gender"
                                        className={errors.gender ? "p-invalid" : ""}
                                    />
                                )}
                            />
                            {errors.gender && <small className="p-error">{errors.gender.message}</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="target_audience">
                                Target Audience <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="target_audience"
                                control={control}
                                render={({ field }) => (
                                    <Dropdown
                                        id="target_audience"
                                        {...field}
                                        options={targetAudienceOptions}
                                        placeholder="Select target audience"
                                        className={errors.target_audience ? "p-invalid" : ""}
                                        onChange={(e) => {
                                            field.onChange(e.value);
                                            if (e.value !== "Users") {
                                                setValue("users", []);
                                            }
                                        }}
                                    />
                                )}
                            />
                            {errors.target_audience && <small className="p-error">{errors.target_audience.message}</small>}
                        </div>

                    </div>

                    {targetAudience === "Users" && (
                        <div className="field mb-4 mt-4">
                            <MultipleUserSelectTable
                                setValue={setValue}
                                selectedUsers={selectedUsers}
                                gender={gender === "Both" ? null : gender}
                                fieldName="users"
                            />
                            {errors.users && <small className="p-error block mt-2">{errors.users.message}</small>}
                        </div>
                    )}
                </Card>

                <div className="flex justify-center gap-3 mt-4 w-full">
                    <Button
                        label={formMutation?.isPending ? "Submitting..." : "Submit Notification"}
                        icon="pi pi-check"
                        type="submit"
                        loading={formMutation?.isPending}
                    />
                </div>
            </form>

            <Dialog
                header="Confirm Submission"
                visible={showConfirmDialog}
                maximizable
                onHide={onCancelSubmit}
                footer={
                    <div>
                        <Button label="Yes" onClick={onConfirmSubmit} />
                        <Button label="No" onClick={onCancelSubmit} className="p-button-secondary" />
                    </div>
                }
            >
                Are you sure you want to submit this notification?
            </Dialog>
        </>
    );
};

export default RowForm;
