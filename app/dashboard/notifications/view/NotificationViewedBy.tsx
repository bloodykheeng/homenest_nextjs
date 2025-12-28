import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';

import useHandleQueryError from "@/hooks/useHandleQueryError";

// Import the service (you'll need to create this)
import { getNotificationViewedBies } from '@/services/notifications/notifications-service';

// Define types
type User = {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    role?: string;
    status?: string;
    gender?: string;
    [key: string]: any;
};

type NotificationView = {
    id: number;
    notification_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    user: User;
};

interface NotificationViewedByProps {
    notificationId: number | string;
}

const NotificationViewedBy: React.FC<NotificationViewedByProps> = ({ notificationId }) => {
    // State for pagination and search
    const [currentPage, setCurrentPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [globalSearch, setGlobalSearch] = useState('');
    const [globalSearchTerm, setGlobalSearchTerm] = useState('');

    // Fetch notification viewed data with React Query
    const viewedByQuery = useQuery({
        queryKey: [
            'notifications',
            'notification-viewed-by',
            notificationId,
            currentPage,
            rowsPerPage,
            globalSearchTerm
        ],
        queryFn: () => getNotificationViewedBies({
            notification_id: notificationId,
            page: currentPage,
            rowsPerPage,
            search: globalSearchTerm,
            paginate: true
        }),
        enabled: !!notificationId
    });

    useHandleQueryError(viewedByQuery);

    // Extract data and pagination details
    const viewedBy = viewedByQuery?.data?.data?.data?.data || [];
    const totalRecords = viewedByQuery?.data?.data?.data?.total || 0;
    const perPage = viewedByQuery?.data?.data?.data?.per_page || 10;

    // Handle page change
    const onPageChange = (event: any) => {
        const newPage = (event?.page ?? 0) + 1;
        setFirst(event.first);
        setCurrentPage(newPage);
        setRowsPerPage(event?.rows);
    };

    // Handle search
    const handleSearch = (e: React.MouseEvent) => {
        e.preventDefault();
        setGlobalSearchTerm(globalSearch);
        setCurrentPage(1);
        setFirst(0);
    };

    // Format date utility
    const formatDate = (date?: string): string =>
        date ? moment(date).format('MMM Do YYYY, h:mm a') : 'N/A';

    // Loading state
    if (viewedByQuery.isLoading) {
        return (
            <div className="flex justify-content-center">
                <ProgressSpinner style={{ width: '50px', height: '50px' }} />
            </div>
        );
    }

    // Error state
    if (viewedByQuery.isError) {
        return (
            <div className="p-4 border-1 border-red-200 bg-red-50 text-red-700 rounded">
                Error loading view data. Please try again.
            </div>
        );
    }

    return (
        <Card className="mb-4">
            <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2 border-b pb-1">Users Who Viewed This Notification</h4>
                <div className="text-sm text-gray-600 mb-2">Total views: {totalRecords}</div>
            </div>

            <div className="p-inputgroup w-[30rem] md:w-[60%] sm:w-full mb-3">
                <InputText
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    placeholder="Search users..."
                />
                <Button icon="pi pi-search" onClick={handleSearch} />
            </div>

            <DataTable
                value={viewedBy}
                paginator
                rows={rowsPerPage}
                totalRecords={totalRecords}
                lazy
                first={first}
                onPage={onPageChange}
                loading={viewedByQuery.isLoading}
                emptyMessage="No views recorded yet."
                dataKey="id"
                className="p-datatable-sm"
                responsiveLayout="scroll"
            >
                <Column
                    field="user.name"
                    header="User Name"
                    body={(rowData) => rowData.user?.name || 'N/A'}
                    sortable
                />
                <Column
                    field="user.email"
                    header="Email"
                    body={(rowData) => rowData.user?.email || 'N/A'}
                    sortable
                />
                <Column
                    field="user.phone"
                    header="Phone"
                    body={(rowData) => rowData.user?.phone || 'N/A'}
                />
                <Column
                    field="user.role"
                    header="Role"
                    body={(rowData) => rowData.user?.role || 'N/A'}
                    sortable
                />
                <Column
                    field="created_at"
                    header="Viewed At"
                    body={(rowData) => formatDate(rowData.created_at)}
                    sortable
                />
            </DataTable>
        </Card>
    );
};

export default NotificationViewedBy;