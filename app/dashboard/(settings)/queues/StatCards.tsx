import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
    FiActivity,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiPause,
    FiTrendingUp,
    FiUsers,
    FiServer,
    FiAlertTriangle,
    FiInfo
} from "react-icons/fi";
import { getAllJobStats } from "@/services/jobs/jobs-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";

// Define types for the component
interface JobStat {
    name: string;
    value: string | number;
    icon?: string;
    description: string;
    type?: 'success' | 'error' | 'warning' | 'info' | 'primary';
}

interface JobStatsResponse {
    data: {
        data: JobStat[];
    };
}

interface StatCardProps {
    stat: JobStat;
    index: number;
}

// Icon mapping based on stat name/type
const getStatIcon = (stat: JobStat) => {
    const iconProps = { size: 32, className: "mx-auto" };

    // Check for specific stat names first
    const name = stat.name.toLowerCase();
    if (name.includes('completed') || name.includes('success')) {
        return <FiCheckCircle {...iconProps} />;
    }
    if (name.includes('failed') || name.includes('error')) {
        return <FiXCircle {...iconProps} />;
    }
    if (name.includes('pending') || name.includes('waiting') || name.includes('queued')) {
        return <FiClock {...iconProps} />;
    }
    if (name.includes('running') || name.includes('processing')) {
        return <FiActivity {...iconProps} />;
    }
    if (name.includes('paused') || name.includes('delayed')) {
        return <FiPause {...iconProps} />;
    }
    if (name.includes('total') || name.includes('count')) {
        return <FiTrendingUp {...iconProps} />;
    }
    if (name.includes('worker') || name.includes('user')) {
        return <FiUsers {...iconProps} />;
    }
    if (name.includes('server') || name.includes('queue')) {
        return <FiServer {...iconProps} />;
    }

    // Fallback based on type
    switch (stat.type) {
        case 'success':
            return <FiCheckCircle {...iconProps} />;
        case 'error':
            return <FiXCircle {...iconProps} />;
        case 'warning':
            return <FiAlertTriangle {...iconProps} />;
        case 'info':
            return <FiInfo {...iconProps} />;
        default:
            return <FiActivity {...iconProps} />;
    }
};

// Color scheme mapping
const getStatColors = (stat: JobStat) => {
    const name = stat.name.toLowerCase();

    // Determine type if not explicitly set
    let type = stat.type;
    if (!type) {
        if (name.includes('completed') || name.includes('success')) {
            type = 'success';
        } else if (name.includes('failed') || name.includes('error')) {
            type = 'error';
        } else if (name.includes('pending') || name.includes('waiting')) {
            type = 'warning';
        } else if (name.includes('running') || name.includes('processing')) {
            type = 'info';
        } else {
            type = 'primary';
        }
    }

    const colorSchemes = {
        success: {
            icon: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-200 dark:border-green-800',
            value: 'text-green-700 dark:text-green-300'
        },
        error: {
            icon: 'text-red-600 dark:text-red-400',
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-200 dark:border-red-800',
            value: 'text-red-700 dark:text-red-300'
        },
        warning: {
            icon: 'text-yellow-600 dark:text-yellow-400',
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
            border: 'border-yellow-200 dark:border-yellow-800',
            value: 'text-yellow-700 dark:text-yellow-300'
        },
        info: {
            icon: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-200 dark:border-blue-800',
            value: 'text-blue-700 dark:text-blue-300'
        },
        primary: {
            icon: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-50 dark:bg-purple-900/20',
            border: 'border-purple-200 dark:border-purple-800',
            value: 'text-purple-700 dark:text-purple-300'
        }
    };

    return colorSchemes[type];
};

// Individual stat card component
const StatCard: React.FC<StatCardProps> = ({ stat, index }) => {
    const colors = getStatColors(stat);
    const icon = getStatIcon(stat);

    return (
        <div className="w-full md:w-1/2 lg:w-1/4 p-2">
            <div className={`
                bg-white dark:bg-gray-800 
                rounded-lg shadow-md hover:shadow-lg 
                transition-all duration-200 p-4 text-center 
                border ${colors.border}
                ${colors.bg}
                group cursor-pointer
                hover:scale-105 transform
            `}>
                {/* Icon Header */}
                <div className={`mb-3 ${colors.icon}`}>
                    {icon}
                </div>

                {/* Card Content */}
                <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                        {stat.name}
                    </h3>
                    <p className={`text-2xl font-bold mb-2 ${colors.value}`}>
                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </p>

                    {/* Description tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 px-1">
                            {stat.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Loading skeleton component
const LoadingSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-6 text-center">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
            </div>
        ))}
    </div>
);

// Error component
const ErrorDisplay: React.FC<{ message?: string }> = ({ message = "Error loading stats!" }) => (
    <div className="w-full">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-center font-medium flex items-center justify-center gap-2">
            <FiXCircle size={20} />
            {message}
        </div>
    </div>
);

// Empty state component
const EmptyState: React.FC = () => (
    <div className="w-full">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg text-center font-medium flex items-center justify-center gap-2">
            <FiInfo size={20} />
            No statistics available
        </div>
    </div>
);

const StatCards: React.FC = () => {
    const {
        data,
        isPending,
        isError,
        error
    } = useQuery<JobStatsResponse, Error>({
        queryKey: ["queues", "job-stats"],
        queryFn: getAllJobStats,
        refetchInterval: 30000, // Refetch every 30 seconds
        staleTime: 10000, // Consider data stale after 10 seconds
    });

    // Handle query errors
    useHandleQueryError({ isError, error });

    const stats = data?.data?.data;

    // Loading state
    if (isPending) {
        return <LoadingSkeleton />;
    }

    // Error state
    if (isError) {
        return (
            <div className="p-4">
                <ErrorDisplay message={error?.message || "Failed to load statistics"} />
            </div>
        );
    }

    // Empty state
    if (!stats || stats.length === 0) {
        return (
            <div className="p-4">
                <EmptyState />
            </div>
        );
    }

    // Success state
    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-full">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <FiActivity size={20} />
                    Job Statistics
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Real-time overview of job queue performance
                </p>
            </div>

            <div className="flex flex-wrap -m-2">
                {stats.map((stat, index) => (
                    <StatCard
                        key={`${stat.name}-${index}`}
                        stat={stat}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default StatCards;