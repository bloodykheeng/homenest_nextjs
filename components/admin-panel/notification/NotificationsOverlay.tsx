import React, { useState, useRef } from "react";
import { useInView } from 'react-intersection-observer';
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Divider } from "primereact/divider";
import { ScrollPanel } from "primereact/scrollpanel";
import { ProgressSpinner } from "primereact/progressspinner";
import { Avatar } from "primereact/avatar";
import { Chip } from "primereact/chip";
import { useRouter } from 'nextjs-toploader/app';
import moment from 'moment';
import dynamic from "next/dynamic";
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
    postToMarkNotificationAsViewed,
    getLoggedInUserNotifications,
} from "@/services/notifications/notifications-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";
import useHandleMutationError from "@/hooks/useHandleMutationError";
import useAuthContext from "@/providers/AuthProvider";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import InlineExpandableText from "@/components/helpers/InlineExpandableText";



// import MaterialUiLoaderLottie from "@/public/lottie-files/material-ui-loading-lottie.json";
// import SnailErrorLottie from "@/public/lottie-files/snail-error-lottie.json";
// // import SateLiteLottie from "@/public/lottie-files/satelite-loading-lottie.json";
// // import FileLoadingLottie from "@/public/lottie-files/FileLoadingLottie.json";
// import SkeletonLoadingLottie from "@/public/lottie-files/SkeletonLoadingLottie.json";
// import NoDataLottie from "@/public/lottie-files/nodata.json";

const MaterialUiLoaderLottie = "/lotties/material-ui-loading-lottie.json";
const SnailErrorLottie = "/lotties/snail-error-lottie.json";
// const SateLiteLottie = "/lotties/satelite-loading-lottie.json";
// const FileLoadingLottie = "/lotties/FileLoadingLottie.json";
const SkeletonLoadingLottie = "/lotties/SkeletonLoadingLottie.json";
const NoDataLottie = "/lotties/nodata.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Types
interface Notification {
    id: string | number;
    title: string;
    description: string;
    type?: 'success' | 'warning' | 'error' | 'info';
    seen: boolean;
    created_at: string;
}

interface NotificationItemProps {
    notification: Notification;
    onVisible: (notification: Notification) => void;
    isLast: boolean;
}

interface NotificationResponse {
    data: {
        data: Notification[];
        current_page: number;
        last_page: number;
    };
    unread_notifications_count: number;
    total_notifications_count: number;
}

interface PageData {
    data: NotificationResponse;
}

interface MarkNotificationParams {
    notification_id: string | number;
}

