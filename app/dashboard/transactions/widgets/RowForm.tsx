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
import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "@/services/orders/orders-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";

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

const formSchema = z.object({
    order_id: z.number().superRefine((val, ctx) => requireField(val, ctx, "Order")),

    payment_method: z
        .string()
        .min(1, "Payment method is required")
        .superRefine((val, ctx) => requireField(val, ctx, "Payment Method")),

    amount: z.number().min(0, "Amount must be 0 or greater"),

    currency: z.string().nullish().optional(),

    status: z
        .enum(["pending", "initiated", "success", "failed"])
        .nullish()
        .optional(),

    notes: z.string().nullish().optional(),
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
    order_id: 0,
    payment_method: "",
    amount: 0,
    currency: "USD",
    status: "pending",
    notes: "",
};

const paymentMethodOptions = [
    { label: "Cash", value: "Cash" },
    { label: "Credit Card", value: "Credit Card" },
    { label: "Debit Card", value: "Debit Card" },
    { label: "Mobile Money", value: "Mobile Money" },
    { label: "Bank Transfer", value: "Bank Transfer" },
    { label: "PayPal", value: "PayPal" },
    { label: "M-Pesa", value: "M-Pesa" },
];

const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Initiated", value: "initiated" },
    { label: "Success", value: "success" },
    { label: "Failed", value: "failed" },
];

interface RowFormProps {
    handleFormSubmit: (data: FormData) => any;
    formMutation: any;
    initialData?: FormData;
    preselectedOrderId?: number;
}

const RowForm: React.FC<RowFormProps> = ({
    handleFormSubmit,
    formMutation,
    initialData,
    preselectedOrderId,
}) => {
    const finalInitialData = { ...defaultValues, ...initialData, order_id: preselectedOrderId || initialData?.order_id || 0 };

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

    const orderId = watch("order_id");

    // Fetch orders for dropdown
    const ordersQuery = useQuery({
        queryKey: ["orders-dropdown"],
        queryFn: () => getAllOrders({ paginate: false }),
    });

    useHandleQueryError(ordersQuery.error);

    const orders = ordersQuery?.data?.data?.data?.data || ordersQuery?.data?.data?.data || [];
    const orderOptions = Array.isArray(orders)
        ? orders.map((order: any) => ({
            label: `Order #${order.id} - ${order.guest_name || order.user?.name || "N/A"} - ${order.total}`,
            value: order.id,
        }))
        : [];

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
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid space-y-4">
                <div className="field">
                    <label htmlFor="order_id">
                        Order <span style={{ color: "red" }}>*</span>
                    </label>
                    <Controller
                        name="order_id"
                        control={control}
                        render={({ field }) => (
                            <Dropdown
                                id="order_id"
                                {...field}
                                options={orderOptions}
                                placeholder="Select an order"
                                className={errors.order_id ? "p-invalid" : ""}
                                filter
                                disabled={!!preselectedOrderId}
                            />
                        )}
                    />
                    {errors.order_id && (
                        <small className="p-error">{errors.order_id.message}</small>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="payment_method">
                        Payment Method <span style={{ color: "red" }}>*</span>
                    </label>
                    <Controller
                        name="payment_method"
                        control={control}
                        render={({ field }) => (
                            <Dropdown
                                id="payment_method"
                                {...field}
                                options={paymentMethodOptions}
                                placeholder="Select payment method"
                                className={errors.payment_method ? "p-invalid" : ""}
                            />
                        )}
                    />
                    {errors.payment_method && (
                        <small className="p-error">{errors.payment_method.message}</small>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="amount">
                        Amount <span style={{ color: "red" }}>*</span>
                    </label>
                    <Controller
                        name="amount"
                        control={control}
                        render={({ field }) => (
                            <InputNumber
                                id="amount"
                                {...field}
                                value={field.value ?? 0}
                                onValueChange={(e) => field.onChange(e.value ?? 0)}
                                mode="currency"
                                currency="USD"
                                className={errors.amount ? "p-invalid" : ""}
                            />
                        )}
                    />
                    {errors.amount && (
                        <small className="p-error">{errors.amount.message}</small>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="currency">Currency</label>
                    <Controller
                        name="currency"
                        control={control}
                        render={({ field }) => (
                            <InputText
                                id="currency"
                                {...field}
                                value={field.value ?? ""}
                                placeholder="e.g. USD"
                            />
                        )}
                    />
                </div>

                <div className="field">
                    <label htmlFor="status">Status</label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Dropdown
                                id="status"
                                {...field}
                                value={field.value ?? "pending"}
                                options={statusOptions}
                                placeholder="Select status"
                            />
                        )}
                    />
                </div>

                <div className="field">
                    <label htmlFor="notes">Notes</label>
                    <Controller
                        name="notes"
                        control={control}
                        render={({ field }) => (
                            <InputTextarea
                                id="notes"
                                {...field}
                                value={field.value ?? ""}
                                rows={3}
                                placeholder="Enter any notes..."
                            />
                        )}
                    />
                </div>

                <div className="flex justify-center gap-3 mt-4 w-full">
                    <Button
                        label={formMutation?.isPending ? "Submitting..." : "Submit Transaction"}
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
                Are you sure you want to submit this transaction?
            </Dialog>
        </>
    );
};

export default RowForm;
