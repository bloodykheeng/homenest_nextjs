"use client";

import React from "react";
import { FiCheckCircle, FiX, FiLogIn, FiInfo } from "react-icons/fi";

interface SuccessDialogProps {
    visible: boolean;
    email: string;
    onBackToLogin: () => void;
    onClose: () => void;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({
    visible,
    email,
    onBackToLogin,
    onClose,
}) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                {/* Success Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <FiCheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                </div>

                {/* Success Message */}
                <h3 className="mb-3 text-center text-2xl font-bold text-gray-800 dark:text-white">
                    Congratulations!
                </h3>
                <p className="mb-2 text-center text-lg text-gray-600 dark:text-gray-400">
                    Your password has been successfully reset.
                </p>
                <p className="mb-6 text-center text-gray-500 dark:text-gray-500">
                    You can now login with your new password for:
                </p>

                {/* Email Display */}
                <div className="mb-6 w-full rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
                    <strong className="block text-center text-lg text-gray-800 dark:text-white">
                        {email}
                    </strong>
                </div>

                {/* Action Buttons */}
                <div className="flex w-full flex-col gap-3">
                    <button
                        onClick={onBackToLogin}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-white transition-all hover:bg-primary/90"
                    >
                        <FiLogIn className="h-5 w-5" />
                        Back to Login
                    </button>

                    <button
                        onClick={onClose}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        <FiX className="h-5 w-5" />
                        Close
                    </button>
                </div>

                {/* Additional Info */}
                <div className="mt-6 w-full rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <small className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                        <FiInfo className="h-4 w-4 text-blue-500" />
                        Make sure to remember your new password for future logins.
                    </small>
                </div>
            </div>
        </div>
    );
};

export default SuccessDialog;