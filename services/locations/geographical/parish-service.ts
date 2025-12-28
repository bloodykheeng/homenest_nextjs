import axiosAPI from "../../axiosApi";

export async function getAllParish(params = {}) {
  const response = await axiosAPI.get("parishes", { params: params });
  return response;
}

export async function getParishById(id: any) {
  const response = await axiosAPI.get(`parishes/` + id);
  return response;
}

export async function postParish(data: any) {
  const response = await axiosAPI.post(`parishes`, data);
  return response;
}

export async function updateParish(id: any, data: any) {
  const response = await axiosAPI.put(`parishes/${id}`, data);
  return response;
}

export async function deleteParishById(id: any) {
  const response = await axiosAPI.delete(`parishes/${id}`);
  return response;
}

export async function postToBulkDestroyParishes(data: any) {
  const response = await axiosAPI.post(`bulk-destroy-parishes`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}
