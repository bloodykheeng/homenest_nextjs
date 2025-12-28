import axiosAPI from "../axiosApi";

export async function getAllCustomerMerchandises(params: any = {}) {
    const response = await axiosAPI.get("customer-merchandises", { params });
    return response;
}

export async function getCustomerMerchandiseById(id: any) {
    const response = await axiosAPI.get(`customer-merchandises/${id}`);
    return response;
}

export async function postCustomerMerchandise(data: any) {
    const response = await axiosAPI.post("customer-merchandises", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateCustomerMerchandise(id: any, data: any) {
    const response = await axiosAPI.post(`customer-merchandises/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function patchCustomerMerchandise(id: any, data: any) {
    const response = await axiosAPI.patch(`customer-merchandises/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteCustomerMerchandiseById(id: any) {
    const response = await axiosAPI.delete(`customer-merchandises/${id}`);
    return response;
}

export async function postToBulkDestroyCustomerMerchandises(data: any) {
    const response = await axiosAPI.post("bulk-destroy-customer-merchandises", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}
