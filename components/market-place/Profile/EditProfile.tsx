"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputSwitch } from "primereact/inputswitch";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import useAuthContext from "@/providers/AuthProvider";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";
import PhotoUploadPicker from "@/components/admin-panel/fileUploadPickers/PhotoUploadPicker";
import { updateUserProfile } from "@/services/auth/profile-service";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    username: z.string().min(3, "Username must be at least 3 characters").max(30).optional().or(z.literal("")),
    phone: z.string().nullish(),
    gender: z.enum(["Male", "Female", "Prefer not to say"]).nullable().optional(),
    citizenship: z.string().max(100).optional().or(z.literal("")),
    city: z.string().max(100).optional().or(z.literal("")),
    address: z.string().max(500).optional().or(z.literal("")),
    postal_code: z.string().max(20).optional().or(z.literal("")),
    allow_notifications: z.boolean().optional(),
    current_password: z.string().min(1, "Current password is required to save changes"),
    new_password: z.string().optional().or(z.literal("")),
    photo: z
        .object({
            file: z.instanceof(File).optional(),
            previewUrl: z.string(),
            status: z.enum(["new", "existing"]),
        })
        .nullish()
        .optional(),
    photo_url: z.string().nullish().optional(),
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
    name: "",
    email: "",
    username: "",
    phone: "",
    gender: undefined,
    citizenship: "",
    city: "",
    address: "",
    postal_code: "",
    allow_notifications: true,
    current_password: "",
    new_password: "",
    photo: undefined,
    photo_url: undefined,
};

