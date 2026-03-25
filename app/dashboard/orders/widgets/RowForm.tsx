import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import ProductItemsTableSelector from './ProductItemsTableSelector';

// ✅ Import OrderItem from the shared types file — same type as ProductItemsTableSelector uses
import type { OrderItem } from "./order-types";

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const orderItemSchema = z.object({
    product_category_id: z.number(),
    product_subcategory_id: z.number(),
    product_id: z.number(),
    category: z.object({
        id: z.number(),
        name: z.string(),
        photo_url: z.string().nullish(),
    }),
    subcategory: z.object({
        id: z.number(),
        name: z.string(),
        photo_url: z.string().nullish(),
    }),
    product: z.object({
        id: z.number(),
        name: z.string(),
        sku: z.string().nullish(),
        photo_url: z.string().nullish(),
        // ✅ explicitly typed as number | null | undefined — fixes the 'unknown' error
        price: z.coerce.number<number>().nullish(),
    }),
    product_name: z.string().min(1, "Product name is required"),
    product_sku: z.string().nullish(),
    quantity: z.coerce.number<number>().min(1, "Quantity must be at least 1"),
    unit_price: z.coerce.number<number>().min(0, "Unit price must be at least 0"),
    total_price: z.coerce.number<number>().min(0),
});

const formSchema = z.object({
    payment_option: z.enum(["Pay Now", "Pay on Delivery"], {
        error: "Payment option is required",
    }),
    shipping_address: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    guest_name: z.string().optional().nullable(),
    guest_email: z.string().email("Invalid email").optional().nullable().or(z.literal("")),
    guest_phone: z.string().optional().nullable(),
    buyer_telephone: z.string().optional().nullable(),
    buyer_first_name: z.string().optional().nullable(),
    buyer_last_name: z.string().optional().nullable(),
    buyer_email: z.string().email("Invalid email").optional().nullable().or(z.literal("")),
    items: z
        .array(orderItemSchema)
        .min(1, "At least one item is required")
        .superRefine((data, ctx) => {
            data.forEach((item, index) => {
                if (!item.quantity || item.quantity <= 0) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Quantity must be greater than 0",
                        path: [index, "quantity"],
                    });
                }
                if (item.unit_price === undefined || item.unit_price < 0) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Unit price must be at least 0",
                        path: [index, "unit_price"],
                    });
                }
            });
        }),
});

export type OrderFormData = z.infer<typeof formSchema>;

