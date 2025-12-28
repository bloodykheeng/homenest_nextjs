import React, { useState } from "react";
import { useInView } from 'react-intersection-observer';
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
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

import MaterialUiLoaderLottie from "@/public/lottie-files/material-ui-loading-lottie.json";
import SnailErrorLottie from "@/public/lottie-files/snail-error-lottie.json";
// import SateLiteLottie from "@/public/lottie-files/satelite-loading-lottie.json";
// import FileLoadingLottie from "@/public/lottie-files/FileLoadingLottie.json";
import SkeletonLoadingLottie from "@/public/lottie-files/SkeletonLoadingLottie.json";
import NoDataLottie from "@/public/lottie-files/nodata.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Component to observe visibility of a notification using react-intersection-observer
const NotificationItem = ({ notification, onVisible }: { notification: any, onVisible: (notification: any) => void }) => {
    // Setup the intersection observer hook with threshold 0.5 (50% visibility)
    const { ref } = useInView({
        threshold: 0.5,
        triggerOnce: true, // Only trigger once
        onChange: (inView) => {
            // When notification comes into view and hasn't been seen yet
            if (inView && !notification.seen) {
                onVisible(notification);
            }
        },
    });

    const formatDate = (date: any) => {
        return date && moment(date, moment.ISO_8601, true).isValid()
            ? moment(date).format("YYYY-MM-DD HH:mm:ss")
            : "N/A";
    };

    return (
        <div
            ref={!notification.seen ? ref : null}
            className={`p-4 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-4 ${notification?.seen
                ? "border-l-green-500 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700"
                : "border-l-blue-500 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-800"
                }`}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <span className={notification?.seen ? "text-green-500" : "text-blue-500"}>
                        {notification?.seen ? "✔✔" : "🔔"}
                    </span>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        {notification.title}
                    </h3>
                </div>

                <div className="flex items-center ml-2">
                    {notification?.seen ? (
                        <i className="pi pi-check-circle text-green-500 text-sm" />
                    ) : (
                        <i className="pi pi-circle text-blue-500 text-sm" />
                    )}
                </div>
            </div>

            <p className="text-sm leading-relaxed mb-3 text-gray-700 dark:text-gray-300">
                <InlineExpandableText text={notification?.description} maxLength={100} />
            </p>

            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <span className={notification?.seen ? "text-green-500" : "text-blue-500"}>📅</span>
                    <span>{moment(notification.created_at).format('MMM D, YYYY • HH:mm')}</span>
                </div>

                {!notification?.seen && (
                    <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30 rounded-full flex items-center gap-1">
                        <span className="text-blue-500">✨</span>
                        New
                    </span>
                )}
            </div>
        </div>
    );
};

