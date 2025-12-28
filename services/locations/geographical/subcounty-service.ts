import axiosAPI from "../../axiosApi";

export async function getAllSubcounty(params = {}) {
  const response = await axiosAPI.get("subcounties", { params: params });
  return response;
}

export async function getSubcountyById(id: any) {
  const response = await axiosAPI.get(`subcounties/` + id);
  return response;
}

export async function postSubcounty(data: any) {
  const response = await axiosAPI.post(`subcounties`, data);
  return response;
}

export async function updateSubcounty(id: any, data: any) {
  const response = await axiosAPI.put(`subcounties/${id}`, data);
  return response;
}

export async function deleteSubcountyById(id: any) {
  const response = await axiosAPI.delete(`subcounties/${id}`);
  return response;
}

export async function postToBulkDestroySubCounties(data: any) {
  const response = await axiosAPI.post(`bulk-destroy-subcounties`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}