const EditProfilePage = () => {
    const { getUserQuery } = useAuthContext();
    const user = getUserQuery?.data?.data;
    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();

    const sanitizeUser = (u: any): FormData => ({
        name: u?.name ?? "",
        email: u?.email ?? "",
        username: u?.username ?? "",
        phone: u?.phone ?? "",
        gender: u?.gender ?? undefined,
        citizenship: u?.citizenship ?? "",
        city: u?.city ?? "",
        address: u?.address ?? "",
        postal_code: u?.postal_code ?? "",
        allow_notifications: u?.allow_notifications ?? true,
        current_password: "",
        new_password: "",
        photo: undefined,
        photo_url: u?.photo_url ?? undefined,
    });

    const { control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: user ? sanitizeUser(user) : defaultValues,
    });

    const photo = watch("photo");
    const existingPhoto = watch("photo_url");

    const mutation = useMutation({
        mutationFn: (formData: FormData) => {
            const fd = new FormData();
            fd.append("name", formData.name ?? "");
            fd.append("email", formData.email ?? "");
            if (formData.username) fd.append("username", formData.username);
            if (formData.phone) fd.append("phone", formData.phone);
            if (formData.gender) fd.append("gender", formData.gender);
            if (formData.citizenship) fd.append("citizenship", formData.citizenship);
            if (formData.city) fd.append("city", formData.city);
            if (formData.address) fd.append("address", formData.address);
            if (formData.postal_code) fd.append("postal_code", formData.postal_code);
            fd.append("allow_notifications", String(formData.allow_notifications ?? true));
            fd.append("current_password", formData.current_password ?? "");
            if (formData.new_password) fd.append("new_password", formData.new_password);
            if (formData.photo?.status === "new" && formData.photo.file) {
                fd.append("photo[file_path]", formData.photo.file);
            }
            return updateUserProfile(fd);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["logged-in-user"] });
            primeReactToast.success("Profile updated successfully!");
            reset({ ...watch(), current_password: "", new_password: "" });
        },
    });

    useHandleMutationError(mutation.error);

    const onSubmit = (data: FormData) => mutation.mutate(data);

    if (getUserQuery?.isPending) {
        return (
            <div className="flex justify-center items-center py-20">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="4" />
            </div>
        );
    }

    return (
        <section className="pb-20 pt-28 lg:pt-32 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-[860px] mx-auto px-4 sm:px-8 xl:px-0">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile" className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                        <FiArrowLeft className="text-base" />
                        Back to Profile
                    </Link>
                </div>
                <h1 className="text-2xl font-bold text-dark dark:text-white mb-8">Edit Profile</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* ── Bio ──────────────────────────────────────────── */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-5">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <Controller name="name" control={control} render={({ field }) => (
                                    <InputText {...field} className={`w-full ${errors.name ? "p-invalid" : ""}`} />
                                )} />
                                {errors.name && <small className="p-error">{errors.name.message}</small>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <Controller name="email" control={control} render={({ field }) => (
                                    <InputText {...field} type="email" className={`w-full ${errors.email ? "p-invalid" : ""}`} />
                                )} />
                                {errors.email && <small className="p-error">{errors.email.message}</small>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                                <Controller name="username" control={control} render={({ field }) => (
                                    <InputText {...field} value={field.value ?? ""} placeholder="e.g. jdoe" className={`w-full ${errors.username ? "p-invalid" : ""}`} />
                                )} />
                                {errors.username && <small className="p-error">{errors.username.message}</small>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                                <Controller name="phone" control={control} render={({ field }) => (
                                    <InputMask {...field} value={field.value ?? ""} mask="999999999999" slotChar="" placeholder="12-digit number" className={`w-full ${errors.phone ? "p-invalid" : ""}`} />
                                )} />
                                {errors.phone && <small className="p-error">{errors.phone.message}</small>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                                <Controller name="gender" control={control} render={({ field }) => (
                                    <Dropdown
                                        {...field}
                                        options={[
                                            { label: "Male", value: "Male" },
                                            { label: "Female", value: "Female" },
                                            { label: "Prefer not to say", value: "Prefer not to say" },
                                        ]}
                                        showClear
                                        placeholder="Select gender"
                                        className={`w-full ${errors.gender ? "p-invalid" : ""}`}
                                    />
                                )} />
                            </div>

                            <div className="flex items-center gap-3 pt-6">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</label>
                                <Controller name="allow_notifications" control={control} render={({ field }) => (
                                    <InputSwitch checked={field.value ?? true} onChange={(e) => field.onChange(e.value)} />
                                )} />
                            </div>
                        </div>
                    </div>

                    {/* ── Address ──────────────────────────────────────── */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-5">Address</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country / Citizenship</label>
                                <Controller name="citizenship" control={control} render={({ field }) => (
                                    <InputText {...field} value={field.value ?? ""} placeholder="e.g. Uganda" className="w-full" />
                                )} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                                <Controller name="city" control={control} render={({ field }) => (
                                    <InputText {...field} value={field.value ?? ""} placeholder="e.g. Kampala" className="w-full" />
                                )} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postal Code</label>
                                <Controller name="postal_code" control={control} render={({ field }) => (
                                    <InputText {...field} value={field.value ?? ""} placeholder="e.g. 00256" className="w-full" />
                                )} />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                                <Controller name="address" control={control} render={({ field }) => (
                                    <InputTextarea {...field} value={field.value ?? ""} rows={3} placeholder="Street address..." className="w-full resize-none" />
                                )} />
                            </div>
                        </div>
                    </div>

                    {/* ── Photo ────────────────────────────────────────── */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-5">Profile Picture</h2>
                        <PhotoUploadPicker
                            setValue={setValue}
                            photo={photo}
                            existingPhoto={existingPhoto}
                            fieldName="photo"
                            label="Profile Photo"
                        />
                    </div>

                    {/* ── Security ─────────────────────────────────────── */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-5">Security</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Current Password <span className="text-red-500">*</span>
                                </label>
                                <Controller name="current_password" control={control} render={({ field }) => (
                                    <Password
                                        {...field}
                                        toggleMask
                                        feedback={false}
                                        placeholder="Enter your current password to save"
                                        className={`w-full ${errors.current_password ? "p-invalid" : ""}`}
                                        inputClassName="w-full"
                                        pt={{ root: { style: { width: "100%" } }, input: { style: { width: "100%" } }, iconField: { root: { style: { width: "100%" } }, style: { width: "100%" } } }}
                                    />
                                )} />
                                {errors.current_password && <small className="p-error">{errors.current_password.message}</small>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    New Password <span className="text-xs text-gray-400">(leave blank to keep current)</span>
                                </label>
                                <Controller name="new_password" control={control} render={({ field }) => (
                                    <Password
                                        {...field}
                                        toggleMask
                                        placeholder="New password (optional)"
                                        className="w-full"
                                        inputClassName="w-full"
                                        pt={{ root: { style: { width: "100%" } }, input: { style: { width: "100%" } }, iconField: { root: { style: { width: "100%" } }, style: { width: "100%" } } }}
                                    />
                                )} />
                            </div>
                        </div>
                    </div>

                    {/* ── Submit ───────────────────────────────────────── */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            label={mutation.isPending ? "Saving..." : "Save Changes"}
                            icon={mutation.isPending ? "pi pi-spin pi-spinner" : "pi pi-check"}
                            disabled={mutation.isPending}
                            className="px-8 py-3"
                        />
                    </div>
                </form>
            </div>
        </section>
    );
};

export default EditProfilePage;