const NotificationsSidebar = () => {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();
    const { getUserQuery } = useAuthContext();
    const loggedInUserData = getUserQuery?.data?.data;

    const getLoggedInUserNotificationsQuery = useInfiniteQuery({
        queryKey: ["user-notifications"],
        queryFn: (params) => getLoggedInUserNotifications({ ...params, page: params?.pageParam, paginate: true }),
        getNextPageParam: (lastPage, pages) => {
            const lastPageData = lastPage?.data?.data;
            // console.log("🚀 ~ NotificationsSidebar ~ lastPageData:", lastPageData)

            if (lastPageData?.current_page < lastPageData?.last_page) {
                return lastPageData.current_page + 1;
            }

            return undefined;
        },
        initialPageParam: 1
    });



    console.log("🚀 ~ NotificationsSidebar ~ getLoggedInUserNotificationsQuery:", getLoggedInUserNotificationsQuery)


    useHandleQueryError(getLoggedInUserNotificationsQuery);

    const mappedNewNotifications = getLoggedInUserNotificationsQuery?.data?.pages.flatMap((page) => page?.data?.data?.data) || [];
    const newNotificationsCount = getLoggedInUserNotificationsQuery?.data?.pages?.[0]?.data?.unread_notifications_count ?? 0;
    const totalNotificationsCount = getLoggedInUserNotificationsQuery?.data?.pages?.[0]?.data?.total_notifications_count ?? 0;

    console.log("🚀 ~ NotificationsSidebar ~ newNotificationsCount:", newNotificationsCount)

    const markAsSeenMutation = useMutation({
        mutationFn: postToMarkNotificationAsViewed,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
        },
    });

    useHandleMutationError(markAsSeenMutation?.error);

    const handleMarkAsSeen = (notification: any) => {
        if (notification?.seen === false && loggedInUserData) {
            markAsSeenMutation.mutate({
                notification_id: notification?.id
            });
        }
    };

    return (
        <>
            <div className="relative">
                <Button
                    severity="info"
                    text
                    className="flex mt-1 mb-1 items-center gap-2"
                    onClick={() => setVisible(true)}
                >
                    <i className="pi pi-bell dark:text-gray-600" style={{ fontSize: '1.5rem' }}></i>
                </Button>
                {getLoggedInUserNotificationsQuery?.isLoading ? (
                    <div className="absolute top-0 right-0">
                        <ProgressSpinner style={{ width: '10px', height: '10px' }} strokeWidth="5" />
                    </div>
                ) : (
                    newNotificationsCount > 0 && (
                        <Badge
                            value={newNotificationsCount}
                            severity="success"
                            className="absolute top-0 right-0"
                        />
                    )
                )}
            </div>

            <Sidebar
                visible={visible}
                position="right"
                onHide={() => setVisible(false)}
                header={
                    <span className="flex flex-wrap gap-4 justify-center">
                        <i className="pi pi-bell dark:text-gray-600" style={{ fontSize: '1.5rem' }}></i>
                        Notifications
                    </span>
                }
                className="w-80 md:w-96"
            >
                {getLoggedInUserNotificationsQuery?.isLoading ? (
                    <div className="w-full">
                        <div className="w-full flex items-center justify-center">
                            <div className="max-w-full">
                                <Lottie animationData={SkeletonLoadingLottie} loop={true} style={{ height: "300px" }} autoplay={true} />
                                <Lottie animationData={MaterialUiLoaderLottie} style={{ height: "50px" }} loop={true} autoplay={true} />
                            </div>
                        </div>
                    </div>
                ) : getLoggedInUserNotificationsQuery?.isError ? (
                    <div className="w-full flex items-center justify-center">
                        <div className="max-w-md">
                            <Lottie animationData={SnailErrorLottie} loop={true} autoplay={true} />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mt-3">
                            <div className="text-gray-500 mb-2">
                                {Array.isArray(mappedNewNotifications) &&
                                    mappedNewNotifications?.length === 0 ? (
                                    <div className="border-b border-gray-200">You have no notifications yet</div>
                                ) : (
                                    <></>
                                )}
                            </div>

                            <div className="grid">
                                {Array.isArray(mappedNewNotifications) &&
                                    mappedNewNotifications?.length === 0 && (
                                        <div className="w-full flex items-center justify-center">
                                            <div className="max-w-md">
                                                <Lottie animationData={NoDataLottie} loop={true} autoplay={true} />
                                            </div>
                                        </div>
                                    )}

                                {mappedNewNotifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onVisible={handleMarkAsSeen}
                                    />
                                ))}
                            </div>

                            {getLoggedInUserNotificationsQuery?.hasNextPage && (
                                <div className="flex justify-center my-4">
                                    <Button
                                        label={getLoggedInUserNotificationsQuery?.isFetchingNextPage ? "Loading more data..." : "Load More"}
                                        className="p-button-outlined"
                                        icon={getLoggedInUserNotificationsQuery?.isFetchingNextPage ? "pi pi-spinner pi-spin" : ""}
                                        onClick={() => getLoggedInUserNotificationsQuery?.fetchNextPage()}
                                        disabled={getLoggedInUserNotificationsQuery?.isFetchingNextPage}
                                    />
                                </div>
                            )}
                            {!getLoggedInUserNotificationsQuery?.hasNextPage && mappedNewNotifications.length > 0 && (
                                <div className="flex justify-center my-4">
                                    <Button label="End" className="p-button-secondary" disabled />
                                </div>
                            )}
                        </div>
                    </>
                )}
            </Sidebar>
        </>
    );
};

export default NotificationsSidebar;