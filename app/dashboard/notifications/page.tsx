import React from 'react';

import RecordsList from './RecordsList'
import PageBreadcrumb from "@/components/admin-panel/common/PageBreadCrumb";

function Page() {
    return (
        <>
            {/* <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-700">
                <div className="text-6xl mb-4">🚧</div>
                <h1 className="text-2xl font-semibold mb-2">Notifications Page</h1>
                <p className="text-lg text-center px-4 max-w-md">
                    This section is still under construction. We’re working hard to bring you a better experience. Stay tuned! 🛠️
                </p>
            </div> */}
            <div>
                <PageBreadcrumb pageTitle="Notifications" />
                <RecordsList />
            </div>
        </>

    );
}

export default Page;
