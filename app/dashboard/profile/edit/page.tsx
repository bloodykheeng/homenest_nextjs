import React from 'react'
import EditForm from './EditForm'

import PageBreadcrumb from "@/components/admin-panel/common/PageBreadCrumb";

function EditPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Edit Profile" />
            <EditForm />
        </div>
    )
}

export default EditPage
