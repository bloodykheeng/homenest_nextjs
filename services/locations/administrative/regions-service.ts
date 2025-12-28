import axiosAPI from "../../axiosApi";

export async function getAllRegions(params = {}) {
  const response = await axiosAPI.get("regions", { params });
  return response;
}

export async function getRegionById(id: any) {
  const response = await axiosAPI.get(`regions/${id}`);
  return response;
}

export async function postRegion(data: any) {
  const response = await axiosAPI.post("regions", data);
  return response;
}

export async function updateRegion(id: any, data: any) {
  const response = await axiosAPI.put(`regions/${id}`, data);
  return response;
}

export async function deleteRegionById(id: any) {
  const response = await axiosAPI.delete(`regions/${id}`);
  return response;
}

export async function postToBulkDestroyRegions(data: any) {
  const response = await axiosAPI.post("bulk-destroy-regions", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}
