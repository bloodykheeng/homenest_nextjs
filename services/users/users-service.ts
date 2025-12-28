import axiosAPI from "../axiosApi";

export async function getAllUsers(params = {}) {
  const response = await axiosAPI.get("users", { params: params });
  return response;
}

export async function getUserById(id: number) {
  const response = await axiosAPI.get(`users/` + id);
  return response;
}

export async function postUser(data: any) {
  const response = await axiosAPI.post(`users`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}

export async function updateUser(id: number, data: any) {
  const response = await axiosAPI.post(`users/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}

export async function deleteUserById(id: number) {
  const response = await axiosAPI.delete(`users/${id}`);
  return response;
}

export async function postToBulkDestroyUsers(data: any) {
  const response = await axiosAPI.post(`bulk-destroy-users`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}

export async function postToUpdateUserProfile(data: any) {
  const response = await axiosAPI.post(`postToUpdateUserProfile`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}
