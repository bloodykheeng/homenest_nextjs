import axiosAPI from "../../axiosApi";

export async function getAllTerritories(params = {}) {
  const response = await axiosAPI.get("territories", { params });
  return response;
}

export async function getTerritoryById(id: any) {
  const response = await axiosAPI.get(`territories/${id}`);
  return response;
}

export async function postTerritory(data: any) {
  const response = await axiosAPI.post("territories", data);
  return response;
}

export async function updateTerritory(id: any, data: any) {
  const response = await axiosAPI.put(`territories/${id}`, data);
  return response;
}

export async function deleteTerritoryById(id: any) {
  const response = await axiosAPI.delete(`territories/${id}`);
  return response;
}

export async function postToBulkDestroyTerritories(data: any) {
  const response = await axiosAPI.post("bulk-destroy-territories", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}
