import axiosAPI from "../axiosApi";

export async function getAllCustomerVisits(params = {}) {
  const response = await axiosAPI.get("customer-visits", { params });
  return response;
}

export async function getCustomerVisitById(id: number | string | undefined) {
  const response = await axiosAPI.get(`customer-visits/${id}`);
  return response;
}

export async function postCustomerVisit(data: any) {
  const response = await axiosAPI.post("customer-visits", data);
  return response;
}

export async function updateCustomerVisit(id: number | string, data: any) {
  const response = await axiosAPI.put(`customer-visits/${id}`, data);
  return response;
}

export async function patchCustomerVisit(id: number | string, data: any) {
  const response = await axiosAPI.patch(`customer-visits/${id}`, data);
  return response;
}

export async function deleteCustomerVisitById(id: number | string) {
  const response = await axiosAPI.delete(`customer-visits/${id}`);
  return response;
}

export async function postToBulkDestroyCustomerVisits(data: any) {
  const response = await axiosAPI.post("bulk-destroy-customer-visits", data);
  return response;
}