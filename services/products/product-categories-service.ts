import axiosAPI from "../axiosApi";

export async function getAllProductCategories(params = {}) {
  const response = await axiosAPI.get("product-categories", { params });
  return response;
}

export async function getProductCategoryById(id: number | string | undefined) {
  const response = await axiosAPI.get(`product-categories/${id}`);
  return response;
}

export async function postProductCategory(data: any) {
  const response = await axiosAPI.post("product-categories", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}

export async function updateProductCategory(id: number | string, data: any) {
  const response = await axiosAPI.post(`product-categories/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}

export async function patchProductCategory(id: number | string, data: any) {
  const response = await axiosAPI.patch(`product-categories/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}

export async function deleteProductCategoryById(id: number | string) {
  const response = await axiosAPI.delete(`product-categories/${id}`);
  return response;
}

export async function postToBulkDestroyProductCategories(data: any) {
  const response = await axiosAPI.post("bulk-destroy-product-categories", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}