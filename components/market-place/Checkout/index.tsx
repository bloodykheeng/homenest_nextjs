"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import {
    FiShoppingBag, FiMapPin, FiCreditCard, FiPhone,
    FiUser, FiMail, FiCheck, FiChevronRight, FiPackage,
} from "react-icons/fi";
import { useShoppingCart } from "@/providers/ShoppingCartProvider";
import useAuthContext from "@/providers/AuthProvider";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import { createOrder } from "@/services/orders/orders-service";
import Breadcrumb from "../Common/Breadcrumb";

type PaymentOption = "Pay on Delivery" | "Pay Now";

interface CheckoutForm {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
    paymentOption: PaymentOption;
    buyerPhone: string;
}

const TAX_RATE = 0;
const SHIPPING_FEE = 0;

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useShoppingCart();
    const { getUserQuery } = useAuthContext();
    const primeReactToast = usePrimeReactToast();

    const loggedInUser = getUserQuery?.data?.data;

    const [form, setForm] = useState<CheckoutForm>({
        name: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
        paymentOption: "Pay Now",
        buyerPhone: "",
    });
    const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
    const [orderResult, setOrderResult] = useState<any>(null);

    // Pre-fill contact fields when user loads
    useEffect(() => {
        if (loggedInUser) {
            setForm((prev) => ({
                ...prev,
                name: loggedInUser.name ?? "",
                email: loggedInUser.email ?? "",
                phone: loggedInUser.phone ?? "",
                buyerPhone: loggedInUser.phone ?? "",
            }));
        }
    }, [loggedInUser?.id]);

    const subtotal = cartTotal;
    const tax = subtotal * TAX_RATE;
    const shippingFee = SHIPPING_FEE;
    const total = subtotal + tax + shippingFee;

    const getItemPrice = (item: any) => {
        const discount = item.discount || 0;
        return item.price - (item.price * discount) / 100;
    };

    const getImageUrl = (item: any) => {
        const feat = item?.product_attachments?.find((a: any) => a.featured);
        return feat?.file_path || item?.product_attachments?.[0]?.file_path;
    };

    const validate = (): boolean => {
        const newErrors: Partial<CheckoutForm> = {};
        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email";
        if (!form.phone.trim()) newErrors.phone = "Phone is required";
        if (!form.address.trim()) newErrors.address = "Shipping address is required";
        if (form.paymentOption === "Pay Now" && !form.buyerPhone.trim()) {
            newErrors.buyerPhone = "Mobile money number is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const orderMutation = useMutation({
        mutationFn: createOrder,
        onSuccess: (response) => {
            const order = response?.data?.data;
            const olycash = response?.data?.olycash;
            setOrderResult({ order, olycash });
            clearCart();
            primeReactToast.success("Order placed successfully!");
        },
        onError: (error: any) => {
            const msg = error?.response?.data?.message || "Something went wrong. Please try again.";
            primeReactToast.error(msg);
        },
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof CheckoutForm]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        if (cartItems.length === 0) {
            primeReactToast.warn("Your cart is empty.");
            return;
        }

        const nameParts = form.name.trim().split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ") || "";

        const payload: any = {
            payment_option: form.paymentOption,
            subtotal,
            tax,
            shipping_fee: shippingFee,
            total,
            shipping_address: form.address,
            notes: form.notes || null,
            guest_name: loggedInUser ? undefined : form.name,
            guest_email: loggedInUser ? undefined : form.email,
            guest_phone: loggedInUser ? undefined : form.phone,
            items: cartItems.map((item) => ({
                product_id: item.id,
                product_name: item.name,
                quantity: item.selected_quantity,
                unit_price: getItemPrice(item),
                total_price: getItemPrice(item) * item.selected_quantity,
            })),
        };

        if (form.paymentOption === "Pay Now") {
            payload.payment_method = "mobile_money";
            payload.buyer_telephone = form.buyerPhone;
            payload.buyer_first_name = firstName;
            payload.buyer_last_name = lastName;
            payload.buyer_email = form.email;
        }

        orderMutation.mutate(payload);
    };

    // ── Success state ─────────────────────────────────────────────────────────
    if (orderResult) {
        const { order, olycash } = orderResult;
        return (
            <>
                <section>
                    <Breadcrumb title="Order Confirmed" pages={["Checkout", "Confirmed"]} />
                </section>
                <section className="py-20 bg-gray-50 dark:bg-gray-900">
                    <div className="max-w-[600px] mx-auto px-4 text-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiCheck className="text-4xl text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="font-bold text-2xl sm:text-3xl text-dark dark:text-white mb-3">
                            Order Placed!
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-2">
                            Thank you for your order. Your order number is:
                        </p>
                        <p className="font-bold text-xl text-primary mb-6">
                            #{order?.order_number}
                        </p>

                        {olycash && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6 text-left">
                                <p className="font-semibold text-dark dark:text-white mb-1">Mobile Money Payment</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {olycash.message || "A mobile money prompt has been sent to your phone. Please approve the payment to complete your order."}
                                </p>
                            </div>
                        )}

                        {order?.payment_option === "Pay on Delivery" && (
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-6 text-left">
                                <p className="font-semibold text-dark dark:text-white mb-1">Pay on Delivery</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    You will pay when your order is delivered. We will contact you to confirm.
                                </p>
                            </div>
                        )}

                        <div className="flex flex-wrap justify-center gap-3">
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 font-medium text-sm py-3 px-8 rounded-md bg-primary text-white hover:bg-opacity-90 transition-all"
                            >
                                Continue Shopping
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 font-medium text-sm py-3 px-8 rounded-md border border-gray-200 dark:border-gray-600 text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                            >
                                Go Home
                            </Link>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    // ── Empty cart guard ──────────────────────────────────────────────────────
    if (cartItems.length === 0) {
        return (
            <>
                <section>
                    <Breadcrumb title="Checkout" pages={["Checkout"]} />
                </section>
                <section className="py-20 bg-gray-50 dark:bg-gray-900">
                    <div className="flex flex-col items-center justify-center text-center px-4">
                        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-6">
                            <FiShoppingBag className="text-4xl text-gray-400" />
                        </div>
                        <h2 className="text-xl font-medium text-dark dark:text-white mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Add some items before checking out.</p>
                        <Link
                            href="/shop"
                            className="inline-flex justify-center font-medium text-white bg-primary py-3 px-8 rounded-md hover:bg-opacity-90"
                        >
                            Browse Shop
                        </Link>
                    </div>
                </section>
            </>
        );
    }

    // ── Main checkout ─────────────────────────────────────────────────────────
    return (
        <>
            <section>
                <Breadcrumb title="Checkout" pages={["Checkout"]} />
            </section>

            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col lg:flex-row gap-8">

                            {/* ── Left: Form ──────────────────────────────────────────── */}
                            <div className="flex-1 space-y-6">

                                {/* Contact Information */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                                    <h2 className="font-semibold text-lg text-dark dark:text-white mb-5 flex items-center gap-2">
                                        <FiUser className="text-primary" />
                                        Contact Information
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-dark dark:text-white mb-1.5">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className={`w-full rounded-md border px-4 py-2.5 text-sm text-dark dark:text-white bg-white dark:bg-gray-700 outline-none transition-colors focus:border-primary dark:focus:border-primary ${errors.name ? "border-red-400" : "border-gray-200 dark:border-gray-600"}`}
                                            />
                                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-dark dark:text-white mb-1.5">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                className={`w-full rounded-md border px-4 py-2.5 text-sm text-dark dark:text-white bg-white dark:bg-gray-700 outline-none transition-colors focus:border-primary dark:focus:border-primary ${errors.email ? "border-red-400" : "border-gray-200 dark:border-gray-600"}`}
                                            />
                                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-dark dark:text-white mb-1.5">
                                                Phone <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                placeholder="+256 700 000 000"
                                                className={`w-full rounded-md border px-4 py-2.5 text-sm text-dark dark:text-white bg-white dark:bg-gray-700 outline-none transition-colors focus:border-primary dark:focus:border-primary ${errors.phone ? "border-red-400" : "border-gray-200 dark:border-gray-600"}`}
                                            />
                                            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Information */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                                    <h2 className="font-semibold text-lg text-dark dark:text-white mb-5 flex items-center gap-2">
                                        <FiMapPin className="text-primary" />
                                        Shipping Information
                                    </h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-dark dark:text-white mb-1.5">
                                                Delivery Address <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="address"
                                                value={form.address}
                                                onChange={handleChange}
                                                rows={3}
                                                placeholder="Enter your full delivery address..."
                                                className={`w-full rounded-md border px-4 py-2.5 text-sm text-dark dark:text-white bg-white dark:bg-gray-700 outline-none transition-colors focus:border-primary dark:focus:border-primary resize-none ${errors.address ? "border-red-400" : "border-gray-200 dark:border-gray-600"}`}
                                            />
                                            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-dark dark:text-white mb-1.5">
                                                Order Notes <span className="text-gray-400 font-normal">(optional)</span>
                                            </label>
                                            <textarea
                                                name="notes"
                                                value={form.notes}
                                                onChange={handleChange}
                                                rows={2}
                                                placeholder="Any special delivery instructions..."
                                                className="w-full rounded-md border border-gray-200 dark:border-gray-600 px-4 py-2.5 text-sm text-dark dark:text-white bg-white dark:bg-gray-700 outline-none transition-colors focus:border-primary dark:focus:border-primary resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                                    <h2 className="font-semibold text-lg text-dark dark:text-white mb-5 flex items-center gap-2">
                                        <FiCreditCard className="text-primary" />
                                        Payment Method
                                    </h2>

                                    <div className="space-y-3">
                                        {(["Pay on Delivery", "Pay Now"] as PaymentOption[]).map((option) => (
                                            <label
                                                key={option}
                                                className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${form.paymentOption === option
                                                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                                                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentOption"
                                                    value={option}
                                                    checked={form.paymentOption === option}
                                                    onChange={handleChange}
                                                    className="mt-0.5 accent-primary"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm text-dark dark:text-white">
                                                        {option}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                        {option === "Pay on Delivery"
                                                            ? "Pay with cash when your order arrives."
                                                            : "Pay instantly via Mobile Money (MTN / Airtel)."}
                                                    </p>
                                                </div>
                                                {option === "Pay Now" && (
                                                    <FiPhone className="text-primary text-base mt-0.5 flex-shrink-0" />
                                                )}
                                            </label>
                                        ))}
                                    </div>

                                    {/* Pay Now extra fields */}
                                    {form.paymentOption === "Pay Now" && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <label className="block text-sm font-medium text-dark dark:text-white mb-1.5">
                                                Mobile Money Number <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                                <input
                                                    type="tel"
                                                    name="buyerPhone"
                                                    value={form.buyerPhone}
                                                    onChange={handleChange}
                                                    placeholder="+256 700 000 000"
                                                    className={`w-full rounded-md border pl-9 pr-4 py-2.5 text-sm text-dark dark:text-white bg-white dark:bg-gray-700 outline-none transition-colors focus:border-primary dark:focus:border-primary ${errors.buyerPhone ? "border-red-400" : "border-gray-200 dark:border-gray-600"}`}
                                                />
                                            </div>
                                            {errors.buyerPhone && <p className="text-xs text-red-500 mt-1">{errors.buyerPhone}</p>}
                                            <p className="text-xs text-gray-400 mt-2">
                                                You will receive a mobile money prompt to approve the payment.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ── Right: Order Summary ─────────────────────────────────── */}
                            <div className="w-full lg:w-[380px] flex-shrink-0">
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm sticky top-24">
                                    <h2 className="font-semibold text-lg text-dark dark:text-white mb-5 flex items-center gap-2">
                                        <FiPackage className="text-primary" />
                                        Order Summary
                                        <span className="ml-auto text-sm font-normal text-gray-400">
                                            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                                        </span>
                                    </h2>

                                    {/* Cart Items */}
                                    <div className="space-y-4 max-h-[320px] overflow-y-auto -mr-2 pr-2 mb-5">
                                        {cartItems.map((item: any) => {
                                            const imageUrl = getImageUrl(item);
                                            const unitPrice = getItemPrice(item);
                                            return (
                                                <div key={item.id} className="flex items-center gap-3">
                                                    <div className="w-14 h-14 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                                                        {imageUrl ? (
                                                            <Image
                                                                src={imageUrl}
                                                                alt={item.name}
                                                                width={56}
                                                                height={56}
                                                                className="object-contain"
                                                            />
                                                        ) : (
                                                            <span className="text-gray-400 text-xs">No img</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-dark dark:text-white line-clamp-1">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            Qty: {item.selected_quantity}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm font-semibold text-dark dark:text-white flex-shrink-0">
                                                        UGX {(unitPrice * item.selected_quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Totals */}
                                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2.5">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                                            <span className="font-medium text-dark dark:text-white">
                                                UGX {subtotal.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                                            <span className="font-medium text-green-600 dark:text-green-400">
                                                {shippingFee === 0 ? "FREE" : `UGX ${shippingFee.toLocaleString()}`}
                                            </span>
                                        </div>
                                        {TAX_RATE > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
                                                <span className="font-medium text-dark dark:text-white">
                                                    UGX {tax.toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-base font-bold border-t border-gray-100 dark:border-gray-700 pt-3 mt-1">
                                            <span className="text-dark dark:text-white">Total</span>
                                            <span className="text-primary">UGX {total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={orderMutation.isPending}
                                        className="mt-6 w-full inline-flex items-center justify-center gap-2 font-semibold text-sm py-3.5 px-6 rounded-lg bg-primary text-white hover:bg-opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                                    >
                                        {orderMutation.isPending ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Placing Order...
                                            </>
                                        ) : (
                                            <>
                                                <FiCheck className="text-base" />
                                                Place Order · UGX {total.toLocaleString()}
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-xs text-gray-400 mt-3">
                                        By placing your order you agree to our{" "}
                                        <Link href="/" className="text-primary hover:underline">
                                            Terms & Conditions
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Checkout;
