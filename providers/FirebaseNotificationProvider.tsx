"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { getMessaging, onMessage, MessagePayload, isSupported } from "firebase/messaging";
import firebaseApp from "@/firebase";
import { usePrimeReactToast } from "./PrimeReactToastProvider";
import useFcmToken from "@/hooks/useFCMToken";
import useAuthContext from "./AuthProvider";
import { saveFirebaseToken } from "@/services/firebase/firebase-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Howl } from "howler";

// ✅ Create Howl instance ONCE at module level
let notificationSound: Howl | null = null;

const getNotificationSound = () => {
    if (!notificationSound) {
        notificationSound = new Howl({
            src: ["/media/mixkit-bell-notification-933.wav"],
            volume: 0.5,
            preload: true,
            html5: true, // Better memory management
        });
    }
    return notificationSound;
};

// Define Context Type
interface NotificationContextType {
    notification: MessagePayload | null;
}

// Create Context
const FirebaseNotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
    children: ReactNode;
}

export const FirebaseNotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notification, setNotification] = useState<MessagePayload | null>(null);
    const primeReactToast = usePrimeReactToast();
    const queryClient = useQueryClient();

    const { fcmToken } = useFcmToken();
    const { getUserQuery } = useAuthContext();
    const userData = getUserQuery?.data?.data;

    const memorisedUserData = useMemo(() => userData, [userData]);

    // Mutation to save token and subscribe via Laravel API
    const saveTokenMutation = useMutation({
        mutationFn: saveFirebaseToken,
        onSuccess: (data) => {
            console.log("🚀 ~ saveTokenMutation data:", data);
        },
        onError: (error) => {
            primeReactToast.error("Failed to update notification settings.");
            console.log("saveTokenMutation Token update error:", error);
        },
    });

    // Save token when available
    useEffect(() => {
        if (fcmToken && userData) {
            const tokenData = { type: "web", firebase_token: fcmToken };
            saveTokenMutation.mutate(tokenData);
        }
    }, [fcmToken, memorisedUserData]);

    // Handle Foreground Notifications
    useEffect(() => {
        const retrieveForegroundNotifications = async () => {
            const hasFirebaseMessagingSupport = await isSupported();
            if (hasFirebaseMessagingSupport) {
                console.log("Listening for foreground notifications...");
                const messaging = getMessaging(firebaseApp);
                const unsubscribe = onMessage(messaging, (payload: MessagePayload) => {
                    console.log("Foreground push notification received:", payload);
                    setNotification(payload);

                    // ✅ Play sound - gets singleton instance
                    getNotificationSound().play();

                    // Display toast notification
                    if (payload.notification?.title) {
                        primeReactToast.success(payload?.notification?.title, payload?.notification?.body);

                        const notificationType = payload?.data?.type;
                        if (notificationType === "surveys") {
                            queryClient.invalidateQueries({ queryKey: ["surveys"] });
                        } else {
                            queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
                        }
                    }
                });

                return () => unsubscribe();
            }
        };

        retrieveForegroundNotifications();
    }, [fcmToken]);

    return (
        <FirebaseNotificationContext.Provider value={{ notification }}>
            {children}
        </FirebaseNotificationContext.Provider>
    );
};

// Custom Hook to use the notification context
export const useFirebaseNotifications = (): NotificationContextType => {
    const context = useContext(FirebaseNotificationContext);
    if (!context) {
        throw new Error("useFirebaseNotifications must be used within FirebaseNotificationProvider");
    }
    return context;
};