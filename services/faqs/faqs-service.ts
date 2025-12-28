import axiosAPI from "../axiosApi";

export async function getAllFaqs(params = {}) {
  const response = await axiosAPI.get("faqs", { params: params });
  return response;
}

export async function getFaqsById(id: any) {
  const response = await axiosAPI.get(`faqs/` + id);
  return response;
}

export async function postFaqs(data: any) {
  const response = await axiosAPI.post(`faqs`, data);
  return response;
}

export async function updateFaqs(id: any, data: any) {
  const response = await axiosAPI.put(`faqs/${id}`, data);
  return response;
}

export async function deleteFaqById(id: any) {
  const response = await axiosAPI.delete(`faqs/${id}`);
  return response;
}

export async function postToBulkDestroyFaqs(data: any) {
  const response = await axiosAPI.post(`bulk-destroy-faqs`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}
