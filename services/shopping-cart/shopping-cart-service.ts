import axiosAPI from "../axiosApi";

export async function getAllCarts(params = {}) {
    const response = await axiosAPI.get("shopping-carts", { params });
    return response;
}

export async function getCartById(id: number | string) {
    const response = await axiosAPI.get(`shopping-carts/${id}`);
    return response;
}

export async function postCart(data: any) {
    const response = await axiosAPI.post("shopping-carts", data);
    return response;
}

export async function updateCart(id: number | string, data: any) {
    const response = await axiosAPI.put(`shopping-carts/${id}`, data);
    return response;
}

export async function deleteCartById(id: number | string) {
    const response = await axiosAPI.delete(`shopping-carts/${id}`);
    return response;
}

export async function postToSyncCart(data: any) {
    const response = await axiosAPI.post("shopping-carts/sync", data);
    return response;
}

export async function clearCart() {
    const response = await axiosAPI.delete("shopping-carts-clear");
    return response;
}

export async function getCartCount() {
    const response = await axiosAPI.get("shopping-carts-count");
    return response;
}