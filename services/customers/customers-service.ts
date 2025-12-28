import axiosAPI from "../axiosApi";

export async function getAllCustomers(params = {}) {
  const response = await axiosAPI.get("customers", { params });
  return response;
}

export async function getCustomerById(id: any) {
  const response = await axiosAPI.get(`customers/${id}`);
  return response;
}

export async function postCustomer(data: any) {
  const response = await axiosAPI.post("customers", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}

export async function updateCustomer(id: any, data: any) {
  const response = await axiosAPI.post(`customers/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}

export async function patchCustomer(id: any, data: any) {
  const response = await axiosAPI.patch(`customers/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}

export async function deleteCustomerById(id: any) {
  const response = await axiosAPI.delete(`customers/${id}`);
  return response;
}

export async function postToBulkDestroyCustomers(data: any) {
  const response = await axiosAPI.post("bulk-destroy-customers", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}