// Component to observe visibility of a notification using react-intersection-observer
const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onVisible, isLast }) => {
    const { ref } = useInView({
        threshold: 0.5,
        triggerOnce: true,
        onChange: (inView) => {
            if (inView && !notification.seen) {
                onVisible(notification);
            }
        },
    });

    const getNotificationIcon = (type?: string): string => {
        switch (type) {
            case 'success': return 'pi-check-circle';
            case 'warning': return 'pi-exclamation-triangle';
            case 'error': return 'pi-times-circle';
            case 'info': return 'pi-info-circle';
            default: return 'pi-bell';
        }
    };

    const getNotificationColor = (seen: boolean): string => {
        return seen ? 'text-surface-500' : 'text-primary-500';
    };

    const formatTimeAgo = (date: string): string => {
        return moment(date).fromNow();
    };

    return (
        <div
            ref={!notification.seen ? ref : null}
            className={`p-4 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group ${!notification.seen
                ? "bg-indigo-50 dark:bg-indigo-900 border-l-4 border-indigo-500"
                : "bg-white dark:bg-gray-900"
                } ${!isLast ? "border-b border-gray-200 dark:border-gray-700" : ""}`}
        >
            <div className="flex gap-3">
                {/* Avatar/Icon */}
                <div className="flex-shrink-0">
                    <Avatar
                        icon={`pi ${getNotificationIcon(notification.type)}`}
                        className={`${getNotificationColor(notification.seen)} bg-gray-100 dark:bg-gray-800`}
                        size="normal"
                        shape="circle"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <h4
                            className={`font-semibold text-sm ${notification.seen
                                ? "text-gray-700 dark:text-gray-300"
                                : "text-gray-900 dark:text-gray-100"
                                }`}
                        >
                            <InlineExpandableText text={notification.title} maxLength={50} />
                        </h4>

                        {!notification.seen && (
                            <div className="flex-shrink-0 ml-2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                        <InlineExpandableText text={notification?.description} maxLength={120} />
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <i className="pi pi-clock"></i>
                            <span>{formatTimeAgo(notification.created_at)}</span>
                        </div>

                        {!notification.seen && (
                            <Chip
                                label="New"
                                className="bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-300 text-xs px-2 py-1 h-6"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

};

const NotificationsOverlay: React.FC = () => {
    const router = useRouter();
    const overlayRef = useRef<OverlayPanel>(null);
    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();
    const { getUserQuery } = useAuthContext();
    const loggedInUserData = getUserQuery?.data?.data;

    const getLoggedInUserNotificationsQuery = useInfiniteQuery<PageData, Error>({
        queryKey: ["user-notifications"],
        queryFn: (params) => getLoggedInUserNotifications({ ...params, page: params?.pageParam, paginate: true }),
        getNextPageParam: (lastPage: PageData, pages: PageData[]) => {
            const lastPageData = lastPage?.data?.data;
            if (lastPageData?.current_page < lastPageData?.last_page) {
                return lastPageData.current_page + 1;
            }
            return undefined;
        },
        initialPageParam: 1
    });

    useHandleQueryError(getLoggedInUserNotificationsQuery);

    const mappedNewNotifications: Notification[] = getLoggedInUserNotificationsQuery?.data?.pages.flatMap((page) => page?.data?.data?.data) || [];
    const newNotificationsCount: number = getLoggedInUserNotificationsQuery?.data?.pages?.[0]?.data?.unread_notifications_count ?? 0;
    const totalNotificationsCount: number = getLoggedInUserNotificationsQuery?.data?.pages?.[0]?.data?.total_notifications_count ?? 0;

    const markAsSeenMutation = useMutation({
        mutationFn: postToMarkNotificationAsViewed,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
        },
    });

    useHandleMutationError(markAsSeenMutation?.error);

    const handleMarkAsSeen = (notification: Notification): void => {
        if (notification?.seen === false && loggedInUserData) {
            markAsSeenMutation.mutate({
                notification_id: notification?.id
            });
        }
    };

    const toggleOverlay = (e: React.MouseEvent<HTMLButtonElement>): void => {
        overlayRef.current?.toggle(e);
    };

    const handleMarkAllAsRead = (): void => {
        const unreadNotifications = mappedNewNotifications.filter((notif: Notification) => !notif.seen);
        unreadNotifications.forEach((notification: Notification) => {
            markAsSeenMutation.mutate({
                notification_id: notification.id
            });
        });
    };

    return (
        <>
            {/* Trigger Button */}
            {/* Notification Trigger Button */}
            <div className="relative">
                <button
                    onClick={toggleOverlay}
                    className="relative flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 bg-white text-surface-600 dark:border-gray-800 dark:bg-gray-900 dark:text-surface-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                    {/* Bell Icon */}
                    <i className="pi pi-bell text-xl text-gray-500 dark:text-gray-300"></i>

                    {/* Notification ping or badge */}
                    {getLoggedInUserNotificationsQuery?.isPending ? (
                        <div className="absolute -top-1 -right-1">
                            <ProgressSpinner style={{ width: '12px', height: '12px' }} strokeWidth="6" />
                        </div>
                    ) : (
                        newNotificationsCount > 0 && (
                            <span className="absolute -top-1 -right-2 flex items-center justify-center w-6 h-6">
                                {/* Ping animation */}
                                <span className="absolute inline-flex w-full h-full rounded-full bg-blue-500 opacity-75 animate-ping"></span>
                                {/* Solid circle */}
                                <span className="relative flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-blue-500 rounded-full">
                                    {newNotificationsCount > 99 ? '99+' : newNotificationsCount}
                                </span>
                            </span>
                        )
                    )}
                </button>
            </div>





            {/* Overlay Panel */}
            <OverlayPanel
                ref={overlayRef}
                className="max-w-sm shadow-xl border border-surface-200 dark:border-surface-700"
                style={{ maxHeight: '80vh' }}
            >
                <div className="relative">
                    {/* Header */}
                    <div className="p-4 border-b border-surface-200 dark:border-gray-800 bg-surface-50 dark:bg-surface-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <i className="pi pi-bell text-xl text-primary-500"></i>
                                <div>
                                    <h3 className="font-semibold text-surface-900 dark:text-surface-100">
                                        Notifications
                                    </h3>
                                    <p className="text-sm text-surface-500">
                                        {totalNotificationsCount} total, {newNotificationsCount} unread
                                    </p>
                                </div>
                            </div>

                            {newNotificationsCount > 0 && (
                                <Button
                                    label="Mark all read"
                                    className="p-button-text p-button-sm text-primary-600 hover:text-primary-700"
                                    onClick={handleMarkAllAsRead}
                                    disabled={markAsSeenMutation.isPending}
                                />
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <ScrollPanel style={{ height: '400px' }} className="custom-scrollbar">
                        {getLoggedInUserNotificationsQuery?.isPending ? (
                            <div className="flex flex-col items-center justify-center p-8">
                                <Lottie
                                    animationData={SkeletonLoadingLottie}
                                    loop={true}
                                    style={{ height: "200px" }}
                                    autoplay={true}
                                />
                                <p className="text-surface-500 text-sm mt-2">Loading notifications...</p>
                            </div>
                        ) : getLoggedInUserNotificationsQuery?.isError ? (
                            <div className="flex flex-col items-center justify-center p-8">
                                <Lottie
                                    animationData={SnailErrorLottie}
                                    loop={true}
                                    autoplay={true}
                                    style={{ height: "150px" }}
                                />
                                <p className="text-surface-500 text-sm text-center mt-2">
                                    Failed to load notifications
                                </p>
                            </div>
                        ) : mappedNewNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8">
                                <Lottie
                                    animationData={NoDataLottie}
                                    loop={true}
                                    autoplay={true}
                                    style={{ height: "150px" }}
                                />
                                <p className="text-surface-500 text-sm text-center">
                                    No notifications yet
                                </p>
                            </div>
                        ) : (
                            <>
                                {mappedNewNotifications.map((notification: Notification, index: number) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onVisible={handleMarkAsSeen}
                                        isLast={index === mappedNewNotifications.length - 1}
                                    />
                                ))}

                                {/* Load More Button */}
                                {getLoggedInUserNotificationsQuery?.hasNextPage && (
                                    <div className="p-4 border-t border-surface-200 dark:border-surface-700">
                                        <Button
                                            label={getLoggedInUserNotificationsQuery?.isFetchingNextPage ? "Loading..." : "Load More"}
                                            className="w-full p-button-outlined"
                                            icon={getLoggedInUserNotificationsQuery?.isFetchingNextPage ? "pi pi-spinner pi-spin" : "pi pi-chevron-down"}
                                            onClick={() => getLoggedInUserNotificationsQuery?.fetchNextPage()}
                                            disabled={getLoggedInUserNotificationsQuery?.isFetchingNextPage}
                                            size="small"
                                        />
                                    </div>
                                )}

                                {!getLoggedInUserNotificationsQuery?.hasNextPage && mappedNewNotifications.length > 5 && (
                                    <div className="p-4 border-t border-surface-200 dark:border-surface-700 text-center">
                                        <p className="text-surface-400 text-xs">
                                            All notifications loaded
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </ScrollPanel>
                </div>

            </OverlayPanel>

            <style jsx global>{`
                .custom-scrollbar .p-scrollpanel-bar-y {
                    background: var(--primary-color);
                    border-radius: 6px;
                    width: 4px;
                    opacity: 0.7;
                }
                
                .custom-scrollbar .p-scrollpanel-bar-y:hover {
                    opacity: 1;
                }

                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </>
    );
};

export default NotificationsOverlay;