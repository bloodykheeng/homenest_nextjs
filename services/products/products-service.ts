import axiosAPI from "../axiosApi";

export async function getAllProducts(params = {}) {
  const response = await axiosAPI.get("products", { params });
  return response;
}

export async function getProductById(id: number | string | undefined) {
  const response = await axiosAPI.get(`products/${id}`);
  return response;
}

export async function postProduct(data: any) {
  const response = await axiosAPI.post("products", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}

export async function updateProduct(id: number | string, data: any) {
  const response = await axiosAPI.post(`products/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}

export async function patchProduct(id: number | string, data: any) {
  const response = await axiosAPI.patch(`products/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}

export async function deleteProductById(id: number | string) {
  const response = await axiosAPI.delete(`products/${id}`);
  return response;
}

export async function postToBulkDestroyProducts(data: any) {
  const response = await axiosAPI.post("bulk-destroy-products", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}