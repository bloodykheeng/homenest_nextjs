"use client";
import React, { createContext, useContext, useRef, ReactNode } from "react";
import { Toast } from "primereact/toast";


// Define the context type
type PrimeReactToastContextType = {
    success: (summary: string, detail?: string) => void;
    error: (summary: string, detail?: string) => void;
    info: (summary: string, detail?: string) => void;
    warn: (summary: string, detail?: string) => void;
};

// Create the PrimeReactToastContext
const PrimeReactToastContext = createContext<PrimeReactToastContextType | undefined>(undefined);

// PrimeReactToastProvider Component
export const PrimeReactToastProvider = ({ children }: { children: ReactNode }) => {
    const toastRef = useRef<Toast>(null);

    const showToast = (severity: "success" | "error" | "info" | "warn", summary: string, detail?: string) => {
        toastRef.current?.show({ severity, summary, detail, life: 3000 });
    };

    const contextValue = {
        success: (summary: string, detail?: string) => showToast("success", summary, detail),
        error: (summary: string, detail?: string) => showToast("error", summary, detail),
        info: (summary: string, detail?: string) => showToast("info", summary, detail),
        warn: (summary: string, detail?: string) => showToast("warn", summary, detail),

    };

    return (
        <PrimeReactToastContext.Provider value={contextValue}>

            {children}
            <Toast ref={toastRef} />
        </PrimeReactToastContext.Provider>
    );
};

// Hook to use toast
export const usePrimeReactToast = () => {
    const context = useContext(PrimeReactToastContext);
    if (!context) {
        throw new Error("usePrimeReactToast must be used within a PrimeReactToastProvider");
    }
    return context;
};
