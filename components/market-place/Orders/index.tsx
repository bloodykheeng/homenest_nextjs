"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
    FiPackage, FiChevronDown, FiChevronUp, FiRefreshCw,
    FiShoppingBag, FiCreditCard, FiClock, FiCheck, FiX,
    FiAlertCircle, FiSearch, FiCalendar, FiChevronLeft, FiChevronRight,
} from "react-icons/fi";
import { getAllOrders } from "@/services/orders/orders-service";
import useAuthContext from "@/providers/AuthProvider";
import useHandleQueryError from "@/hooks/useHandleQueryError";
import Breadcrumb from "../Common/Breadcrumb";

type OrderStatus = "all" | "pending" | "processing" | "completed" | "cancelled";
type PaymentFilter = "all" | "Pay Now" | "Pay on Delivery";

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    processing: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    completed: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    cancelled: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
    pending: <FiClock className="text-xs" />,
    processing: <FiRefreshCw className="text-xs" />,
    completed: <FiCheck className="text-xs" />,
    cancelled: <FiX className="text-xs" />,
};

const TX_STATUS_STYLES: Record<string, string> = {
    initiated: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    success: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    failed: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    cancelled: "bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-400",
};

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-UG", { day: "2-digit", month: "short", year: "numeric" });

// ── Order Card ────────────────────────────────────────────────────────────────
const OrderCard = ({ order }: { order: any }) => {
    const [expanded, setExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<"items" | "transactions">("items");

    const statusStyle = STATUS_STYLES[order.status] ?? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300";
    const statusIcon = STATUS_ICONS[order.status] ?? <FiAlertCircle className="text-xs" />;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Clickable header */}
            <div
                className="flex flex-wrap items-center gap-3 p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                onClick={() => setExpanded((v) => !v)}
            >
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-dark dark:text-white text-sm">
                            #{order.order_number}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyle}`}>
                            {statusIcon}
                            {order.status}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {order.payment_option}
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDate(order.created_at)} · {order.items?.length ?? 0} item{order.items?.length !== 1 ? "s" : ""}
                        {order.shipping_address && ` · ${order.shipping_address}`}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="font-bold text-primary text-base">
                        UGX {Number(order.total).toLocaleString()}
                    </span>
                    {expanded
                        ? <FiChevronUp className="text-gray-400 dark:text-gray-500 shrink-0" />
                        : <FiChevronDown className="text-gray-400 dark:text-gray-500 shrink-0" />}
                </div>
            </div>

            {/* Expanded body */}
            {expanded && (
                <div className="border-t border-gray-100 dark:border-gray-700">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-100 dark:border-gray-700 px-5 bg-white dark:bg-gray-800">
                        {(["items", "transactions"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab
                                    ? "border-primary text-primary"
                                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-white"
                                    }`}
                            >
                                {tab}
                                <span className="ml-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full">
                                    {tab === "items" ? order.items?.length ?? 0 : order.transactions?.length ?? 0}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="p-5 bg-white dark:bg-gray-800">
                        {/* Items tab */}
                        {activeTab === "items" && (
                            <div>
                                {(order.items ?? []).length === 0 ? (
                                    <p className="text-sm text-gray-400 italic">No items found.</p>
                                ) : (
                                    <>
                                        <div className="space-y-3">
                                            {order.items.map((item: any) => {
                                                const imgUrl =
                                                    item.product?.product_attachments?.find((a: any) => a.featured)?.file_path
                                                    || item.product?.product_attachments?.[0]?.file_path;
                                                return (
                                                    <div key={item.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 dark:border-gray-700/40 last:border-0">
                                                        {/* Image */}
                                                        <div className="w-14 h-14 shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                                                            {imgUrl ? (
                                                                <Image src={imgUrl} alt={item.product_name} width={56} height={56} className="object-contain" />
                                                            ) : (
                                                                <FiPackage className="text-gray-400 text-lg" />
                                                            )}
                                                        </div>

                                                        {/* Details */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-dark dark:text-white line-clamp-1">
                                                                {item.product_name}
                                                            </p>
                                                            {item.product_sku && (
                                                                <p className="text-xs text-gray-400">SKU: {item.product_sku}</p>
                                                            )}
                                                            <p className="text-xs text-gray-400 mt-0.5">
                                                                {item.quantity} × UGX {Number(item.unit_price).toLocaleString()}
                                                            </p>
                                                        </div>

                                                        <span className="text-sm font-semibold text-primary shrink-0">
                                                            UGX {Number(item.total_price).toLocaleString()}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Totals */}
                                        <div className="mt-4 pt-3 space-y-1.5 border-t border-gray-100 dark:border-gray-700">
                                            {Number(order.tax) > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500 dark:text-gray-400">Tax</span>
                                                    <span className="text-dark dark:text-white">UGX {Number(order.tax).toLocaleString()}</span>
                                                </div>
                                            )}
                                            {Number(order.shipping_fee) > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                                                    <span className="text-dark dark:text-white">UGX {Number(order.shipping_fee).toLocaleString()}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-sm font-bold pt-1.5 border-t border-gray-100 dark:border-gray-700">
                                                <span className="text-dark dark:text-white">Total</span>
                                                <span className="text-primary">UGX {Number(order.total).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Transactions tab */}
                        {activeTab === "transactions" && (
                            <div className="space-y-3">
                                {(order.transactions ?? []).length === 0 ? (
                                    <p className="text-sm text-gray-400 italic">No payment transactions yet.</p>
                                ) : (
                                    order.transactions.map((tx: any) => (
                                        <div key={tx.id} className="rounded-lg border border-gray-100 dark:border-gray-700 p-4 space-y-2 bg-gray-50 dark:bg-gray-700/30">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <FiCreditCard className="text-primary text-sm" />
                                                    <span className="text-sm font-medium text-dark dark:text-white capitalize">
                                                        {tx.payment_method ?? "Payment"}
                                                    </span>
                                                    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full capitalize ${TX_STATUS_STYLES[tx.status] ?? "bg-gray-100 text-gray-600"}`}>
                                                        {tx.status}
                                                    </span>
                                                </div>
                                                <span className="font-bold text-sm text-primary">
                                                    {tx.currency} {Number(tx.amount).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                                                {tx.olycash_purchase_id && (
                                                    <span>Purchase ID: <span className="text-dark dark:text-white">{tx.olycash_purchase_id}</span></span>
                                                )}
                                                {tx.olycash_buyer_telephone && (
                                                    <span>Phone: <span className="text-dark dark:text-white">{tx.olycash_buyer_telephone}</span></span>
                                                )}
                                                {tx.olycash_buyer_name && (
                                                    <span>Buyer: <span className="text-dark dark:text-white">{tx.olycash_buyer_name}</span></span>
                                                )}
                                                {tx.olycash_message && (
                                                    <span className="col-span-2 sm:col-span-3">
                                                        Message: <span className="text-dark dark:text-white">{tx.olycash_message}</span>
                                                    </span>
                                                )}
                                                <span>Date: <span className="text-dark dark:text-white">{formatDate(tx.created_at)}</span></span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Main Orders Page ──────────────────────────────────────────────────────────
const Orders = () => {
    const { getUserQuery } = useAuthContext();
    const loggedInUser = getUserQuery?.data?.data;

    const [statusFilter, setStatusFilter] = useState<OrderStatus>("all");
    const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const resetPage = useCallback(() => setCurrentPage(1), []);

    const ordersQuery = useQuery({
        queryKey: [
            "orders", "my-orders", loggedInUser?.id,
            statusFilter, paymentFilter, searchTerm,
            startDate, endDate, currentPage, rowsPerPage,
        ],
        queryFn: () =>
            getAllOrders({
                user_id: loggedInUser?.id,
                status: statusFilter !== "all" ? statusFilter : undefined,
                payment_option: paymentFilter !== "all" ? paymentFilter : undefined,
                search: searchTerm || undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                paginate: true,
                rowsPerPage,
                page: currentPage,
            }),
        enabled: !!loggedInUser?.id,
    });

    useHandleQueryError(ordersQuery);

    const paginatedData = ordersQuery.data?.data?.data;
    const orders: any[] = paginatedData?.data ?? [];
    const total: number = paginatedData?.total ?? 0;
    const lastPage: number = paginatedData?.last_page ?? 1;
    const from: number = paginatedData?.from ?? 0;
    const to: number = paginatedData?.to ?? 0;

    const handleSearch = () => { setSearchTerm(searchInput); resetPage(); };
    const handleClearFilters = () => {
        setStatusFilter("all");
        setPaymentFilter("all");
        setSearchInput("");
        setSearchTerm("");
        setStartDate("");
        setEndDate("");
        resetPage();
    };
    const hasActiveFilters = statusFilter !== "all" || paymentFilter !== "all" || searchTerm || startDate || endDate;

    // ── Not logged in ─────────────────────────────────────────────────────────
    if (!getUserQuery.isPending && !loggedInUser) {
        return (
            <>
                <section><Breadcrumb title="My Orders" pages={["Orders"]} /></section>
                <section className="py-20 bg-gray-50 dark:bg-gray-900">
                    <div className="flex flex-col items-center justify-center text-center px-4">
                        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-6">
                            <FiPackage className="text-4xl text-gray-400" />
                        </div>
                        <h2 className="text-xl font-medium text-dark dark:text-white mb-2">Sign in to view your orders</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Track your orders and payment history after signing in.</p>
                        <Link href="/signin" className="inline-flex justify-center font-medium text-white bg-primary py-3 px-8 rounded-md hover:bg-opacity-90">
                            Sign In
                        </Link>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <section><Breadcrumb title="My Orders" pages={["Orders"]} /></section>

            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">

                    {/* ── Filter Bar ───────────────────────────────────────────── */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6 space-y-3">
                        {/* Row 1: Search + Status + Payment */}
                        <div className="flex flex-wrap gap-3">
                            {/* Search */}
                            <div className="relative flex-1 min-w-[200px]">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    placeholder="Search by order number..."
                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-dark dark:text-white text-sm pl-9 pr-4 py-2.5 outline-none focus:border-primary dark:focus:border-primary transition-colors"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-opacity-90 transition-all"
                            >
                                Search
                            </button>

                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value as OrderStatus); resetPage(); }}
                                className="rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-dark dark:text-white text-sm px-3 py-2.5 outline-none focus:border-primary"
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>

                            <select
                                value={paymentFilter}
                                onChange={(e) => { setPaymentFilter(e.target.value as PaymentFilter); resetPage(); }}
                                className="rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-dark dark:text-white text-sm px-3 py-2.5 outline-none focus:border-primary"
                            >
                                <option value="all">All Payments</option>
                                <option value="Pay Now">Pay Now</option>
                                <option value="Pay on Delivery">Pay on Delivery</option>
                            </select>
                        </div>

                        {/* Row 2: Date range + Clear + Refresh */}
                        <div className="flex flex-wrap gap-3 items-center">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <FiCalendar className="text-primary" />
                                <span>Date:</span>
                            </div>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => { setStartDate(e.target.value); resetPage(); }}
                                className="rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-dark dark:text-white text-sm px-3 py-2 outline-none focus:border-primary"
                            />
                            <span className="text-gray-400 text-sm">to</span>
                            <input
                                type="date"
                                value={endDate}
                                min={startDate}
                                onChange={(e) => { setEndDate(e.target.value); resetPage(); }}
                                className="rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-dark dark:text-white text-sm px-3 py-2 outline-none focus:border-primary"
                            />

                            <div className="flex items-center gap-2 ml-auto">
                                {hasActiveFilters && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors px-3 py-2"
                                    >
                                        Clear filters
                                    </button>
                                )}
                                <button
                                    onClick={() => ordersQuery.refetch()}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-dark dark:text-white text-sm hover:border-primary hover:text-primary transition-colors"
                                >
                                    <FiRefreshCw className={`text-sm ${ordersQuery.isRefetching ? "animate-spin" : ""}`} />
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Loading skeleton ─────────────────────────────────────── */}
                    {ordersQuery.isPending && (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl h-24 border border-gray-100 dark:border-gray-700" />
                            ))}
                        </div>
                    )}

                    {/* ── Error ────────────────────────────────────────────────── */}
                    {ordersQuery.isError && (
                        <div className="flex flex-col items-center py-16 text-center">
                            <FiAlertCircle className="text-4xl text-red-400 mb-4" />
                            <p className="text-red-500 dark:text-red-400 mb-4">Failed to load orders.</p>
                            <button
                                onClick={() => ordersQuery.refetch()}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm rounded-md hover:bg-opacity-90"
                            >
                                <FiRefreshCw /> Retry
                            </button>
                        </div>
                    )}

                    {/* ── Orders list ──────────────────────────────────────────── */}
                    {!ordersQuery.isPending && !ordersQuery.isError && (
                        <>
                            {orders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-5">
                                        <FiShoppingBag className="text-3xl text-gray-400" />
                                    </div>
                                    <h3 className="font-medium text-dark dark:text-white mb-2">No orders found</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                                        {hasActiveFilters ? "Try adjusting your filters." : "You haven't placed any orders yet."}
                                    </p>
                                    {!hasActiveFilters && (
                                        <Link href="/shop" className="inline-flex justify-center font-medium text-white bg-primary py-3 px-8 rounded-md hover:bg-opacity-90">
                                            Browse Shop
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {/* Count */}
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Showing <span className="font-medium text-dark dark:text-white">{from}–{to}</span> of{" "}
                                        <span className="font-medium text-dark dark:text-white">{total}</span> orders
                                    </p>

                                    {/* Cards */}
                                    <div className="space-y-4">
                                        {orders.map((order: any) => (
                                            <OrderCard key={order.id} order={order} />
                                        ))}
                                    </div>

                                    {/* ── Pagination ──────────────────────────────── */}
                                    {lastPage > 1 && (
                                        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Page <span className="font-medium text-dark dark:text-white">{currentPage}</span> of{" "}
                                                <span className="font-medium text-dark dark:text-white">{lastPage}</span>
                                            </p>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                                    disabled={currentPage === 1}
                                                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-dark dark:text-white hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <FiChevronLeft className="text-sm" />
                                                </button>

                                                {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
                                                    let page: number;
                                                    if (lastPage <= 5) {
                                                        page = i + 1;
                                                    } else if (currentPage <= 3) {
                                                        page = i + 1;
                                                    } else if (currentPage >= lastPage - 2) {
                                                        page = lastPage - 4 + i;
                                                    } else {
                                                        page = currentPage - 2 + i;
                                                    }
                                                    return (
                                                        <button
                                                            key={page}
                                                            onClick={() => setCurrentPage(page)}
                                                            className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${currentPage === page
                                                                ? "bg-primary border-primary text-white"
                                                                : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-dark dark:text-white hover:border-primary hover:text-primary"
                                                                }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    );
                                                })}

                                                <button
                                                    onClick={() => setCurrentPage((p) => Math.min(lastPage, p + 1))}
                                                    disabled={currentPage === lastPage}
                                                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-dark dark:text-white hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <FiChevronRight className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    );
};

export default Orders;
