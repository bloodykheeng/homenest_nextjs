import axiosAPI from "../axiosApi";

// ✅ Get all customer stock counts
export async function getAllCustomerStockCounts(params = {}) {
    const response = await axiosAPI.get("customer-stock-counts", { params });
    return response;
}

// ✅ Get single customer stock count by ID
export async function getCustomerStockCountById(id: any) {
    const response = await axiosAPI.get(`customer-stock-counts/${id}`);
    return response;
}

// ✅ Create new customer stock count
export async function postCustomerStockCount(data: any) {
    const response = await axiosAPI.post("customer-stock-counts", data, {
        headers: { "Content-Type": "application/json" },
    });
    return response;
}

// ✅ Update customer stock count (PUT)
export async function updateCustomerStockCount(id: any, data: any) {
    const response = await axiosAPI.put(`customer-stock-counts/${id}`, data, {
        headers: { "Content-Type": "application/json" },
    });
    return response;
}

// ✅ Partially update customer stock count (PATCH)
export async function patchCustomerStockCount(id: any, data: any) {
    const response = await axiosAPI.patch(`customer-stock-counts/${id}`, data, {
        headers: { "Content-Type": "application/json" },
    });
    return response;
}

// ✅ Delete customer stock count by ID
export async function deleteCustomerStockCountById(id: any) {
    const response = await axiosAPI.delete(`customer-stock-counts/${id}`);
    return response;
}

// ✅ Bulk delete customer stock counts
export async function postToBulkDestroyCustomerStockCounts(data: any) {
    const response = await axiosAPI.post("bulk-destroy-customer-stock-counts", data, {
        headers: { "Content-Type": "application/json" },
    });
    return response;
}
