import axiosAPI from "../axiosApi";

export async function getAllTransactions(params = {}) {
    const response = await axiosAPI.get("transactions", { params });
    return response;
}

export async function getTransactionById(id: number | string | undefined) {
    const response = await axiosAPI.get(`transactions/${id}`);
    return response;
}

export async function postTransaction(data: any) {
    const response = await axiosAPI.post("transactions", data);
    return response;
}

export async function updateTransaction(id: number | string, data: any) {
    const response = await axiosAPI.put(`transactions/${id}`, data);
    return response;
}

export async function deleteTransactionById(id: number | string) {
    const response = await axiosAPI.delete(`transactions/${id}`);
    return response;
}

export async function postToBulkDestroyTransactions(data: any) {
    const response = await axiosAPI.post("bulk-destroy-transactions", data);
    return response;
}
