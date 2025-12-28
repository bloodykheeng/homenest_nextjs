import axiosAPI from "../../axiosApi";

export async function getAllVillage(params = {}) {
  const response = await axiosAPI.get("villages", { params: params });
  return response;
}

export async function getVillageById(id: any) {
  const response = await axiosAPI.get(`villages/` + id);
  return response;
}

export async function postVillage(data: any) {
  const response = await axiosAPI.post(`villages`, data);
  return response;
}

export async function updateVillage(id: any, data: any) {
  const response = await axiosAPI.put(`villages/${id}`, data);
  return response;
}

export async function deleteVillageById(id: any) {
  const response = await axiosAPI.delete(`villages/${id}`);
  return response;
}

export async function postToBulkDestroyVillages(data: any) {
  const response = await axiosAPI.post(`bulk-destroy-villages`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}
