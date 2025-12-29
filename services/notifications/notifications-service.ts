import axiosAPI from "../axiosApi";

// ============ Notification Management ============

export async function getAllNotifications(params = {}) {
    const response = await axiosAPI.get("notifications", { params });
    return response;
}

export async function getNotificationById(id: number | string | undefined) {
    const response = await axiosAPI.get(`notifications/${id}`);
    return response;
}

export async function postNotification(data: any) {
    const response = await axiosAPI.post("notifications", data);
    return response;
}

export async function updateNotification(id: number | string, data: any) {
    const response = await axiosAPI.put(`notifications/${id}`, data);
    return response;
}

export async function patchNotification(id: number | string, data: any) {
    const response = await axiosAPI.patch(`notifications/${id}`, data);
    return response;
}

export async function deleteNotificationById(id: number | string) {
    const response = await axiosAPI.delete(`notifications/${id}`);
    return response;
}

export async function postToBulkDestroyNotifications(data: any) {
    const response = await axiosAPI.post("bulk-destroy-notifications", data);
    return response;
}

// ============ Other Notification-Specific APIs ============

export async function getLoggedInUserNotifications(params = {}) {
    const response = await axiosAPI.get("getAuthUserNotifications", { params });
    return response;
}

// Get who viewed a notification (users/customers/agents)
export async function getNotificationViewedBies(params: any) {
    // requires { notification_id: number, ...optional filters }
    const response = await axiosAPI.get("getNotificationViewedBies", { params });
    return response;
}

// Mark a notification as viewed by the authenticated actor (user/customer/agent)
export async function postToMarkNotificationAsViewed(data: { notification_id: number | string }) {
    const response = await axiosAPI.post("markNotificationAsViewed", data);
    return response;
}
