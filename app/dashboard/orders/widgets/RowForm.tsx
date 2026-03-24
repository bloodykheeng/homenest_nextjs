"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import ProductItemsSelector, { OrderItem } from "./ProductItemsSelector";

const formSchema = z.object({
    payment_option: z.enum(["Pay Now", "Pay on Delivery"], {
        required_error: "Payment option is required",
    }),
    subtotal: z.number().min(0).default(0),
    tax: z.number().min(0).optional().default(0),
    shipping_fee: z.number().min(0).optional().default(0),
    total: z.number().min(0).default(0),
    shipping_address: z.string().nullish().optional(),
    notes: z.string().nullish().optional(),
    guest_name: z.string().nullish().optional(),
    guest_email: z.string().email("Invalid email").nullish().optional(),
    guest_phone: z.string().nullish().optional(),
    items: z
        .array(
            z.object({
                product_id: z.number(),
                product_name: z.string(),
                product_sku: z.string().nullish().optional(),
                quantity: z.number().int().min(1),
                unit_price: z.number().min(0),
                total_price: z.number().min(0),
            })
        )
        .min(1, "At least one item is required"),
    payment_method: z.string().nullish().optional(),
    buyer_telephone: z.string().nullish().optional(),
    buyer_first_name: z.string().nullish().optional(),
    buyer_last_name: z.string().nullish().optional(),
    buyer_email: z.string().email("Invalid email").nullish().optional(),
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
    payment_option: "Pay on Delivery",
    subtotal: 0,
    tax: 0,
    shipping_fee: 0,
    total: 0,
    items: [],
};

interface RowFormProps {
    handleFormSubmit: (data: FormData) => any;
    formMutation: any;
    initialData?: Partial<FormData>;
}

const RowForm: React.FC<RowFormProps> = ({ handleFormSubmit, formMutation, initialData }) => {
    const finalInitialData = { ...defaultValues, ...initialData };

    const {
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: finalInitialData,
    });

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState<FormData | null>(null);

    const paymentOption = watch("payment_option");
    const items = watch("items") || [];
    const tax = watch("tax") || 0;
    const shippingFee = watch("shipping_fee") || 0;

    // Auto-calculate subtotal and total
    useEffect(() => {
        const sub = items.reduce((sum: number, item: OrderItem) => sum + (item.total_price || 0), 0);
        const tot = sub + (tax || 0) + (shippingFee || 0);
        setValue("subtotal", sub);
        setValue("total", tot);
    }, [items, tax, shippingFee]); // eslint-disable-line react-hooks/exhaustive-deps

    const onSubmit = (data: FormData) => {
        setPendingData(data);
        setShowConfirmDialog(true);
    };

    const onConfirmSubmit = (e: any) => {
        e.preventDefault();
        if (pendingData) handleFormSubmit(pendingData);
        setShowConfirmDialog(false);
    };

    const onCancelSubmit = (e?: any) => {
        e?.preventDefault();
        setShowConfirmDialog(false);
    };

    const subtotal = items.reduce((sum: number, item: OrderItem) => sum + (item.total_price || 0), 0);
    const total = subtotal + (tax || 0) + (shippingFee || 0);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid space-y-4">

                {/* Order Details */}
                <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-md">
                    <h3 className="font-semibold mb-3">Order Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        <div className="field">
                            <label className="block font-medium mb-1">
                                Payment Option <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="payment_option"
                                control={control}
                                render={({ field }) => (
                                    <Dropdown
                                        {...field}
                                        options={[
                                            { label: "Pay Now", value: "Pay Now" },
                                            { label: "Pay on Delivery", value: "Pay on Delivery" },
                                        ]}
                                        placeholder="Select payment option"
                                        className={`w-full ${errors.payment_option ? "p-invalid" : ""}`}
                                    />
                                )}
                            />
                            {errors.payment_option && <small className="p-error">{errors.payment_option.message}</small>}
                        </div>

                        <div className="field">
                            <label className="block font-medium mb-1">Shipping Address</label>
                            <Controller
                                name="shipping_address"
                                control={control}
                                render={({ field }) => (
                                    <InputText
                                        {...field}
                                        value={field.value ?? ""}
                                        placeholder="Enter shipping address"
                                        className="w-full"
                                    />
                                )}
                            />
                        </div>

                        <div className="field">
                            <label className="block font-medium mb-1">Notes</label>
                            <Controller
                                name="notes"
                                control={control}
                                render={({ field }) => (
                                    <InputText
                                        {...field}
                                        value={field.value ?? ""}
                                        placeholder="Order notes"
                                        className="w-full"
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Items Section */}
                <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-md">
                    <h3 className="font-semibold mb-3">
                        Order Items <span className="text-red-500">*</span>
                    </h3>
                    <Controller
                        name="items"
                        control={control}
                        render={({ field }) => (
                            <ProductItemsSelector
                                value={field.value || []}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    {errors.items && <small className="p-error block mt-2">{errors.items.message}</small>}

                    {/* Totals */}
                    <div className="mt-4 flex flex-col items-end gap-2 text-sm">
                        <div className="flex items-center gap-4">
                            <span className="font-medium w-32 text-right">Subtotal:</span>
                            <span className="w-28 text-right font-semibold">{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-medium w-32 text-right">Tax:</span>
                            <Controller
                                name="tax"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        value={field.value ?? 0}
                                        onValueChange={(e) => field.onChange(e.value ?? 0)}
                                        min={0}
                                        minFractionDigits={2}
                                        maxFractionDigits={2}
                                        inputClassName="w-24 text-right text-sm"
                                        className="w-28"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-medium w-32 text-right">Shipping Fee:</span>
                            <Controller
                                name="shipping_fee"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        value={field.value ?? 0}
                                        onValueChange={(e) => field.onChange(e.value ?? 0)}
                                        min={0}
                                        minFractionDigits={2}
                                        maxFractionDigits={2}
                                        inputClassName="w-24 text-right text-sm"
                                        className="w-28"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex items-center gap-4 border-t border-gray-300 dark:border-gray-700 pt-2 mt-1">
                            <span className="font-bold w-32 text-right">Total:</span>
                            <span className="w-28 text-right font-bold text-lg">{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Guest Information */}
                <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-md">
                    <h3 className="font-semibold mb-3">Guest Information (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="field">
                            <label className="block font-medium mb-1">Guest Name</label>
                            <Controller
                                name="guest_name"
                                control={control}
                                render={({ field }) => (
                                    <InputText {...field} value={field.value ?? ""} placeholder="Guest name" className="w-full" />
                                )}
                            />
                        </div>
                        <div className="field">
                            <label className="block font-medium mb-1">Guest Email</label>
                            <Controller
                                name="guest_email"
                                control={control}
                                render={({ field }) => (
                                    <InputText {...field} value={field.value ?? ""} type="email" placeholder="guest@example.com" className={`w-full ${errors.guest_email ? "p-invalid" : ""}`} />
                                )}
                            />
                            {errors.guest_email && <small className="p-error">{errors.guest_email.message}</small>}
                        </div>
                        <div className="field">
                            <label className="block font-medium mb-1">Guest Phone</label>
                            <Controller
                                name="guest_phone"
                                control={control}
                                render={({ field }) => (
                                    <InputText {...field} value={field.value ?? ""} placeholder="Guest phone" className="w-full" />
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Details — Pay Now only */}
                {paymentOption === "Pay Now" && (
                    <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-md">
                        <h3 className="font-semibold mb-3">Payment Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="field">
                                <label className="block font-medium mb-1">Payment Method</label>
                                <Controller
                                    name="payment_method"
                                    control={control}
                                    render={({ field }) => (
                                        <InputText {...field} value={field.value ?? ""} placeholder="e.g. Mobile Money, Card" className="w-full" />
                                    )}
                                />
                            </div>
                            <div className="field">
                                <label className="block font-medium mb-1">Buyer First Name</label>
                                <Controller
                                    name="buyer_first_name"
                                    control={control}
                                    render={({ field }) => (
                                        <InputText {...field} value={field.value ?? ""} placeholder="First name" className="w-full" />
                                    )}
                                />
                            </div>
                            <div className="field">
                                <label className="block font-medium mb-1">Buyer Last Name</label>
                                <Controller
                                    name="buyer_last_name"
                                    control={control}
                                    render={({ field }) => (
                                        <InputText {...field} value={field.value ?? ""} placeholder="Last name" className="w-full" />
                                    )}
                                />
                            </div>
                            <div className="field">
                                <label className="block font-medium mb-1">Buyer Email</label>
                                <Controller
                                    name="buyer_email"
                                    control={control}
                                    render={({ field }) => (
                                        <InputText {...field} value={field.value ?? ""} type="email" placeholder="buyer@example.com" className={`w-full ${errors.buyer_email ? "p-invalid" : ""}`} />
                                    )}
                                />
                                {errors.buyer_email && <small className="p-error">{errors.buyer_email.message}</small>}
                            </div>
                            <div className="field">
                                <label className="block font-medium mb-1">Buyer Telephone</label>
                                <Controller
                                    name="buyer_telephone"
                                    control={control}
                                    render={({ field }) => (
                                        <InputText {...field} value={field.value ?? ""} placeholder="Buyer phone" className="w-full" />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit */}
                <div className="w-full flex justify-center pt-2">
                    <Button
                        type="submit"
                        label={formMutation?.isPending ? "Submitting..." : "Submit Order"}
                        icon="pi pi-check"
                        loading={formMutation?.isPending}
                        className="p-3 text-xl"
                    />
                </div>
            </form>

            <Dialog
                header="Confirm Order Submission"
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
                Are you sure you want to submit this order?
            </Dialog>
        </>
    );
};

export default RowForm;
