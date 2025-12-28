import axiosAPI from "../../axiosApi";

export async function getAllRoutes(params = {}) {
  const response = await axiosAPI.get("routes", { params });
  return response;
}

export async function getRouteById(id: any) {
  const response = await axiosAPI.get(`routes/${id}`);
  return response;
}

export async function postRoute(data: any) {
  const response = await axiosAPI.post("routes", data);
  return response;
}

export async function updateRoute(id: any, data: any) {
  const response = await axiosAPI.put(`routes/${id}`, data);
  return response;
}

export async function deleteRouteById(id: any) {
  const response = await axiosAPI.delete(`routes/${id}`);
  return response;
}

export async function postToBulkDestroyRoutes(data: any) {
  const response = await axiosAPI.post("bulk-destroy-routes", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}
