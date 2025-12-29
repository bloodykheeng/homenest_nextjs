import axiosAPI from "../axiosApi";

export async function getAllProductSubcategories(params = {}) {
  const response = await axiosAPI.get("product-subcategories", { params });
  return response;
}

export async function getProductSubcategoryById(id: number | string | undefined) {
  const response = await axiosAPI.get(`product-subcategories/${id}`);
  return response;
}

export async function postProductSubcategory(data: any) {
  const response = await axiosAPI.post("product-subcategories", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}

export async function updateProductSubcategory(id: number | string, data: any) {
  const response = await axiosAPI.post(`product-subcategories/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}

export async function patchProductSubcategory(id: number | string, data: any) {
  const response = await axiosAPI.patch(`product-subcategories/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}

export async function deleteProductSubcategoryById(id: number | string) {
  const response = await axiosAPI.delete(`product-subcategories/${id}`);
  return response;
}

export async function postToBulkDestroyProductSubcategories(data: any) {
  const response = await axiosAPI.post("bulk-destroy-product-subcategories", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}