import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '@/services/users/users-service';
import moment from 'moment';

import useHandleQueryError from "@/hooks/useHandleQueryError";

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

interface MultipleUserSelectTableProps {
    setValue: any;
    selectedUsers: User[];
    gender: string | null;
    fieldName: string;
}

const MultipleUserSelectTable: React.FC<MultipleUserSelectTableProps> = ({
    setValue,
    selectedUsers = [],
    gender,
    fieldName,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [globalSearch, setGlobalSearch] = useState('');
    const [globalSearchTerm, setGlobalSearchTerm] = useState('');

    const getUsersQuery = useQuery({
        queryKey: [
            'users',
            currentPage,
            rowsPerPage,
            globalSearchTerm,
            gender,
        ],
        queryFn: () => getAllUsers({
            page: currentPage,
            rowsPerPage,
            search: globalSearchTerm,
            paginate: true,
            gender: gender,
        }),
    });

    useHandleQueryError(getUsersQuery);

    const users = getUsersQuery?.data?.data?.data?.data || [];
    const totalRecords = getUsersQuery?.data?.data?.data?.total || 0;

    const onPageChange = (event: any) => {
        const newPage = (event?.page ?? 0) + 1;
        setFirst(event.first);
        setCurrentPage(newPage);
        setRowsPerPage(event?.rows);
    };

    const handleSearch = (e: React.MouseEvent) => {
        e.preventDefault();
        setGlobalSearchTerm(globalSearch);
        setCurrentPage(1);
        setFirst(0);
    };

    const onSelectionChange = (e: any) => {
        setValue(fieldName, e.value);
    };

    const removeSelectedUser = (user: User, e: React.MouseEvent) => {
        e.preventDefault();
        const updatedUsers = selectedUsers.filter(item => item.id !== user.id);
        setValue(fieldName, updatedUsers);
    };

    const clearAllSelections = (e: React.MouseEvent) => {
        e.preventDefault();
        setValue(fieldName, []);
    };

    const formatDate = (date?: string): string =>
        date ? moment(date).format('MMM Do YYYY') : 'N/A';

    if (getUsersQuery.isLoading) {
        return (
            <div className="flex justify-content-center">
                <ProgressSpinner style={{ width: '50px', height: '50px' }} />
            </div>
        );
    }

    if (getUsersQuery.isError) {
        return (
            <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded">
                Error loading users. Please try again.
            </div>
        );
    }

    return (
        <Card className="mb-4">
            <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2 border-b pb-1">Select Users</h4>
                {selectedUsers.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">Selected Users ({selectedUsers.length})</div>
                            <Button
                                label="Clear All"
                                icon="pi pi-trash"
                                outlined
                                severity='danger'
                                onClick={clearAllSelections}
                                tooltip="Clear all selections"
                            />
                        </div>
                        <div className="p-3 mb-3 border border-blue-200 bg-blue-50 rounded">
                            {selectedUsers.map(user => (
                                <div key={user.id} className="flex justify-between items-center mb-2 last:mb-0">
                                    <div>
                                        {user.name} ({user.email})
                                    </div>
                                    <Button
                                        icon="pi pi-times"
                                        className="p-button-rounded p-button-text p-button-danger p-button-sm"
                                        onClick={(e) => removeSelectedUser(user, e)}
                                        tooltip="Remove selection"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-inputgroup w-full md:w-30rem lg:w-30rem mb-3">
                <InputText
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    placeholder="Search users..."
                />
                <Button icon="pi pi-search" onClick={handleSearch} />
            </div>

            <DataTable
                value={users}
                selection={selectedUsers}
                onSelectionChange={onSelectionChange}
                dataKey="id"
                paginator
                rows={rowsPerPage}
                totalRecords={totalRecords}
                lazy
                first={first}
                onPage={onPageChange}
                loading={getUsersQuery.isLoading}
                emptyMessage="No users found."
                className="p-datatable-sm"
                responsiveLayout="scroll"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                <Column field="name" header="Name" sortable />
                <Column field="email" header="Email" sortable />
                <Column field="phone" header="Phone" />
                <Column field="role" header="Role" sortable />
                <Column
                    field="created_at"
                    header="Created"
                    body={(rowData) => formatDate(rowData.created_at)}
                    sortable
                />
            </DataTable>
        </Card>
    );
};

export default MultipleUserSelectTable;