const defaultValues: OrderFormData = {
    payment_option: "Pay on Delivery",
    shipping_address: "",
    notes: "",
    guest_name: "",
    guest_email: "",
    guest_phone: "",
    buyer_telephone: "",
    buyer_first_name: "",
    buyer_last_name: "",
    buyer_email: "",
    items: [],
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface RowFormProps {
    handleFormSubmit: (data: OrderFormData | null) => any;
    formMutation: any;
    initialData?: Partial<OrderFormData>;
}

const PAYMENT_OPTIONS = [
    { label: "Pay on Delivery", value: "Pay on Delivery" },
    { label: "Pay Now", value: "Pay Now" },
];

// ─── Component ────────────────────────────────────────────────────────────────

const RowForm: React.FC<RowFormProps> = ({
    handleFormSubmit,
    formMutation,
    initialData = defaultValues,
}) => {
    const normalizedInitialData: OrderFormData = {
        ...defaultValues,
        ...initialData,
        items: (initialData.items || []).map((item) => ({
            ...item,
            quantity: Number(item.quantity) || 0,
            unit_price: Number(item.unit_price) || 0,
            total_price: Number(item.total_price) || 0,
            product: {
                ...item.product,
                // ✅ always number | null, never unknown
                unit_price: item.product?.price != null
                    ? Number(item.product.price)
                    : null,
            },
        })),
    };

    const {
        handleSubmit,
        register,
        watch,
        setValue,
        control,
        formState: { errors },
    } = useForm<OrderFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: normalizedInitialData,
    });

    const { fields, replace, update, remove } = useFieldArray({
        control,
        name: "items",
    });

    const items = watch("items") ?? [];
    const paymentOption = watch("payment_option");

    const [selectorVisible, setSelectorVisible] = useState(false);

    // ─── Submit ───────────────────────────────────────────────────────────────

    const onSubmit = (data: OrderFormData) => {
        confirmDialog({
            message: `Submit this order with ${data.items.length} item(s)?`,
            header: "Confirm Order Submission",
            icon: "pi pi-exclamation-triangle",
            accept: () => handleFormSubmit(data),
        });
    };

    // ─── Item mutations ───────────────────────────────────────────────────────

    const updateItemQuantity = (index: number, newQty: number) => {
        if (newQty <= 0) {
            confirmRemoveItem(index);
            return;
        }
        const item = items[index];
        update(index, {
            ...item,
            quantity: newQty,
            total_price: item.unit_price * newQty,
        });
    };

    const updateItemUnitPrice = (index: number, newPrice: number) => {
        const item = items[index];
        update(index, {
            ...item,
            unit_price: newPrice,
            total_price: newPrice * item.quantity,
        });
    };

    const confirmRemoveItem = (index: number) => {
        confirmDialog({
            message: "Remove this item from the order?",
            header: "Remove Item",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            accept: () => remove(index),
        });
    };

    // Receive valid items back from the selector dialog
    const handleItemsUpdate = (updatedItems: OrderItem[]) => {
        const validItems = updatedItems.filter(
            (i) => i.quantity >= 1 && i.unit_price > 0
        );
        replace(validItems);
    };

    // ─── Column templates ─────────────────────────────────────────────────────

    const quantityTemplate = (rowData: OrderItem, { rowIndex }: any) => (
        <InputNumber
            value={rowData.quantity}
            onChange={(e) => updateItemQuantity(rowIndex, e.value || 0)}
            min={1}
            showButtons
            buttonLayout="horizontal"
            decrementButtonClassName="p-button-danger p-button-sm"
            incrementButtonClassName="p-button-success p-button-sm"
            decrementButtonIcon="pi pi-minus"
            incrementButtonIcon="pi pi-plus"
        />
    );

    const unitPriceTemplate = (rowData: OrderItem, { rowIndex }: any) => (
        <div className="flex flex-col">
            <InputNumber
                value={rowData.unit_price}
                onChange={(e) => updateItemUnitPrice(rowIndex, e.value || 0)}
                min={0}
                mode="currency"
                currency="UGX"
                locale="en-UG"
                className="w-full"
            />
            {rowData.product?.price != null && rowData.product.price > 0 && (
                <small className="text-gray-500 mt-1">
                    Listed:{" "}
                    {new Intl.NumberFormat("en-UG", {
                        style: "currency",
                        currency: "UGX",
                    }).format(rowData.product.price)}
                </small>
            )}
        </div>
    );

    const totalPriceTemplate = (rowData: OrderItem) =>
        rowData.total_price > 0 ? (
            new Intl.NumberFormat("en-UG", {
                style: "currency",
                currency: "UGX",
            }).format(rowData.total_price)
        ) : (
            <span className="text-gray-500 italic">N/A</span>
        );

    const actionTemplate = (_rowData: OrderItem, { rowIndex }: any) => (
        <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-text p-button-sm p-button-danger"
            onClick={(e) => {
                e.preventDefault();
                confirmRemoveItem(rowIndex);
            }}
            tooltip="Remove"
        />
    );

    // ─── Totals ───────────────────────────────────────────────────────────────

    const subtotal = items.reduce((sum, i) => sum + (i.total_price || 0), 0);
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <Card className="mb-4">
            <ConfirmDialog />

            <form onSubmit={handleSubmit(onSubmit)}>

                {/* ── Order-level fields ───────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                    <div className="field">
                        <label className="font-medium block mb-2">
                            Payment Option <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                            value={paymentOption}
                            options={PAYMENT_OPTIONS}
                            onChange={(e) => setValue("payment_option", e.value)}
                            placeholder="Select payment option"
                            className={`w-full ${errors.payment_option ? "p-invalid" : ""}`}
                        />
                        {errors.payment_option && (
                            <small className="p-error">{errors.payment_option.message}</small>
                        )}
                    </div>

                    <div className="field">
                        <label className="font-medium block mb-2">Shipping Address</label>
                        <InputText
                            {...register("shipping_address")}
                            placeholder="Enter shipping address"
                            className="w-full"
                        />
                    </div>

                    <div className="field md:col-span-2">
                        <label className="font-medium block mb-2">Notes</label>
                        <InputTextarea
                            {...register("notes")}
                            rows={3}
                            placeholder="Any additional notes..."
                            className="w-full"
                        />
                    </div>
                </div>

                {/* ── Guest fields ─────────────────────────────────────────── */}
                <Card className="mb-4">
                    <h5 className="mb-3">Guest Information (optional)</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="field">
                            <label className="font-medium block mb-2">Guest Name</label>
                            <InputText
                                {...register("guest_name")}
                                placeholder="Guest name"
                                className="w-full"
                            />
                        </div>
                        <div className="field">
                            <label className="font-medium block mb-2">Guest Email</label>
                            <InputText
                                {...register("guest_email")}
                                placeholder="guest@email.com"
                                className={`w-full ${errors.guest_email ? "p-invalid" : ""}`}
                            />
                            {errors.guest_email && (
                                <small className="p-error">{errors.guest_email.message}</small>
                            )}
                        </div>
                        <div className="field">
                            <label className="font-medium block mb-2">Guest Phone</label>
                            <InputText
                                {...register("guest_phone")}
                                placeholder="+256 ..."
                                className="w-full"
                            />
                        </div>
                    </div>
                </Card>

                {/* ── Pay Now buyer fields ─────────────────────────────────── */}
                {paymentOption === "Pay Now" && (
                    <Card className="mb-4">
                        <h5 className="mb-3">Payment Details (Pay Now)</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="field">
                                <label className="font-medium block mb-2">First Name</label>
                                <InputText
                                    {...register("buyer_first_name")}
                                    placeholder="First name"
                                    className="w-full"
                                />
                            </div>
                            <div className="field">
                                <label className="font-medium block mb-2">Last Name</label>
                                <InputText
                                    {...register("buyer_last_name")}
                                    placeholder="Last name"
                                    className="w-full"
                                />
                            </div>
                            <div className="field">
                                <label className="font-medium block mb-2">Buyer Email</label>
                                <InputText
                                    {...register("buyer_email")}
                                    placeholder="buyer@email.com"
                                    className={`w-full ${errors.buyer_email ? "p-invalid" : ""}`}
                                />
                                {errors.buyer_email && (
                                    <small className="p-error">{errors.buyer_email.message}</small>
                                )}
                            </div>
                            <div className="field">
                                <label className="font-medium block mb-2">Buyer Telephone</label>
                                <InputText
                                    {...register("buyer_telephone")}
                                    placeholder="+256 ..."
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </Card>
                )}

                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold m-0">Order Form</h4>
                    <Button
                        label="Add Products"
                        icon="pi pi-plus"
                        onClick={() => setSelectorVisible(true)}
                        type="button"
                    />
                </div>

                {/* ── Items table ──────────────────────────────────────────── */}
                {items.length > 0 ? (
                    <>
                        <DataTable
                            value={fields}
                            responsiveLayout="scroll"
                            className="p-datatable-sm mb-4"
                        >
                            <Column field="category.name" header="Category" />
                            <Column field="subcategory.name" header="Subcategory" />
                            <Column field="product_name" header="Product" />
                            <Column field="product_sku" header="SKU" />
                            <Column
                                header="Unit Price"
                                body={unitPriceTemplate}
                                style={{ width: "220px" }}
                            />
                            <Column
                                header="Quantity"
                                body={quantityTemplate}
                                style={{ width: "150px" }}
                            />
                            <Column header="Total Price" body={totalPriceTemplate} />
                            <Column body={actionTemplate} style={{ width: "80px" }} />
                        </DataTable>

                        {errors.items && !Array.isArray(errors.items) && (
                            <small className="p-error block mb-4">
                                {errors.items.message?.toString()}
                            </small>
                        )}

                        {Array.isArray(errors.items) &&
                            errors.items.map((itemErr, index) => {
                                const messages = Object.entries(itemErr || {})
                                    .map(([key, field]) =>
                                        field &&
                                            typeof field === "object" &&
                                            "message" in field
                                            ? `${key}: ${(field as any).message}`
                                            : null
                                    )
                                    .filter(Boolean);

                                return messages.length > 0 ? (
                                    <small key={index} className="p-error block mb-1">
                                        Item {index + 1} — {messages.join(", ")}
                                    </small>
                                ) : null;
                            })}

                        {/* ── Order summary ─────────────────────────────────── */}
                        <Card className="mb-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div>
                                    <h6 className="text-sm font-medium text-gray-600 mb-1">Total Items</h6>
                                    <p className="text-lg font-semibold">{items.length}</p>
                                </div>
                                <div>
                                    <h6 className="text-sm font-medium text-gray-600 mb-1">Total Quantity</h6>
                                    <p className="text-lg font-semibold">{totalQuantity}</p>
                                </div>
                                <div>
                                    <h6 className="text-sm font-medium text-gray-600 mb-1">Subtotal</h6>
                                    <p className="text-lg font-semibold">
                                        {subtotal > 0
                                            ? new Intl.NumberFormat("en-UG", {
                                                style: "currency",
                                                currency: "UGX",
                                            }).format(subtotal)
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <div className="text-center">
                            <Button
                                type="submit"
                                label="Submit Order"
                                icon="pi pi-check"
                                disabled={formMutation?.isPending || items.length === 0}
                                loading={formMutation?.isPending}
                                className="p-button-success"
                            />
                        </div>
                    </>
                ) : (
                    <div className="p-4 text-center border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="text-gray-600 dark:text-gray-400">
                            No items added yet. Click "Add Products" to get started.
                        </p>
                        {errors.items && !Array.isArray(errors.items) && (
                            <small className="p-error block mt-2">
                                {errors.items.message?.toString()}
                            </small>
                        )}
                    </div>
                )}
            </form>

            <ProductItemsTableSelector
                visible={selectorVisible}
                onHide={() => setSelectorVisible(false)}
                selectedItems={items}
                onItemsUpdate={handleItemsUpdate}
            />
        </Card>
    );
};

export default RowForm;