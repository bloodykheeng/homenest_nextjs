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
import { MultiSelect } from "primereact/multiselect";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";

import { getAllCsos } from "@/services/csos/csos-service";
import { getAllOversightInstitutions } from "@/services/oversight-institutions/oversight-institutions-service";
import { getAllStates } from "@/services/locations/states-service";
import { getAllRegions } from "@/services/locations/regions-service";
import { getAllDistricts } from "@/services/locations/districts-service";
import { getAllWards } from "@/services/locations/wards-service";
import { getAllVillages } from "@/services/locations/villages-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";

import MultipleUserSelectTable from "./MultipleUserSelectTable";

const requireField = (val: any, ctx: z.RefinementCtx, fieldName: string) => {
    if (!!val === false) {
        ctx.addIssue({
            code: 'custom',
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

        type: z
            .enum(["User", "System"])
            .superRefine((val, ctx) => requireField(val, ctx, "Type")),

        status: z
            .enum(["active", "inactive"])
            .superRefine((val, ctx) => requireField(val, ctx, "Status")),

        start_date: z
            // .coerce
            // .date()
            .union([z.date(), z.string()])
            .nullable()
            .optional()
            .superRefine((val, ctx) => requireField(val, ctx, "Start Date")),

        end_date: z
            // .coerce
            // .date()
            .union([z.date(), z.string()])
            .nullable()
            .optional()
            .superRefine((val, ctx) => requireField(val, ctx, "End Date")),

        target_audience: z
            .enum(["All Users", "CSOs", "Oversight Institutions", "Geographical", "Users"])
            .superRefine((val, ctx) => requireField(val, ctx, "Target Audience")),

        gender: z
            .enum(["Male", "Female", "Both"])
            .superRefine((val, ctx) => requireField(val, ctx, "Gender")),

        scope: z
            .enum(["States", "Regions", "Districts", "Wards", "Villages"])
            .nullable()
            .optional(),

        // CSOs and Oversight Institutions
        csos: z.array(z.object({ id: z.number(), name: z.string() }).passthrough()).optional(),
        oversight_institutions: z.array(z.object({ id: z.number(), name: z.string() }).passthrough()).optional(),

        // Geographical selections
        states: z.array(z.object({ id: z.number(), name: z.string() }).passthrough()).optional(),
        regions: z.array(z.object({ id: z.number(), name: z.string() }).passthrough()).optional(),
        districts: z.array(z.object({ id: z.number(), name: z.string() }).passthrough()).optional(),
        wards: z.array(z.object({ id: z.number(), name: z.string() }).passthrough()).optional(),
        villages: z.array(z.object({ id: z.number(), name: z.string() }).passthrough()).optional(),

        // Users selection
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
        // Validate end date is after or equal to start date
        if (data.start_date && data.end_date) {
            if (!moment(data.end_date).isSameOrAfter(moment(data.start_date))) {
                ctx.addIssue({
                    code: 'custom',
                    message: "End Date must be after or equal to Start Date",
                    path: ["end_date"],
                });
            }
        }

        // Validate scope is required when target is Geographical
        if (data.target_audience === "Geographical" && !data.scope) {
            ctx.addIssue({
                code: 'custom',
                message: "Scope is required when target audience is Geographical",
                path: ["scope"],
            });
        }

        // Validate CSOs when target is CSOs
        if (data.target_audience === "CSOs" && (!data.csos || data.csos.length === 0)) {
            ctx.addIssue({
                code: 'custom',
                message: "Please select at least one CSO",
                path: ["csos"],
            });
        }

        // Validate Oversight Institutions when target is Oversight Institutions
        if (data.target_audience === "Oversight Institutions" && (!data.oversight_institutions || data.oversight_institutions.length === 0)) {
            ctx.addIssue({
                code: 'custom',
                message: "Please select at least one oversight institution",
                path: ["oversight_institutions"],
            });
        }

        // Validate geographical selections based on scope
        if (data.target_audience === "Geographical" && data.scope) {
            if (["States", "Regions", "Districts", "Wards", "Villages"].includes(data.scope) && (!data.states || data.states.length === 0)) {
                ctx.addIssue({
                    code: 'custom',
                    message: "Please select at least one state",
                    path: ["states"],
                });
            }

            if (["Regions", "Districts", "Wards", "Villages"].includes(data.scope) && (!data.regions || data.regions.length === 0)) {
                ctx.addIssue({
                    code: 'custom',
                    message: "Please select at least one region",
                    path: ["regions"],
                });
            }

            if (["Districts", "Wards", "Villages"].includes(data.scope) && (!data.districts || data.districts.length === 0)) {
                ctx.addIssue({
                    code: 'custom',
                    message: "Please select at least one district",
                    path: ["districts"],
                });
            }

            if (["Wards", "Villages"].includes(data.scope) && (!data.wards || data.wards.length === 0)) {
                ctx.addIssue({
                    code: 'custom',
                    message: "Please select at least one ward",
                    path: ["wards"],
                });
            }

            if (data.scope === "Villages" && (!data.villages || data.villages.length === 0)) {
                ctx.addIssue({
                    code: 'custom',
                    message: "Please select at least one village",
                    path: ["villages"],
                });
            }
        }

        // Validate users when target is Users
        if (data.target_audience === "Users" && (!data.users || data.users.length === 0)) {
            ctx.addIssue({
                code: 'custom',
                message: "Please select at least one user",
                path: ["users"],
            });
        }
    });

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
    title: "",
    description: "",
    type: "User",
    status: "active",
    start_date: null,
    end_date: null,
    target_audience: "All Users",
    gender: "Both",
    scope: null,
    csos: [],
    oversight_institutions: [],
    states: [],
    regions: [],
    districts: [],
    wards: [],
    villages: [],
    users: [],
};

const typeOptions = [
    { label: "User", value: "User" },
    { label: "System", value: "System" },
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
    { label: "CSOs", value: "CSOs" },
    { label: "Oversight Institutions", value: "Oversight Institutions" },
    { label: "Geographical", value: "Geographical" },
    { label: "Users", value: "Users" },
];

const scopeOptions = [
    { label: "States", value: "States" },
    { label: "Regions", value: "Regions" },
    { label: "Districts", value: "Districts" },
    { label: "Wards", value: "Wards" },
    { label: "Villages", value: "Villages" },
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
    const scope = watch("scope");
    const selectedStates = watch("states") || [];
    const selectedRegions = watch("regions") || [];
    const selectedDistricts = watch("districts") || [];
    const selectedWards = watch("wards") || [];
    const selectedUsers = watch("users") || [];
    const gender = watch("gender");

    // Queries
    const getAllCsosQuery = useQuery({
        queryKey: ["csos"],
        queryFn: getAllCsos,
        enabled: targetAudience === "CSOs",
    });

    const getAllOversightInstitutionsQuery = useQuery({
        queryKey: ["oversight_institutions"],
        queryFn: getAllOversightInstitutions,
        enabled: targetAudience === "Oversight Institutions",
    });

    const getAllStatesQuery = useQuery({
        queryKey: ["states"],
        queryFn: getAllStates,
        enabled: !!(targetAudience === "Geographical" && scope && ["States", "Regions", "Districts", "Wards", "Villages"].includes(scope)),
    });

    const stateIds = selectedStates.map((s) => s.id);
    const getAllRegionsQuery = useQuery({
        queryKey: ["regions", stateIds],
        queryFn: () => getAllRegions({ state_ids: stateIds }),
        enabled: !!(targetAudience === "Geographical" && scope && ["Regions", "Districts", "Wards", "Villages"].includes(scope) && stateIds.length > 0),
    });

    const regionIds = selectedRegions.map((r) => r.id);
    const getAllDistrictsQuery = useQuery({
        queryKey: ["districts", regionIds],
        queryFn: () => getAllDistricts({ region_ids: regionIds }),
        enabled: !!(targetAudience === "Geographical" && scope && ["Districts", "Wards", "Villages"].includes(scope) && regionIds.length > 0),
    });

    const districtIds = selectedDistricts.map((d) => d.id);
    const getAllWardsQuery = useQuery({
        queryKey: ["wards", districtIds],
        queryFn: () => getAllWards({ district_ids: districtIds }),
        enabled: !!(targetAudience === "Geographical" && scope && ["Wards", "Villages"].includes(scope) && districtIds.length > 0),
    });

    const wardIds = selectedWards.map((w) => w.id);
    const getAllVillagesQuery = useQuery({
        queryKey: ["villages", wardIds],
        queryFn: () => getAllVillages({ ward_ids: wardIds }),
        enabled: !!(targetAudience === "Geographical" && scope === "Villages" && wardIds.length > 0),
    });

    useHandleQueryError(getAllCsosQuery);
    useHandleQueryError(getAllOversightInstitutionsQuery);
    useHandleQueryError(getAllStatesQuery);
    useHandleQueryError(getAllRegionsQuery);
    useHandleQueryError(getAllDistrictsQuery);
    useHandleQueryError(getAllWardsQuery);
    useHandleQueryError(getAllVillagesQuery);

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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">

                        {/* <div className="field">
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
                        </div> */}





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
                                            if (e.value !== "Geographical") {
                                                setValue("scope", null);
                                                setValue("states", []);
                                                setValue("regions", []);
                                                setValue("districts", []);
                                                setValue("wards", []);
                                                setValue("villages", []);
                                            }
                                            if (e.value !== "CSOs") {
                                                setValue("csos", []);
                                            }
                                            if (e.value !== "Oversight Institutions") {
                                                setValue("oversight_institutions", []);
                                            }
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

                    {targetAudience === "Geographical" && (
                        <div className="field mb-4">
                            <label htmlFor="scope">
                                Scope <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="scope"
                                control={control}
                                render={({ field }) => (
                                    <Dropdown
                                        id="scope"
                                        {...field}
                                        options={scopeOptions}
                                        placeholder="Select scope"
                                        className={errors.scope ? "p-invalid" : ""}
                                        onChange={(e) => {
                                            field.onChange(e.value);
                                            if (!["States", "Regions", "Districts", "Wards", "Villages"].includes(e.value)) setValue("states", []);
                                            if (!["Regions", "Districts", "Wards", "Villages"].includes(e.value)) setValue("regions", []);
                                            if (!["Districts", "Wards", "Villages"].includes(e.value)) setValue("districts", []);
                                            if (!["Wards", "Villages"].includes(e.value)) setValue("wards", []);
                                            if (e.value !== "Villages") setValue("villages", []);
                                        }}
                                    />
                                )}
                            />
                            {errors.scope && <small className="p-error">{errors.scope.message}</small>}
                        </div>
                    )}

                    {targetAudience === "CSOs" && (
                        <div className="field mb-4">
                            <label htmlFor="csos">
                                CSOs <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="csos"
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        id="csos"
                                        {...field}
                                        options={getAllCsosQuery?.data?.data?.data || []}
                                        optionLabel="name"
                                        placeholder="Select CSOs"
                                        filter
                                        loading={getAllCsosQuery.isLoading}
                                        className={errors.csos ? "p-invalid" : ""}
                                    />
                                )}
                            />
                            {errors.csos && <small className="p-error">{errors.csos.message}</small>}
                        </div>
                    )}

                    {targetAudience === "Oversight Institutions" && (
                        <div className="field mb-4">
                            <label htmlFor="oversight_institutions">
                                Oversight Institutions <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="oversight_institutions"
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        id="oversight_institutions"
                                        {...field}
                                        options={getAllOversightInstitutionsQuery?.data?.data?.data || []}
                                        optionLabel="name"
                                        placeholder="Select oversight institutions"
                                        filter
                                        loading={getAllOversightInstitutionsQuery.isLoading}
                                        className={errors.oversight_institutions ? "p-invalid" : ""}
                                    />
                                )}
                            />
                            {errors.oversight_institutions && <small className="p-error">{errors.oversight_institutions.message}</small>}
                        </div>
                    )}

                    {targetAudience === "Geographical" && scope && ["States", "Regions", "Districts", "Wards", "Villages"].includes(scope) && (
                        <div className="field mb-4">
                            <label htmlFor="states">
                                States <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="states"
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        id="states"
                                        {...field}
                                        options={getAllStatesQuery?.data?.data?.data || []}
                                        optionLabel="name"
                                        placeholder="Select states"
                                        filter
                                        loading={getAllStatesQuery.isLoading}
                                        className={errors.states ? "p-invalid" : ""}
                                        onChange={(e) => {
                                            field.onChange(e.value);
                                            setValue("regions", []);
                                            setValue("districts", []);
                                            setValue("wards", []);
                                            setValue("villages", []);
                                        }}
                                    />
                                )}
                            />
                            {errors.states && <small className="p-error">{errors.states.message}</small>}
                        </div>
                    )}

                    {targetAudience === "Geographical" && scope && ["Regions", "Districts", "Wards", "Villages"].includes(scope) && (
                        <div className="field mb-4">
                            <label htmlFor="regions">
                                Regions <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="regions"
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        id="regions"
                                        {...field}
                                        options={getAllRegionsQuery?.data?.data?.data || []}
                                        optionLabel="name"
                                        placeholder="Select regions"
                                        filter
                                        loading={getAllRegionsQuery.isLoading}
                                        disabled={selectedStates.length === 0}
                                        className={errors.regions ? "p-invalid" : ""}
                                        onChange={(e) => {
                                            field.onChange(e.value);
                                            setValue("districts", []);
                                            setValue("wards", []);
                                            setValue("villages", []);
                                        }}
                                    />
                                )}
                            />
                            {errors.regions && <small className="p-error">{errors.regions.message}</small>}
                        </div>
                    )}

                    {targetAudience === "Geographical" && scope && ["Districts", "Wards", "Villages"].includes(scope) && (
                        <div className="field mb-4">
                            <label htmlFor="districts">
                                Districts <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="districts"
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        id="districts"
                                        {...field}
                                        options={getAllDistrictsQuery?.data?.data?.data || []}
                                        optionLabel="name"
                                        placeholder="Select districts"
                                        filter
                                        loading={getAllDistrictsQuery.isLoading}
                                        disabled={selectedRegions.length === 0}
                                        className={errors.districts ? "p-invalid" : ""}
                                        onChange={(e) => {
                                            field.onChange(e.value);
                                            setValue("wards", []);
                                            setValue("villages", []);
                                        }}
                                    />
                                )}
                            />
                            {errors.districts && <small className="p-error">{errors.districts.message}</small>}
                        </div>
                    )}

                    {targetAudience === "Geographical" && scope && ["Wards", "Villages"].includes(scope) && (
                        <div className="field mb-4">
                            <label htmlFor="wards">
                                Wards <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="wards"
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        id="wards"
                                        {...field}
                                        options={getAllWardsQuery?.data?.data?.data || []}
                                        optionLabel="name"
                                        placeholder="Select wards"
                                        filter
                                        loading={getAllWardsQuery.isLoading}
                                        disabled={selectedDistricts.length === 0}
                                        className={errors.wards ? "p-invalid" : ""}
                                        onChange={(e) => {
                                            field.onChange(e.value);
                                            setValue("villages", []);
                                        }}
                                    />
                                )}
                            />
                            {errors.wards && <small className="p-error">{errors.wards.message}</small>}
                        </div>
                    )}

                    {targetAudience === "Geographical" && scope === "Villages" && (
                        <div className="field mb-4">
                            <label htmlFor="villages">
                                Villages <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="villages"
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        id="villages"
                                        {...field}
                                        options={getAllVillagesQuery?.data?.data?.data || []}
                                        optionLabel="name"
                                        placeholder="Select villages"
                                        filter
                                        loading={getAllVillagesQuery.isLoading}
                                        disabled={selectedWards.length === 0}
                                        className={errors.villages ? "p-invalid" : ""}
                                    />
                                )}
                            />
                            {errors.villages && <small className="p-error">{errors.villages.message}</small>}
                        </div>
                    )}

                    {targetAudience === "Users" && (
                        <div className="field mb-4">
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