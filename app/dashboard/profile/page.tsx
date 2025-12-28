import React from 'react'
import Profile from './Profile'

import PageBreadcrumb from "@/components/admin-panel/common/PageBreadCrumb";

function ProfilePage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Profile" />
            <Profile />
        </div>
    )
}

export default ProfilePage