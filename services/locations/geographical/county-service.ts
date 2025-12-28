import axiosAPI from "../../axiosApi";

export async function getAllCounty(params = {}) {
  const response = await axiosAPI.get("counties", { params: params });
  return response;
}

export async function getCountyById(id: any) {
  const response = await axiosAPI.get(`counties/` + id);
  return response;
}

// district-county/{id}

export async function postCounty(data: any) {
  const response = await axiosAPI.post(`counties`, data);
  return response;
}

export async function updateCounty(id: any, data: any) {
  const response = await axiosAPI.put(`counties/${id}`, data);
  return response;
}

export async function deleteCountyById(id: any) {
  const response = await axiosAPI.delete(`counties/${id}`);
  return response;
}

export async function postToBulkDestroyCounties(data: any) {
  const response = await axiosAPI.post(`bulk-destroy-counties`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}
