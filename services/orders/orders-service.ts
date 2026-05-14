import axiosAPI from "../axiosApi";

export async function getAllOrders(params = {}) {
    const response = await axiosAPI.get("orders", { params });
    return response;
}

export async function getOrderById(id: number | string | undefined) {
    const response = await axiosAPI.get(`orders/${id}`);
    return response;
}

export async function postOrder(data: any) {
    const response = await axiosAPI.post("orders", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateOrder(id: number | string, data: any) {
    const response = await axiosAPI.post(`orders/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function patchOrder(id: number | string, data: any) {
    const response = await axiosAPI.patch(`orders/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteOrderById(id: number | string) {
    const response = await axiosAPI.delete(`orders/${id}`);
    return response;
}

export async function postToBulkDestroyOrders(data: any) {
    const response = await axiosAPI.post("bulk-destroy-orders", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

// JSON-based order creation used by the checkout page (supports nested items array)
export async function createOrder(data: any) {
    const response = await axiosAPI.post("orders", data);
    return response;
}
